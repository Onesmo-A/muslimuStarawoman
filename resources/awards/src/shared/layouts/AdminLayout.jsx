import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../services/api/authApi';
import { clearAuth, getLandingPath } from '../auth';
import { useAuth } from '../hooks/useAuth';

const adminItems = [
    { to: '/admin', label: 'Dashboard', permission: 'manage_dashboard' },
    { to: '/admin/events', label: 'Events', permission: 'manage_content' },
    { to: '/admin/nominations', label: 'Nominations', permission: 'manage_nominations' },
    { to: '/admin/scores', label: 'Scoring', permission: 'manage_scores' },
    { to: '/admin/sms', label: 'SMS', permission: 'manage_sms' },
    { to: '/admin/reports', label: 'Reports', permission: 'manage_reports' },
];

export function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [logout] = useLogoutMutation();

    const permissions = user?.permissions ?? [];
    const roles = user?.roles ?? [];
    const isElevated = roles.includes('super_admin') || roles.includes('admin');
    const visibleItems = adminItems.filter((item) => {
        if (isElevated) {
            return true;
        }
        if (!permissions.length && !roles.length) {
            return true;
        }
        return permissions.includes(item.permission);
    });

    useEffect(() => {
        if (!user) return;

        if (location.pathname === '/admin') {
            const landing = getLandingPath(user);
            if (landing !== '/admin') {
                navigate(landing, { replace: true });
            }
        }
    }, [user, location.pathname, navigate]);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } finally {
            clearAuth();
            navigate('/admin/login', { replace: true });
        }
    };

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <h2>Admin Panel</h2>
                {visibleItems.map((item) => (
                    <Link key={item.to} to={item.to} className={location.pathname === item.to ? 'active' : ''}>
                        {item.label}
                    </Link>
                ))}
                <button type="button" className="btn btn-outline admin-logout" onClick={handleLogout}>
                    Logout
                </button>
            </aside>
            <section className="admin-content">
                <div className="admin-topbar">
                    <div className="breadcrumb">{location.pathname}</div>
                    <div className="notifications">{user?.name ?? 'Admin'}</div>
                </div>
                <Outlet />
            </section>
        </div>
    );
}
