import React, {useEffect, useState} from 'react';
import {Package, Users, ShoppingCart, Plus, Pencil, Trash2, DollarSign} from 'lucide-react';
import {useAuth} from "../../context/AuthContext.tsx";
import {Product} from "../../types/Product.ts";
import axios, {AxiosError} from 'axios';
import {ErrorResponse} from "../../types/ErrorResponse.ts";
import {Order} from "../../types/Order.ts";
export default function AdminDashboard() {
    const {isAuthenticated, role} = useAuth();
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
    const [editingProduct, setEditingProduct] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [orderDetailProducts, setOrderDetailProducts] = useState<{ [key: string]: Product }>({});
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
    const [updatedStatus, setUpdatedStatus] = useState(selectedOrder?.orderStatus || '');
    const [userCount, setUserCount] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: ''
    });

    useEffect(() => {
        fetchActiveUserCount();
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchActiveUserCount = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/count/`);
            setUserCount(response.data.count);
        } catch (error) {
            console.error('Error fetching user count:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/order/all/`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/all`);
            setProducts(response.data);
        } catch (error: unknown) {
            console.log('Error while loading products: ' , error);
            alert('Something went wrong while loading products!');
        }
    };

    const handleOrderClick = async (order: Order) => {
        setSelectedOrder(order);
        await fetchOrderDetailProducts(order.cart.map(item => item.productId));
        setIsOrderDetailModalOpen(true);
        setUpdatedStatus(selectedOrder?.orderStatus || '');
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUpdatedStatus(e.target.value);
    };

    const updateOrderStatus = async (orderId: string) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/order/update-status/${orderId}`, {
                status: updatedStatus
            });
            alert(response.data.message);

            fetchOrders();
            closeOrderDetailModal();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update status');
        }
    };

    const closeOrderDetailModal = () => {
        setIsOrderDetailModalOpen(false);
        setSelectedOrder(null);
    };

    const fetchOrderDetailProducts = async (productIds: string[]) => {
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
            setOrderDetailProducts(productMap);
        } catch (error) {
            console.error('Error fetching product names:', error);
        }
    };

    const handleEditProduct = (productId: string) => {
        const product = products.find(p => p._id === productId);
        if (product) {
            setEditingProduct(productId);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
                stock: product.stock.toString(),
                image: product.image
            });
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingProduct === 'new') {
            await addProduct();
        } else {
            await updateProduct();
        }
    };

    const addProduct = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('image', formData.image);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/product/add`,
                formDataToSend
            );

            alert(response.data.message);

            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                image: ''
            });
            fetchProducts();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response) {
                alert(axiosError.response.data.message);
            } else {
                alert('Something went wrong!');
            }
        }
    }

    const updateProduct = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('category', formData.category);

        if (formData.image instanceof File) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/product/update/${editingProduct}`,
                formDataToSend
            );

            alert(response.data.message);

            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                image: ''
            });
            fetchProducts();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response) {
                alert(axiosError.response.data.message);
            } else {
                alert('Something went wrong!');
            }
        }
    }

    const deleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/product/delete/${productId}`
                );

                alert(response.data.message);
                fetchProducts();
            } catch (error: unknown) {
                const axiosError = error as AxiosError<ErrorResponse>;
                if (axiosError.response) {
                    alert(axiosError.response.data.message);
                } else {
                    alert('Something went wrong!');
                }
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onAddNewClick = () => {
        setEditingProduct('new');
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            image: ''
        });
    }

    if (!isAuthenticated || role !== 'admin') {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
                    <p className="mt-2 text-gray-600">You need admin privileges to view this page.</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            name: 'Total Orders',
            value: orders.length,
            icon: ShoppingCart,
        },
        {
            name: 'Pending Orders',
            value: orders.filter(order => order.orderStatus === 'Pending').length,
            icon: DollarSign,
        },
        {
            name: 'Total Products',
            value: products.length,
            icon: Package,
        },
        {
            name: 'Active Users',
            value: userCount,
            icon: Users,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="bg-white overflow-hidden shadow rounded-lg"
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <item.icon className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {item.name}
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">
                                                {item.value}
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <div className="sm:hidden">
                    <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value as 'orders' | 'products')}
                    >
                        <option value="orders">Orders</option>
                        <option value="products">Products</option>
                    </select>
                </div>
                <div className="hidden sm:block">
                    <nav className="flex space-x-4" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-3 py-2 font-medium text-sm rounded-md ${
                                activeTab === 'orders'
                                    ? 'bg-indigo-100 text-[var(--primary-color)]'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-3 py-2 font-medium text-sm rounded-md ${
                                activeTab === 'products'
                                    ? 'bg-indigo-100 text-[var(--primary-color)]'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Products
                        </button>
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === 'orders' ? (
                        orders.length === 0 ?
                            <div className="text-center py-12">
                                <Package className="mx-auto h-12 w-12 text-gray-400"/>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                                <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
                            </div>
                            :
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
                                                            User ID: {order.userId}
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
                                                    <div
                                                        className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span className="font-medium text-gray-900">
                            {order.total.toFixed(2)} LKR
                          </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => onAddNewClick()}
                                    className="flex items-center px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--secondary-color)]"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add New Product
                                </button>
                            </div>

                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {products.map((product: Product) => (
                                        <li key={product._id}>
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <img
                                                            className="h-12 w-12 rounded-md object-cover"
                                                            src={`${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${product.image}`}
                                                            alt={product.name}
                                                        />
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-[var(--primary-color)] truncate">
                                                                {product.name}
                                                            </p>
                                                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                                                                <button
                                                                    onClick={() => handleEditProduct(product._id)}
                                                                    className="p-1 text-gray-500 hover:text-indigo-600"
                                                                >
                                                                    <Pencil className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteProduct(product._id)}
                                                                    className="p-1 text-gray-500 hover:text-red-600"
                                                                >
                                                                    <Trash2 className="h-5 w-5 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 flex justify-between">
                                                            <p className="flex items-center text-sm text-gray-500">
                                                                {product.stock} in stock
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {product.price.toFixed(2)} LKR
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Modal */}
            {(editingProduct === 'new' || editingProduct) && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/50">
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {editingProduct === 'new' ? 'Add New Product' : 'Edit Product'}
                    </h3>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    id="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                name="category"
                                id="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="CPU">CPU</option>
                                <option value="GPU">GPU</option>
                                <option value="RAM">RAM</option>
                                <option value="Motherboard">Motherboard</option>
                                <option value="Storage">Storage</option>
                                <option value="PSU">PSU</option>
                                <option value="Case">Case</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={(e) => setFormData({...formData, image: e.target.files?.[0]})}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--secondary-color)]"
                            >
                                {editingProduct === 'new' ? 'Add Product' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {isOrderDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h2 className="text-xl font-semibold mb-4">{selectedOrder.orderId} Details</h2>
                        <div>
                            <label>Status:</label>
                            <select id="selected-order-status" value={updatedStatus}
                                    onChange={handleStatusChange}>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Declined">Declined</option>
                            </select>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {selectedOrder.cart.map((item, index) => (
                                <div className="flex py-3 gap-x-4">
                                    <img
                                        className="h-14 w-14 rounded-md object-cover"
                                        src={`${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${orderDetailProducts[item.productId].image}`}
                                        alt={orderDetailProducts[item.productId].name}
                                    />
                                    <li key={index} className="">
                                        {/* Check if product exists before accessing its name */}
                                        {orderDetailProducts[item.productId] ? (
                                            <>
                                                <p className="text-sm font-medium text-gray-900">{orderDetailProducts[item.productId].name}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-gray-500">Price: {item.price.toFixed(2)} LKR</p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-gray-500">Loading product details...</p>
                                        )}
                                    </li>
                                </div>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                                onClick={closeOrderDetailModal}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                                onClick={() => updateOrderStatus(selectedOrder.orderId)}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}