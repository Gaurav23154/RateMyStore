import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            console.log('Sending login request with:', credentials);
            const response = await authService.login(credentials);
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            console.error('Login error in context:', error);
            throw error.response?.data || { error: 'An error occurred during login' };
        }
    };

    const register = async (userData) => {
        try {
            console.log('AuthContext register called with:', userData);
            const response = await authService.register(userData);
            console.log('AuthContext register response:', response.data);
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            console.error('AuthContext register error:', error);
            throw error.response?.data || { error: 'An error occurred' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updatePassword = async (passwordData) => {
        try {
            await authService.updatePassword(passwordData);
        } catch (error) {
            throw error.response?.data || { error: 'An error occurred' };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updatePassword,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStoreOwner: user?.role === 'store_owner',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 