const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: 'default.jpg' },
  available: { type: Boolean, default: true },
  mealType: { type: String },
  cuisineStyle: { type: String },
  dietType: { type: String, enum: ['Veg', 'Non-Veg', 'Egg'], default: 'Veg' },
  beverageType: { type: String, default: 'None' },
  isComboOffer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
