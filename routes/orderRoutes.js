const express = require('express');
const { placeOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.post('/', placeOrder);
router.get('/myorders', getMyOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
