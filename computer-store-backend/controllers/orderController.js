const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
    const userId = req.user ? req.user.id : null;

    const { cart, total, shippingDetails } = req.body;

    try {
        const newOrder = await Order.create({
            userId,
            cart,
            total,
            orderStatus: 'Pending',
            shippingDetails
        });

        res.status(201).json({success: true, order: newOrder});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to place order' });
    }
};

exports.getUserOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Order.find({ userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

exports.updateStatus = async (req, res) => {
    const { status } = req.body;
    const { orderId } = req.params;

    try {
        await Order.findOneAndUpdate({ orderId }, { orderStatus: status });
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
};