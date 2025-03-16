import { createContext, useContext, useEffect, useState } from 'react';
import { getCartFromLocalStorage, saveCartToLocalStorage } from '../utils/cartUtils';
import {CartItem} from "../types/CartItem.ts";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "../types/JwtPayload.ts";
import axios from "axios";
import {useAuth} from "./AuthContext.tsx";

interface CartContextType {
    cart: CartItem[];
    addToCart: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    updateCartItemQuantity: (productId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    // const [role, setRole] = useState<string | null>(null);
    const token = localStorage.getItem('token');
    const { role } = useAuth();

    useEffect(() => {
        let role;
        if (token) {
            const decoded = jwtDecode<JwtPayload>(token);
            role = decoded.role;
        }

        if (role === 'admin' || role === 'user') {
            // alert('role');
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart/get`).then((res) => {
                setCart(res.data.cart);
            });
        } else {
            // alert('local');
            const localCart = getCartFromLocalStorage();
            setCart(localCart);
        }
    }, [role]);

    const addToCart = (productId: string, quantity: number) => {
        const updatedCart = [...cart, { productId, quantity }];
        setCart(updatedCart);

        if (role === 'admin' || role === 'user') {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/cart/post`, { cart: updatedCart });
        } else {
            saveCartToLocalStorage(updatedCart);
        }
        alert('added to cart');
    };

    const removeFromCart = (productId: string) => {
        const updatedCart = cart.filter(item => item.productId !== productId);
        setCart(updatedCart);

        if (role === 'admin' || role === 'user') {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/cart/post`, { cart: updatedCart });
        } else {
            saveCartToLocalStorage(updatedCart);
        }
        alert('removed from cart');
    };

    const clearCart = () => {
        setCart([]);

        if (role === 'admin' || role === 'user') {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/cart/post`, { cart: [] });
        } else {
            saveCartToLocalStorage([]);
        }
    };

    const updateCartItemQuantity = (productId: string, quantity: number) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.productId === productId
                    ? {...item, quantity: Math.max(1, quantity)}
                    : item
            )
        );
    };


    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateCartItemQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
