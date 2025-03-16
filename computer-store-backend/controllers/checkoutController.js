const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY , {
    apiVersion: '2020-08-27',
});

exports.createCheckoutSession = async (req, res) => {
    const { items, totalAmount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item) => ({
                price_data: {
                    currency: 'usd', // Set your currency here (LKR can be used for Sri Lanka)
                    product_data: {
                        name: item.productId,
                    },
                    unit_amount: item.price * 100, // Stripe expects the amount in the smallest currency unit
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};