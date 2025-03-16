const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getCart, postCart, getItemPrices } = require('../controllers/cartController')

const router = express.Router();

router.get('/get', protect, getCart);
router.post('/post', protect, postCart);
router.post('/prices', getItemPrices);

module.exports = router;