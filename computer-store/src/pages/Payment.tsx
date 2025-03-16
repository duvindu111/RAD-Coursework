import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { CreditCard, Lock, CircleCheck } from 'lucide-react';
import axios from "axios";
import {CartItem} from "../../types/CartItem.ts";

export default function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [cartWithPrices, setCartWithPrices] = useState<CartItem[]>([]);
    const { clearCart } = useCart();

    const { cart, total, formData } = state || {};

    useEffect(() => {
        fetchCartProducts();
    }, [cart]);

    const fetchCartProducts = async () => {
        const productIds = cart.map((item: CartItem) => item.productId);
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/get-by-ids`, {productIds});

        const cartWithPricesTemp = cart.map((item: CartItem) => {
            const priceInfo = response.data.find((p: any) => p._id === item.productId);
            return {
                ...item,
                price: priceInfo ? priceInfo.price : 0,
            };
        });
        setCartWithPrices(cartWithPricesTemp);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/order/place`, {
                cart: cartWithPrices,
                total,
                shippingDetails: formData
            });

            if (res.data.success) {
                clearCart();
                navigate('/orders');
            } else {
                alert('Payment Failed');
            }
        } catch (error) {
            console.error('Payment Failed', error);
            alert('Payment Failed. Please try again.');
        }
    };

    return (
        <div className="mt-14 max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center mb-6">
                    <CircleCheck className="h-8 w-8 text-green-500" />
                    <h2 className="text-2xl font-bold text-gray-900 ml-2">Secure Payment</h2>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between text-lg font-semibold mb-2">
                        <span>Total Amount:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        Your payment is encrypted and secure.
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                            Card Number
                        </label>
                        <div className="mt-1 relative">
                            <input
                                type="text"
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <CreditCard className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                                Expiry Date
                            </label>
                            <input
                                type="text"
                                id="expiry"
                                placeholder="MM/YY"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                                CVC
                            </label>
                            <input
                                type="text"
                                id="cvc"
                                placeholder="123"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                            <span>
                                Pay ${total.toFixed(2)}
                            </span>

                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Lock className="h-4 w-4" />
                    <span>Payments are secure and encrypted</span>
                </div>
            </div>
        </div>
    );
}