import { useAuth } from '../../context/AuthContext';
import { Package } from 'lucide-react';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Order} from "../../types/Order.ts";
import {Product} from "../../types/Product.ts";

export default function OrderHistory() {
    const { role } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState<{ [key: string]: Product }>({});

    useEffect(() => {
        if (role) {
            fetchOrders();
        }
    }, [role]);

    const fetchProducts = async (productIds: string[]) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/product/get-by-ids`,
                { productIds }
            );
            const fetchedProducts = response.data;
            const productMap: { [key: string]: Product } = {};
            fetchedProducts.forEach((product: Product) => {
                productMap[product._id] = product;
            });
            setProducts(productMap);
        } catch (error) {
            console.error('Error fetching product names:', error);
        }
    };

    const handleOrderClick = async (order: Order) => {
        setSelectedOrder(order);
        await fetchProducts(order.cart.map(item => item.productId));
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/order/user/`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    if (role === null) {
        return (
            <div className="mt-14 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Please login to view your orders</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <li key={order.orderId}>
                                <div className="px-4 py-4 sm:px-6 cursor-pointer hover:bg-gray-100"
                                     onClick={() => handleOrderClick(order)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-[var(--primary-color)] truncate">
                                                {order.orderId}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                                                order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {order.cart.length} items
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span className="font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h2 className="text-xl font-semibold mb-4">{selectedOrder.orderId} Details</h2>
                        <ul className="divide-y divide-gray-200">
                            {selectedOrder.cart.map((item, index) => (
                                <div className="flex py-3 gap-x-4">
                                    <img
                                        className="h-14 w-14 rounded-md object-cover"
                                        src={`${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${products[item.productId].image}`}
                                        alt={products[item.productId].name}
                                    />
                                    <li key={index} className="">
                                        <p className="text-sm font-medium text-gray-900">{products[item.productId].name}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                                    </li>
                                </div>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                                onClick={closeModal}
                            >
                            Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}