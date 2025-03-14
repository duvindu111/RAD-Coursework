const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    res.json(cart || { cart: [] });
};

exports.postCart = async (req, res) => {
    const userId = req.user.id;
    const { cart } = req.body;

    const existingCart = await Cart.findOne({ userId });
    if (existingCart) {
        existingCart.cart = cart;
        await existingCart.save();
    } else {
        await Cart.create({ userId, cart });
    }

    res.json({ message: 'Cart updated successfully' });
};

