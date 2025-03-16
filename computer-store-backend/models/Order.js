const mongoose = require('mongoose');
const moment = require('moment');
const Counter = require('./Counter');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    cart: [
        {
            productId: String,
            quantity: Number,
            price: Number
        }
    ],
    total: Number,
    shippingDetails: {
        name: String,
        email: String,
        address: String,
        city: String,
        country: String,
        zipCode: String
    },
    orderStatus: {
        type: String,
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    orderId: {
        type: String,
        unique: true
    }
});

orderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const today = moment().format('YYMMDD');

        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: 'orderId' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true }
            );

            // Generate the orderId using the current counter value
            this.orderId = `ORD-${today}-${counter.sequence_value.toString().padStart(3, '0')}`;
        } catch (error) {
            console.error('Error generating orderId:', error);
        }
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
