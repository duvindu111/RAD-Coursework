const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        const savedUser = await newUser.save();

        const token =
            // jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        generateToken(savedUser._id, savedUser.role);

        res.status(201).json({
            message: 'User registered successfully',
            token: token,
            user: {
                id: savedUser._id,
                email: savedUser.email,
                role: savedUser.role
            },
        });
    } catch (error) {
        console.error('Error in registration:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token =
            // jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        generateToken(user._id, user.role);

        res.status(200).json({
            token: token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

