// import { products } from '../data';
// import { useCart } from '../context/CartContext';
// import { ShoppingCart } from 'lucide-react';

export default function Home() {
    return (
        <div className="mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Featured Products</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/*{products.map(product => (*/}
                {/*    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">*/}
                {/*        <img*/}
                {/*            src={product.image}*/}
                {/*            alt={product.name}*/}
                {/*            className="w-full h-48 object-cover"*/}
                {/*        />*/}
                {/*        <div className="p-4">*/}
                {/*            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>*/}
                {/*            <p className="text-sm text-gray-600 mt-1">{product.description}</p>*/}
                {/*            <div className="mt-4 flex items-center justify-between">*/}
                {/*<span className="text-xl font-bold text-gray-900">*/}
                {/*  ${product.price.toFixed(2)}*/}
                {/*</span>*/}
                {/*                <button*/}
                {/*                    onClick={() => addToCart(product, 1)}*/}
                {/*                    className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"*/}
                {/*                >*/}
                {/*                    <ShoppingCart className="h-5 w-5" />*/}
                {/*                    <span>Add to Cart</span>*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*            <p className="text-sm text-gray-500 mt-2">*/}
                {/*                {product.stock} in stock*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*))}*/}
            </div>
        </div>
    );
}