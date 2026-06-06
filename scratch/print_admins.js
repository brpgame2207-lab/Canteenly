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

    const admins = await User.find({ role: 'admin' }).select('+password');
    console.log('Admin users in database:');
    admins.forEach(admin => {
      console.log(`Name: ${admin.name}, Email: ${admin.email}, Password Hash: ${admin.password}`);
    });

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

run();
