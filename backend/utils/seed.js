const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('../models/MenuItem');
const Inventory = require('../models/Inventory');

dotenv.config({ path: './.env' });

const menuItems = [
  { name: 'Samosa', description: 'Crispy fried snack with potato filling', category: 'Snacks', price: 15 },
  { name: 'Masala Dosa', description: 'Rice crepe with potato masala', category: 'Breakfast', price: 40 },
  { name: 'Veg Thali', description: 'Complete lunch with rice, dal, and sabzi', category: 'Lunch', price: 60 },
  { name: 'Coffee', description: 'Hot brewed coffee', category: 'Beverages', price: 10 }
];

const inventoryItems = [
  { itemName: 'Samosa', quantity: 100, unit: 'pcs', threshold: 10 },
  { itemName: 'Masala Dosa', quantity: 50, unit: 'pcs', threshold: 5 },
  { itemName: 'Rice', quantity: 20, unit: 'kg', threshold: 5 }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await MenuItem.deleteMany();
    await Inventory.deleteMany();

    await MenuItem.insertMany(menuItems);
    await Inventory.insertMany(inventoryItems);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
