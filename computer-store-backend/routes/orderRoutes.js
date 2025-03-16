const express = require('express');
const { placeOrder, getUserOrders, getAllOrders, updateStatus} = require('../controllers/orderController')
const {checkAuth, protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/place', checkAuth, placeOrder);
router.get('/user', protect, getUserOrders);
router.get('/all', protect, getAllOrders);
router.put('/update-status/:orderId', updateStatus);

module.exports = router;