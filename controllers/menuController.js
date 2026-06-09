const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const {
  getFallbackItems,
  createMenuItem,
  updateFallbackMenuItem,
  deleteFallbackMenuItem
} = require('../utils/fallbackHelper');

exports.getMenuItems = async (req, res, next) => {
  let dbItems = [];
  try {
    if (mongoose.connection.readyState === 1) {
      dbItems = await MenuItem.find(req.query);
    } else {
      console.warn('[Menu Controller] DB is not connected. Skipping DB query.');
    }
  } catch (err) {
    console.error('[Menu Controller] Error fetching menu items from DB:', err.message);
  }

  // Get fallback items from local JSON
  let fallbackItems = [];
  try {
    fallbackItems = await getFallbackItems();
  } catch (err) {
    console.error('[Menu Controller] Error fetching fallback menu items:', err.message);
  }

  // Filter fallback items matching req.query filters
  const filteredFallback = fallbackItems.filter(item => {
    for (const [key, val] of Object.entries(req.query)) {
      // Cast boolean string parameters if necessary
      let queryVal = val;
      if (queryVal === 'true') queryVal = true;
      if (queryVal === 'false') queryVal = false;

      // Handle simple field checks for category, available, mealType, etc.
      if (item[key] !== undefined && item[key] !== queryVal) {
        return false;
      }
    }
    return true;
  });

  const combinedItems = [...dbItems, ...filteredFallback];

  res.status(200).json({
    success: true,
    count: combinedItems.length,
    data: combinedItems
  });
};

exports.addMenuItem = async (req, res, next) => {
  try {
    const result = await createMenuItem(req.body);
    res.status(201).json({
      success: true,
      data: result.data,
      fallback: !!result.fromFallback
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id && id.startsWith('fallback_')) {
      const updatedItem = await updateFallbackMenuItem(id, req.body);
      return res.status(200).json({ success: true, data: updatedItem, fallback: true });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: menuItem });
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id && id.startsWith('fallback_')) {
      await deleteFallbackMenuItem(id);
      return res.status(200).json({ success: true, data: {} });
    }

    await MenuItem.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

