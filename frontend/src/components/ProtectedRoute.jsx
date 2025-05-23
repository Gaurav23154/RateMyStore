import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Layout>{children}</Layout>;
};

export default ProtectedRoute; 