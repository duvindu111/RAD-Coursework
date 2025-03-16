export interface Order {
    _id: string;
    userId: string;
    cart: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    shippingDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
        country: string;
        zipCode: string;
    },
    orderStatus: string;
    createdAt: string;
    orderId: string
}