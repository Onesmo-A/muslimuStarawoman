import React from 'react';
import { Navigate } from 'react-router-dom';
import { getLandingPath } from '../shared/auth';
import PageLoader from '../shared/components/PageLoader';
import { useAuth } from '../shared/hooks/useAuth';

export function ProtectedRoute({ children, permissions = [], roles = [] }) {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    const userPermissions = user?.permissions ?? [];
    const userRoles = user?.roles ?? [];
    const hasPermission = !permissions.length || permissions.some((permission) => userPermissions.includes(permission));
    const hasRole = !roles.length || roles.some((role) => userRoles.includes(role));

    if (!hasPermission || !hasRole) {
        const landing = getLandingPath(user);

        return <Navigate to={landing} replace />;
    }

    return children;
}
