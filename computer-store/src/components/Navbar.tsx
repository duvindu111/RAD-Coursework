import {Link, useNavigate} from "react-router-dom";
import {Monitor, ShoppingCart} from 'lucide-react';
import {useAuth} from "../../context/AuthContext.tsx";
import {useCart} from "../../context/CartContext.tsx";

export function Navbar() {
    const {isAuthenticated, role, logout} = useAuth();
    const navigate = useNavigate();
    const {cart} = useCart();

    const handleLogout = () => {
        localStorage.removeItem('token');
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-[var(--primary-color)] text-white fixed top-0 left-0 w-[100vw]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Monitor className="h-8 w-8 text-white"/>
                        <span className="font-bold text-xl text-white">TechHub</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative">
                            <ShoppingCart className="h-6 w-6 text-white"/>
                            {cart.length > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              {cart.length}
                            </span>
                            )}
                        </Link>

                        {!isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="hover:text-gray-200">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-100"
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                {role === 'admin' &&
                                    <Link to="/admin" className="hover:text-gray-200">
                                        Dashboard
                                    </Link>
                                }
                                <Link to="/orders" className="hover:text-gray-200">
                                    Orders
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-gray-200"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
}