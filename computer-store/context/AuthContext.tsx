import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {JwtPayload} from "../types/JwtPayload.ts";

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    register: (token: string) => void;
    login: (token: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode<JwtPayload>(token);
            setIsAuthenticated(true);
            setRole(decoded.role);
        }
    }, []);

    const register = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<JwtPayload>(token);
        setIsAuthenticated(true);
        setRole(decoded.role);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, role, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};