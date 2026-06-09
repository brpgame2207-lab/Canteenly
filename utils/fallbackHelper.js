const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const FALLBACK_FILE_PATH = path.join(__dirname, '../data/fallback_menu.json');

// Helper to ensure directory exists
async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Get fallback items from local JSON
async function getFallbackItems() {
  try {
    await ensureDirectoryExists(FALLBACK_FILE_PATH);
    const data = await fs.readFile(FALLBACK_FILE_PATH, 'utf8');
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading fallback JSON file:', err.message);
    return [];
  }
}

// Save all fallback items back to the JSON file
async function saveAllFallbackItems(items) {
  try {
    await ensureDirectoryExists(FALLBACK_FILE_PATH);
    await fs.writeFile(FALLBACK_FILE_PATH, JSON.stringify(items, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to fallback JSON file:', err.message);
  }
}

// Save a single item to the fallback JSON
async function saveToFallback(itemData) {
  const items = await getFallbackItems();
  const fallbackId = `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  
  const fallbackItem = {
    _id: fallbackId,
    id: fallbackId,
    name: itemData.name,
    description: itemData.description || 'A delicious dish freshly prepared.',
    price: Number(itemData.price),
    category: itemData.category,
    mealType: itemData.mealType || itemData.category || 'Snacks',
    cuisineStyle: itemData.cuisineStyle || 'South Indian',
    dietType: itemData.dietType || 'Veg',
    beverageType: itemData.beverageType || 'None',
    isComboOffer: itemData.isComboOffer || false,
    image: itemData.image || 'default.jpg',
    available: itemData.available !== false,
    isFallback: true,
    createdAt: new Date().toISOString()
  };

  items.push(fallbackItem);
  await saveAllFallbackItems(items);
  console.log(`[Fallback Layer] Saved item "${itemData.name}" to JSON fallback file.`);
  return fallbackItem;
}

// Main create menu item wrapper that fails over to JSON if DB crashes
async function createMenuItem(itemData) {
  // Check if DB is connected
  if (mongoose.connection.readyState === 1) {
    try {
      const menuItem = await MenuItem.create(itemData);
      return { success: true, fromDb: true, data: menuItem };
    } catch (error) {
      // Propagate validation, duplicate key, or cast errors (client-side errors)
      if (error.name === 'ValidationError' || error.name === 'CastError' || error.code === 11000) {
        throw error;
      }
      console.error('[Fallback Layer] Error inserting into DB. Failing over to JSON:', error.message);
    }
  } else {
    console.warn('[Fallback Layer] DB is offline. Saving directly to JSON fallback.');
  }

  // Failover
  const fallbackItem = await saveToFallback(itemData);
  return { success: true, fromFallback: true, data: fallbackItem };
}

// Update a fallback menu item in JSON
async function updateFallbackMenuItem(id, updatedData) {
  const items = await getFallbackItems();
  const index = items.findIndex(item => item.id === id || item._id === id);
  if (index === -1) {
    throw new Error('Fallback menu item not found');
  }

  // Merge changes, preserving fallback flags and ID
  const original = items[index];
  items[index] = {
    ...original,
    ...updatedData,
    _id: id,
    id: id,
    price: updatedData.price !== undefined ? Number(updatedData.price) : original.price,
    isFallback: true
  };

  await saveAllFallbackItems(items);
  console.log(`[Fallback Layer] Updated fallback item "${items[index].name}".`);
  return items[index];
}

// Delete a fallback menu item from JSON
async function deleteFallbackMenuItem(id) {
  const items = await getFallbackItems();
  const filtered = items.filter(item => item.id !== id && item._id !== id);
  await saveAllFallbackItems(filtered);
  console.log(`[Fallback Layer] Deleted fallback item with ID: ${id}`);
}

// Sync fallback items to MongoDB database
async function syncFallbackToDatabase() {
  // Check if DB is available
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const items = await getFallbackItems();
  if (items.length === 0) {
    return;
  }

  console.log(`[Fallback Sync] Restored connection detected. Syncing ${items.length} items to database...`);
  const remaining = [];

  for (const item of items) {
    try {
      const dbData = { ...item };
      // Strip client-side fallback metadata before inserting into MongoDB
      delete dbData._id;
      delete dbData.id;
      delete dbData.isFallback;
      delete dbData.createdAt;

      await MenuItem.create(dbData);
      console.log(`[Fallback Sync] Successfully transferred "${item.name}" to the database.`);
    } catch (err) {
      console.error(`[Fallback Sync] Failed to sync item "${item.name}":`, err.message);
      // If validation error or duplicate key, remove from sync queue (will never succeed)
      // Otherwise, keep it in fallback queue to retry next time (e.g. database goes offline again)
      if (err.name !== 'ValidationError' && err.name !== 'CastError' && err.code !== 11000) {
        remaining.push(item);
      }
    }
  }

  await saveAllFallbackItems(remaining);
  console.log(`[Fallback Sync] Sync finished. Remaining items in fallback: ${remaining.length}`);
}

// Setup event listeners for auto-sync on DB reconnection
mongoose.connection.on('connected', () => {
  console.log('[Fallback Helper] MongoDB connection established. Triggering sync...');
  syncFallbackToDatabase().catch(err => console.error('[Fallback Sync Error]', err.message));
});

mongoose.connection.on('reconnected', () => {
  console.log('[Fallback Helper] MongoDB connection reconnected. Triggering sync...');
  syncFallbackToDatabase().catch(err => console.error('[Fallback Sync Error]', err.message));
});

// Periodic sync checker (every 30 seconds)
setInterval(() => {
  syncFallbackToDatabase().catch(err => console.error('[Fallback Periodic Sync Error]', err.message));
}, 30000);

// Initial delayed sync in case DB connects immediately after server starts
setTimeout(() => {
  syncFallbackToDatabase().catch(err => console.error('[Fallback Initial Sync Error]', err.message));
}, 5000);

module.exports = {
  getFallbackItems,
  createMenuItem,
  updateFallbackMenuItem,
  deleteFallbackMenuItem,
  syncFallbackToDatabase
};
