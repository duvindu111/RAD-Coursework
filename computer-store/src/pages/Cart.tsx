import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCart} from "../../context/CartContext.tsx";
import {Trash2} from 'lucide-react';
import axios from 'axios';
import {Product} from "../../types/Product.ts";

export default function Cart() {
    const {cart, removeFromCart, updateCartItemQuantity} = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (cart.length > 0) {
            fetchCartProducts();
        }
    }, [cart]);

    const fetchCartProducts = async () => {
        const productIds = cart.map(item => item.productId);
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/product/get-by-ids`, {productIds});
        setProducts(response.data);
    };

    const getQuantity = (productId: string) => {
        const item = cart.find(item => item.productId === productId);
        return item ? item.quantity : 0;
    };

    function removeCartItem(_id: string) {
        removeFromCart(_id);
        products.splice(products.findIndex(product => product._id === _id), 1);
    }

    return (
        <div className="mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {products.length === 0 ? (
                        <div className="p-6 text-center text-gray-900">
                            Your cart is empty
                        </div>
                    ) :
                    <div>
                <ul className="divide-y divide-gray-200">
                    {products.map(product => (
                        <li key={product._id} className="p-6 flex items-center">
                            <img
                                src={`${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${product.image}`}
                                alt={product.name}
                                className="h-24 w-24 object-cover rounded"
                            />
                            <div className="ml-6 flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {product.name}
                                </h3>
                                <div className="mt-1 flex items-center justify-between">
                                    <div>
                                        <span className="text-gray-600">Quantity: </span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateCartItemQuantity(product._id, getQuantity(product._id) - 1)}
                                                className="bg-gray-200 rounded-full w-6 cursor-pointer">-
                                            </button>
                                            <span className="text-lg font-semibold">{getQuantity(product._id)}</span>
                                            <button
                                                onClick={() => updateCartItemQuantity(product._id, getQuantity(product._id) + 1)}
                                                className="bg-gray-200 rounded-full w-6 cursor-pointer">+
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                      <span className="font-semibold">
                    {(product.price * getQuantity(product._id)).toFixed(2)} LKR
                  </span>
                                <button
                                    onClick={() => removeCartItem(product._id)}
                                    className="ml-6 text-red-600 hover:text-red-800"
                                >
                                    <Trash2 className="h-5 w-5"/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">
              {products.reduce((acc, product) => acc + product.price * getQuantity(product._id), 0).toFixed(2)} LKR
            </span>
                    </div>
                    <button
                        onClick={() => navigate('/checkout')}
                        className="mt-6 w-full bg-[var(--primary-color)] text-white py-3 px-4 rounded-md hover:bg-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Proceed to Checkout
                    </button>
                </div>
                    </div>}
            </div>
        </div>
    );
}