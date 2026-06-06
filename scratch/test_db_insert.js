const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MenuItem = require('../models/MenuItem');

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Creating menu item directly via mongoose...');
    const item = await MenuItem.create({
      name: 'testDirectInsert',
      description: 'test description',
      category: 'Breakfast',
      price: 30
    });
    console.log('Created item price:', item.price);

    // Clean up
    await MenuItem.findByIdAndDelete(item._id);
    console.log('Cleaned up!');

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

run();
