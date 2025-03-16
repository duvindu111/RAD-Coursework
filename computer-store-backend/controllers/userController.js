const User = require('../models/User');

exports.getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Error in fetching user count:', error.message);
        res.status(500).json({ error: error.message });
    }
}