export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: 'CPU' | 'GPU' | 'RAM' | 'Motherboard' | 'Storage' | 'PSU' | 'Case';
    image: string;
    stock: number;
}