import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import {useAuth} from "../../context/AuthContext.tsx";
import axios from "axios";
import {getCartFromLocalStorage} from "../../utils/cartUtils.ts";
import {CartItem} from "../../types/CartItem.ts";
import {Product} from "../../types/Product.ts";

export default function Checkout() {
    const navigate = useNavigate();
    const { role } = useAuth();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        zipCode: ''
    });

    useEffect(() => {
        if (role === 'admin' || role === 'user') {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart/get`)
                .then((res) => {
                    setCart(res.data.cart);
                    calculateTotal(res.data.cart);
                });
        } else {
            const localCart = getCartFromLocalStorage();
            setCart(localCart);
            calculateTotal(localCart);
        }
    }, [role]);

    const calculateTotal = async (cart: CartItem[]) => {
        let totalPrice = 0;
        const productIds = cart.map(item => item.productId);
        const productDetails = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/get-by-ids`, { productIds });

        cart.forEach((item) => {
            const product = productDetails.data.find((p: Product) => p._id === item.productId);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        });

        setTotal(totalPrice);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/payment', {
            state: {
                cart: cart,
                total: total,
                formData: formData
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Shipping Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                ZIP Code
                            </label>
                            <input
                                type="text"
                                id="zipCode"
                                name="zipCode"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={formData.zipCode}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span>Total Amount:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center space-x-2 bg-[var(--primary-color)] text-white py-3 px-4 rounded-md hover:bg-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <CreditCard className="h-5 w-5" />
                        <span>Proceed to Payment</span>
                    </button>
                </form>
            </div>
        </div>
    );
}