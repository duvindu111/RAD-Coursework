export interface Order {
    id: string;
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
}