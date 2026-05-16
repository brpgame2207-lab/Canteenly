const express = require('express');
const { getInventory, updateStock, addInventoryItem } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getInventory);
router.post('/', addInventoryItem);
router.put('/:id', updateStock);

module.exports = router;
