const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

exports.getDashboardStats = async (req, res, next) => {
  try {
    // 1. Today's Revenue
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const todayRevenue = todayRevenueResult[0] ? todayRevenueResult[0].total : 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Active Users
    const activeUsers = await User.countDocuments();

    // 4. Pending Orders
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });

    // 5. Orders in Queue
    const ordersInQueue = await Order.countDocuments({ status: { $in: ['Preparing', 'Ready'] } });

    // 6. Total Items Sold
    const totalItemsSoldResult = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.quantity' } } }
    ]);
    const totalItemsSold = totalItemsSoldResult[0] ? totalItemsSoldResult[0].total : 0;

    // Most sold items (retaining if needed elsewhere)
    const mostSoldItems = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.menuItemId', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const populatedItems = await MenuItem.populate(mostSoldItems, { path: '_id', select: 'name' });

    res.status(200).json({
      success: true,
      data: {
        todayRevenue,
        totalOrders,
        activeUsers,
        pendingOrders,
        ordersInQueue,
        totalItemsSold,
        mostSoldItems: populatedItems
      }
    });
  } catch (err) {
    next(err);
  }
};

const Staff = require('../models/Staff');

// Get all staff
exports.getStaff = async (req, res, next) => {
  try {
    const staff = await Staff.find({});
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (err) {
    next(err);
  }
};

// Add a staff member
exports.addStaff = async (req, res, next) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
};

// Update a staff member
exports.updateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
};

// Delete a staff member
exports.deleteStaff = async (req, res, next) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
