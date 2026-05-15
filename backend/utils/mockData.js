let users = [];
let menuItems = [
    { _id: '1', name: 'Samosa', description: 'Crispy snack', category: 'Snacks', price: 15, available: true },
    { _id: '2', name: 'Coffee', description: 'Hot beverage', category: 'Beverages', price: 10, available: true }
];
let carts = {}; // userId -> cart object
let orders = [];
let inventory = [
    { _id: '1', itemName: 'Samosa', quantity: 100, unit: 'pcs', threshold: 10 }
];

module.exports = { users, menuItems, carts, orders, inventory };
