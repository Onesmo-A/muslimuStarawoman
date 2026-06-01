import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../services/api/authApi';
import { baseApi } from '../../services/api/baseApi';
import { clearAuth } from '../auth';
import { useToast } from '../components/ToastProvider';
import { UserMenu } from '../components/UserMenu';
import { useAuth } from '../hooks/useAuth';

const accountItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
    { to: '/dashboard/apply', label: 'Apply / Nominate', icon: 'fa-file-signature' },
    { to: '/dashboard?section=vote', label: 'Vote', icon: 'fa-check-to-slot' },
    { to: '/dashboard?section=tickets', label: 'Tickets', icon: 'fa-ticket' },
    { to: '/dashboard/profile', label: 'Profile', icon: 'fa-user-shield' },
];

export function AccountLayout() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [logout] = useLogoutMutation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const roles = user?.roles ?? [];
    const isSponsor = roles.includes('sponsor');
    const visibleItems = isSponsor
        ? [
            { to: '/dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
            { to: '/dashboard?section=sponsorship', label: 'Sponsorship', icon: 'fa-handshake' },
            { to: '/dashboard?section=tickets', label: 'Tickets', icon: 'fa-ticket' },
            { to: '/dashboard/profile', label: 'Profile', icon: 'fa-user-shield' },
        ]
        : accountItems;

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            toast.success('Logged out successfully.');
        } finally {
            clearAuth();
            dispatch(baseApi.util.resetApiState());
            navigate('/auth', { replace: true });
        }
    };

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname, location.search]);

    const isActiveItem = (item) => {
        if (item.to.includes('?')) {
            return `${location.pathname}${location.search}` === item.to;
        }

        return location.pathname === item.to;
    };

    return (
        <div className={`account-shell ${isSidebarOpen ? 'sidebar-open' : ''} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <button
                type="button"
                className="sidebar-backdrop"
                aria-label="Close navigation"
                onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="account-sidebar">
                <Link to="/" className="account-brand">MSWA</Link>
                <nav>
                    {visibleItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={isActiveItem(item) ? 'active' : ''}
                        >
                            <i className={`fas ${item.icon}`} aria-hidden="true"></i>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="account-main">
                <header className="account-topbar">
                    <button
                        type="button"
                        className="sidebar-toggle"
                        aria-label="Open navigation"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <i className="fas fa-bars" aria-hidden="true"></i>
                    </button>
                    <button
                        type="button"
                        className="sidebar-collapse"
                        aria-label={isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
                        onClick={() => setIsSidebarCollapsed((value) => !value)}
                    >
                        <i className={`fas ${isSidebarCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`} aria-hidden="true"></i>
                    </button>
                    <div>
                        <span className="eyebrow">My Dashboard</span>
                        <strong>Welcome{user?.name ? `, ${user.name}` : ''}</strong>
                    </div>
                    <UserMenu user={user} onLogout={handleLogout} />
                </header>
                <Outlet />
            </main>
        </div>
    );
}
