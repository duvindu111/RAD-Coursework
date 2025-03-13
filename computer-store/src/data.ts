import { Product } from '../types/Product.ts';
import { Order } from '../types/Order.ts';

export const products: Product[] = [
    {
        id: '1',
        name: 'AMD Ryzen 9 5950X',
        description: '16-core, 32-thread processor for ultimate performance',
        price: 599.99,
        category: 'CPU',
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=500',
        stock: 10
    },
    {
        id: '2',
        name: 'NVIDIA RTX 4080',
        description: 'High-end graphics card for gaming and content creation',
        price: 1199.99,
        category: 'GPU',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=500',
        stock: 5
    },
    {
        id: '3',
        name: 'Corsair Vengeance 32GB DDR5',
        description: 'High-speed DDR5 memory kit for gaming and productivity',
        price: 189.99,
        category: 'RAM',
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=500',
        stock: 15
    },
    {
        id: '4',
        name: 'ASUS ROG Maximus Z790',
        description: 'Premium motherboard for Intel 13th gen processors',
        price: 599.99,
        category: 'Motherboard',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=500',
        stock: 8
    }
];

export const orders: Order[] = [
    {
        id: '1',
        userId: '1',
        items: [
            { productId: '1', quantity: 1, price: 599.99 },
            { productId: '2', quantity: 1, price: 1199.99 }
        ],
        total: 1799.98,
        status: 'completed',
        date: '2024-03-15'
    }
];