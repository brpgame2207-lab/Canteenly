const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MenuItem = require('./models/MenuItem');

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const items = await MenuItem.find({});
    console.log('Menu items in database:');
    items.forEach(item => {
      console.log(`- ${item.name}: Price=${item.price}, Category=${item.category}`);
    });

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

run();
