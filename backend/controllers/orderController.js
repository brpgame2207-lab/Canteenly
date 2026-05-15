const Order = require('../models/Order');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const Inventory = require('../models/Inventory');

exports.placeOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.menuItemId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    const orderItems = cart.items.map(item => ({
      menuItemId: item.menuItemId._id,
      quantity: item.quantity,
      price: item.menuItemId.price
    }));
    const tokenNumber = Math.floor(1000 + Math.random() * 9000);
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount: cart.totalPrice,
      tokenNumber,
      status: 'Pending'
    });
    for (const item of cart.items) {
      const inventory = await Inventory.findOne({ itemName: item.menuItemId.name });
      if (inventory) {
        inventory.quantity -= item.quantity;
        await inventory.save();
      }
    }
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
