const express = require('express');
const { getUserCount } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/count', getUserCount);

module.exports = router;