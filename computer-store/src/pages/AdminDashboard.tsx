import React, { useState } from 'react';
import {Package, Users, ShoppingCart, Plus, Pencil, Trash2, DollarSign} from 'lucide-react';
import { products, orders } from '../data';
import {useAuth} from "../../context/AuthContext.tsx";

export default function AdminDashboard() {
    const {isAuthenticated, role} = useAuth();
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
    const [editingProduct, setEditingProduct] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: ''
    });

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
            change: '+4.75%',
            changeType: 'positive'
        },
        {
            name: 'Total Products',
            value: products.length,
            icon: Package,
            change: '+54.02%',
            changeType: 'positive'
        },
        {
            name: 'Total Revenue',
            value: `$${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`,
            icon: DollarSign,
            change: '+12.05%',
            changeType: 'positive'
        },
        {
            name: 'Active Users',
            value: '23',
            icon: Users,
            change: '+2.59%',
            changeType: 'positive'
        },
    ];

    const handleEditProduct = (productId: string) => {
        const product = products.find(p => p.id === productId);
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
            // await updateProduct();
        }
    };

    const addProduct = async () => {;
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('image', formData.image);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product/add`, {
            method: 'POST',
            body: formDataToSend,
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                image: ''
            });
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/*<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">*/}
            {/*    {stats.map((item) => (*/}
            {/*        <div*/}
            {/*            key={item.name}*/}
            {/*            className="bg-white overflow-hidden shadow rounded-lg"*/}
            {/*        >*/}
            {/*            <div className="p-5">*/}
            {/*                <div className="flex items-center">*/}
            {/*                    <div className="flex-shrink-0">*/}
            {/*                        <item.icon className="h-6 w-6 text-gray-400" />*/}
            {/*                    </div>*/}
            {/*                    <div className="ml-5 w-0 flex-1">*/}
            {/*                        <dl>*/}
            {/*                            <dt className="text-sm font-medium text-gray-500 truncate">*/}
            {/*                                {item.name}*/}
            {/*                            </dt>*/}
            {/*                            <dd className="flex items-baseline">*/}
            {/*                                <div className="text-2xl font-semibold text-gray-900">*/}
            {/*                                    {item.value}*/}
            {/*                                </div>*/}
            {/*                                <div className={`ml-2 flex items-baseline text-sm font-semibold*/}
            {/*            ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>*/}
            {/*                                    {item.change}*/}
            {/*                                </div>*/}
            {/*                            </dd>*/}
            {/*                        </dl>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

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
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-3 py-2 font-medium text-sm rounded-md ${
                                activeTab === 'products'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Products
                        </button>
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === 'orders' ? (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <li key={order.id}>
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        Order #{order.id}
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        User ID: {order.userId}
                                                    </p>
                                                </div>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500">
                                                        {order.items.length} items
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
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setEditingProduct('new')}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add New Product
                                </button>
                            </div>

                            {(editingProduct === 'new' || editingProduct) && (
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
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                            >
                                                {editingProduct === 'new' ? 'Add Product' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <li key={product.id}>
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <img
                                                            className="h-12 w-12 rounded-md object-cover"
                                                            src={product.image}
                                                            alt={product.name}
                                                        />
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-indigo-600 truncate">
                                                                {product.name}
                                                            </p>
                                                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                                                                {/*<button*/}
                                                                {/*    onClick={() => handleEditProduct(product.id)}*/}
                                                                {/*    className="p-1 text-gray-500 hover:text-indigo-600"*/}
                                                                {/*>*/}
                                                                {/*    <Pencil className="h-5 w-5" />*/}
                                                                {/*</button>*/}
                                                                {/*<button*/}
                                                                {/*    onClick={() => console.log('Delete product:', product.id)}*/}
                                                                {/*    className="p-1 text-gray-500 hover:text-red-600"*/}
                                                                {/*>*/}
                                                                {/*    <Trash2 className="h-5 w-5" />*/}
                                                                {/*</button>*/}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 flex justify-between">
                                                            <p className="flex items-center text-sm text-gray-500">
                                                                {product.stock} in stock
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                ${product.price.toFixed(2)}
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
        </div>
    );
}