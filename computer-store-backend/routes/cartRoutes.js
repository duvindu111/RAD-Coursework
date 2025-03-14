const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getCart, postCart } = require('../controllers/cartController')

const router = express.Router();

router.get('/get', protect, getCart);
router.post('/post', protect, postCart);

module.exports = router;