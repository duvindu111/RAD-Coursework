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

exports.getItemPrices = async (req, res) => {
    const { productIds } = req.body; // Array of productIds

    try {
        const products = await Product.find({ '_id': { $in: productIds } }).select('price _id');

        const productPrices = products.map((product) => ({
            productId: product._id.toString(),
            price: product.price,
        }));

        res.json(productPrices);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch prices', error });
    }
};

