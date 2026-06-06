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
    
    // Filter out items where menuItemId is missing/deleted from the database
    const validItems = cart.items.filter(item => item && item.menuItemId);
    if (validItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart contains no valid menu items' });
    }

    const orderItems = validItems.map(item => ({
      menuItemId: item.menuItemId._id,
      quantity: item.quantity,
      price: item.menuItemId.price || 0
    }));
    const tokenNumber = Math.floor(1000 + Math.random() * 9000);
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount: cart.totalPrice,
      tokenNumber,
      status: 'Pending'
    });
    for (const item of validItems) {
      if (item.menuItemId.name) {
        const inventory = await Inventory.findOne({ itemName: item.menuItemId.name });
        if (inventory) {
          inventory.quantity -= item.quantity;
          await inventory.save();
        }
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
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.menuItemId')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const originalOrder = await Order.findById(req.params.id).populate('items.menuItemId');
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
      new: true,
      runValidators: true
    });

    if (req.body.status === 'Cancelled' && originalOrder && originalOrder.status !== 'Cancelled') {
      const Inventory = require('../models/Inventory');
      for (const item of originalOrder.items) {
        if (item.menuItemId && item.menuItemId.name) {
          const inventory = await Inventory.findOne({ itemName: item.menuItemId.name });
          if (inventory) {
            inventory.quantity += item.quantity;
            await inventory.save();
          }
        }
      }
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name')
      .populate('items.menuItemId', 'name')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};
