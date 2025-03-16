const express = require('express');
const { addProduct, getAllProducts, getSelectedProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, isAdmin, addProduct);
router.get('/all', getAllProducts);
router.post('/get-by-ids', getSelectedProducts);
router.put('/update/:productId', updateProduct);
router.delete('/delete/:productId', deleteProduct);

module.exports = router;