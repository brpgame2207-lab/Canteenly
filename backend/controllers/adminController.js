const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult[0] ? totalRevenueResult[0].total : 0;

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
        totalOrders,
        totalRevenue,
        mostSoldItems: populatedItems
      }
    });
  } catch (err) {
    next(err);
  }
};
