const express = require('express');
const { addProduct, getAllProducts, getSelectedProducts } = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, isAdmin, addProduct);
router.get('/all', getAllProducts);
router.post('/get-by-ids', getSelectedProducts);

module.exports = router;