const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MenuItem = require('../models/MenuItem');
const {
  getFallbackItems,
  createMenuItem,
  updateFallbackMenuItem,
  deleteFallbackMenuItem,
  syncFallbackToDatabase
} = require('../utils/fallbackHelper');

const sampleMenuItem = {
  name: 'Fallback Burger',
  description: 'Juicy chicken patty with extra cheese.',
  price: 180,
  category: 'Fast Food',
  mealType: 'Snacks',
  cuisineStyle: 'Fast Food',
  dietType: 'Non-Veg',
  beverageType: 'None',
  isComboOffer: false,
  image: 'burger.jpg',
  available: true
};

async function runTests() {
  console.log('--- Starting Fallback Layer Tests ---');

  try {
    // 1. Initial Connection
    console.log('\n[Test 1] Connecting to MongoDB...');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in .env!');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');

    // Clean up any old test items first
    await MenuItem.deleteMany({ name: { $in: ['Fallback Burger', 'Updated Burger', 'Normal Burger'] } });
    console.log('Cleaned old test items from DB.');

    // 2. Normal insert (DB is online)
    console.log('\n[Test 2] Creating menu item while DB is ONLINE...');
    const resultOnline = await createMenuItem({
      ...sampleMenuItem,
      name: 'Normal Burger'
    });
    console.log('Result online insert:', resultOnline);
    if (!resultOnline.fromDb) {
      throw new Error('Expected item to be saved in DB, but it was not.');
    }
    const dbItem = await MenuItem.findOne({ name: 'Normal Burger' });
    console.log('Verified Normal Burger in DB:', dbItem !== null);

    // 3. Simulate DB Crash (Disconnect Mongoose)
    console.log('\n[Test 3] Simulating DB crash (disconnecting mongoose)...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');

    // 4. Create menu item while DB is offline (should fallback to JSON)
    console.log('\n[Test 4] Creating menu item while DB is OFFLINE...');
    const resultOffline = await createMenuItem(sampleMenuItem);
    console.log('Result offline insert:', resultOffline);
    if (!resultOffline.fromFallback) {
      throw new Error('Expected item to be saved in JSON fallback, but it was not.');
    }
    if (!resultOffline.data.id.startsWith('fallback_')) {
      throw new Error(`Expected fallback ID format, got: ${resultOffline.data.id}`);
    }

    // Verify JSON file contents
    let fallbackItems = await getFallbackItems();
    console.log(`Current items in fallback JSON: ${fallbackItems.length}`);
    const foundFallback = fallbackItems.find(item => item.name === 'Fallback Burger');
    if (!foundFallback) {
      throw new Error('Could not find fallback burger in fallback JSON!');
    }
    console.log('Found fallback burger in JSON:', foundFallback);

    // 5. Verify Update fallback item offline
    console.log('\n[Test 5] Updating fallback item while DB is OFFLINE...');
    const updatedFallback = await updateFallbackMenuItem(resultOffline.data.id, {
      name: 'Updated Burger',
      price: 195
    });
    console.log('Updated fallback item response:', updatedFallback);
    if (updatedFallback.name !== 'Updated Burger' || updatedFallback.price !== 195) {
      throw new Error('Update of fallback item fields failed.');
    }

    fallbackItems = await getFallbackItems();
    console.log('Verified updated fallback item in JSON file:', fallbackItems.find(item => item.id === resultOffline.data.id));

    // 6. Simulate DB Reconnection & Trigger Sync
    console.log('\n[Test 6] Reconnecting to MongoDB & triggering sync...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB reconnected.');

    // Trigger sync manually for test verification
    await syncFallbackToDatabase();

    // Verify fallback file is now empty
    fallbackItems = await getFallbackItems();
    console.log(`Fallback items in JSON after sync: ${fallbackItems.length}`);
    if (fallbackItems.length !== 0) {
      throw new Error('Expected fallback JSON to be empty after sync!');
    }

    // Verify item is now in DB
    const syncedItem = await MenuItem.findOne({ name: 'Updated Burger' });
    console.log('Synced item retrieved from DB:', syncedItem);
    if (!syncedItem) {
      throw new Error('Failed to find synced item in DB!');
    }
    if (syncedItem.price !== 195) {
      throw new Error('Synced item price in DB does not match updated price!');
    }
    console.log('Sync validation successful.');

    // 7. Verify Delete fallback item (Pre-sync)
    console.log('\n[Test 7] Creating another item offline and deleting it...');
    await mongoose.connection.close(); // Go offline again
    console.log('Went offline.');

    const tempItem = await createMenuItem({
      ...sampleMenuItem,
      name: 'Temp Burger'
    });
    console.log('Temp Burger created offline:', tempItem.data.id);

    fallbackItems = await getFallbackItems();
    console.log(`Fallback items in JSON before delete: ${fallbackItems.length}`);

    await deleteFallbackMenuItem(tempItem.data.id);

    fallbackItems = await getFallbackItems();
    console.log(`Fallback items in JSON after delete: ${fallbackItems.length}`);
    if (fallbackItems.length !== 0) {
      throw new Error('Expected fallback JSON to be empty after delete!');
    }

    console.log('\n--- All Tests Passed Successfully! ---');

  } catch (error) {
    console.error('\n!!! TEST FAILED !!!');
    console.error(error);
    process.exit(1);
  } finally {
    // Ensure we close mongoose connection before exit
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('Mongoose connection cleaned up.');
    }
    process.exit(0);
  }
}

runTests();
