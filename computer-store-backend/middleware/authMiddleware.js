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

module.exports = protect;