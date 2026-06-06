const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const admin = await User.findOne({ email: 'admin@canteenly.com' });
    if (admin) {
      admin.password = 'admin123';
      await admin.save();
      console.log('Password successfully reset to admin123 for admin@canteenly.com');
    } else {
      console.log('Admin user not found!');
    }

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

run();
