import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="auth-shell">Checking access...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
