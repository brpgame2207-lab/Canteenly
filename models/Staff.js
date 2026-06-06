const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['Cook', 'Helper', 'Cashier', 'Server', 'Cleaner'], required: true },
  phone: { type: String },
  email: { type: String },
  shift: { type: String, enum: ['Morning (6AM - 2PM)', 'Afternoon (2PM - 10PM)', 'Night (10PM - 6AM)'], default: 'Morning (6AM - 2PM)' },
  joiningDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  attendanceStatus: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Absent' },
  ordersHandled: { type: Number, default: 0 },
  lastActive: { type: String, default: 'Never' }
});

module.exports = mongoose.model('Staff', StaffSchema);
