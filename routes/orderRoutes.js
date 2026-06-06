const express = require('express');
const { placeOrder, getMyOrders, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.post('/', placeOrder);
router.get('/myorders', getMyOrders);
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
