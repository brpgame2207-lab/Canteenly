const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json({ success: true, count: inventory.length, data: inventory });
  } catch (err) {
    next(err);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: inventory });
  } catch (err) {
    next(err);
  }
};

exports.addInventoryItem = async (req, res, next) => {
  try {
    const inventory = await Inventory.create(req.body);
    res.status(201).json({ success: true, data: inventory });
  } catch (err) {
    next(err);
  }
};
