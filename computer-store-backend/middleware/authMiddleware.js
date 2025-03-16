const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const extractToken = token.split(' ')[1];
        const decoded = jwt.verify(extractToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Invalid token' });
    }
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access only' });
    }
    next();
};

const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            console.error('Invalid token:', error);
        }
    }
    next();
};



module.exports = { protect, isAdmin, checkAuth };