const express = require('express');
const { 
  getDashboardStats, 
  getStaff, 
  addStaff, 
  updateStaff, 
  deleteStaff 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);

router.get('/staff', getStaff);
router.post('/staff', addStaff);
router.put('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);

module.exports = router;
