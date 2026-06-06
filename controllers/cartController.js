const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.menuItemId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [], totalPrice: 0 });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = await Cart.create({ userId: req.user.id, items: [] });
    
    const itemIndex = cart.items.findIndex(i => i.menuItemId.toString() === menuItemId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ menuItemId, quantity });
    }

    const items = await MenuItem.find({ _id: { $in: cart.items.map(i => i.menuItemId) } });
    cart.totalPrice = cart.items.reduce((acc, item) => {
      const menuItem = items.find(i => i._id.toString() === item.menuItemId.toString());
      return acc + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    cart.items = cart.items.filter(i => i.menuItemId.toString() !== req.params.itemId);
    const items = await MenuItem.find({ _id: { $in: cart.items.map(i => i.menuItemId) } });
    cart.totalPrice = cart.items.reduce((acc, item) => {
      const menuItem = items.find(i => i._id.toString() === item.menuItemId.toString());
      return acc + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);
    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

exports.syncCart = async (req, res, next) => {
  try {
    const { items: clientItems } = req.body;
    if (!Array.isArray(clientItems)) {
      return res.status(400).json({ success: false, message: 'Items must be an array' });
    }
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [], totalPrice: 0 });
    }

    cart.items = clientItems
      .filter(item => item && (item.id || item.menuItemId || item._id))
      .map(item => ({
        menuItemId: item.id || item.menuItemId || item._id,
        quantity: item.quantity || 1
      }));

    const dbItems = await MenuItem.find({ _id: { $in: cart.items.map(i => i.menuItemId) } });
    cart.totalPrice = cart.items.reduce((acc, item) => {
      const menuItem = dbItems.find(i => i._id && item.menuItemId && i._id.toString() === item.menuItemId.toString());
      return acc + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

