const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Find or create admin user
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('Creating temp admin user...');
      admin = await User.create({
        name: 'Temp Admin',
        email: 'tempadmin@test.com',
        password: 'password123',
        phone: '1234567890',
        role: 'admin'
      });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log('Admin token generated. Making POST request to local API...');
    const url = 'http://localhost:5000/api/menu';
    const payload = {
      name: 'apiTestItem',
      description: 'API test description',
      category: 'Breakfast',
      price: 30
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const resData = await response.json();
    console.log('API Response status:', response.status);
    console.log('API Response data:', JSON.stringify(resData, null, 2));

    if (resData.success && resData.data && resData.data._id) {
      const MenuItem = require('../models/MenuItem');
      await MenuItem.findByIdAndDelete(resData.data._id);
      console.log('Cleaned up created menu item.');
    }

    // if we created temp admin, clean it up
    if (admin.email === 'tempadmin@test.com') {
      await User.findByIdAndDelete(admin._id);
      console.log('Cleaned up temp admin user.');
    }

    mongoose.disconnect();
  } catch (err) {
    console.error('Error in script:', err);
  }
}

run();
