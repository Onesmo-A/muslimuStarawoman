import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../services/api/authApi';
import { baseApi } from '../../services/api/baseApi';
import { clearAuth, getLandingPath } from '../auth';
import { useToast } from '../components/ToastProvider';
import { UserMenu } from '../components/UserMenu';
import { useAuth } from '../hooks/useAuth';

const adminGroups = [
    {
        label: 'Overview',
        icon: 'fa-gauge-high',
        items: [
            { to: '/admin', label: 'Dashboard', permission: 'manage_dashboard' },
            { to: '/admin/votes', label: 'Votes', permission: 'manage_votes' },
            { to: '/admin/reports', label: 'Results & Exports', permission: 'manage_reports' },
        ],
    },
    {
        label: 'Management',
        icon: 'fa-layer-group',
        items: [
            { to: '/admin/categories', label: 'Categories', permission: 'manage_categories' },
            { to: '/admin/nominees', label: 'Nominees', permission: 'manage_nominees' },
            { to: '/admin/applications', label: 'Applications', permission: 'manage_applications' },
            { to: '/admin/nominations', label: 'Nominations', permission: 'manage_nominations' },
        ],
    },
    {
        label: 'Operations',
        icon: 'fa-calendar-check',
        items: [
            { to: '/admin/events', label: 'Events', permission: 'manage_content' },
            { to: '/admin/scores', label: 'Scoring', permission: 'manage_scores' },
            { to: '/admin/sms', label: 'SMS', permission: 'manage_sms' },
        ],
    },
    {
        label: 'System',
        icon: 'fa-sliders',
        items: [
            { to: '/admin/users', label: 'Users', permission: 'manage_users' },
            { to: '/admin/content', label: 'Content', permission: 'manage_content' },
        ],
    },
];

export function AdminLayout() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    const [logout] = useLogoutMutation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [openGroups, setOpenGroups] = useState(() => new Set(['Overview', 'Management']));

    const permissions = user?.permissions ?? [];
    const roles = user?.roles ?? [];
    const isElevated = roles.includes('super_admin') || roles.includes('admin');
    const canSeeItem = (item) => {
        if (isElevated) {
            return true;
        }
        if (!permissions.length && !roles.length) {
            return true;
        }
        return permissions.includes(item.permission);
    };
    const visibleGroups = adminGroups
        .map((group) => ({ ...group, items: group.items.filter(canSeeItem) }))
        .filter((group) => group.items.length);

    useEffect(() => {
        if (!user) return;

        if (location.pathname === '/admin') {
            const landing = getLandingPath(user);
            if (landing !== '/admin') {
                navigate(landing, { replace: true });
            }
        }
    }, [user, location.pathname, navigate]);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

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

    const toggleGroup = (label) => {
        setOpenGroups((current) => {
            const next = new Set(current);
            if (next.has(label)) {
                next.delete(label);
            } else {
                next.add(label);
            }

            return next;
        });
    };

    return (
        <div className={`admin-shell ${isSidebarOpen ? 'sidebar-open' : ''} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <button
                type="button"
                className="sidebar-backdrop"
                aria-label="Close navigation"
                onClick={() => setIsSidebarOpen(false)}
            />
            <aside className="admin-sidebar">
                <div className="admin-sidebar-head">
                    <h2>Admin Panel</h2>
                    <button
                        type="button"
                        className="admin-sidebar-collapse"
                        aria-label="Toggle sidebar"
                        onClick={() => setIsSidebarCollapsed((value) => !value)}
                    >
                        <i className={`fas ${isSidebarCollapsed ? 'fa-angles-right' : 'fa-angles-left'}`} aria-hidden="true"></i>
                    </button>
                </div>
                <nav className="admin-nav">
                    {visibleGroups.map((group) => {
                        const isActiveGroup = group.items.some((item) => location.pathname === item.to);
                        const isOpen = openGroups.has(group.label) || isActiveGroup;

                        return (
                            <div className="admin-nav-group" key={group.label}>
                                <button
                                    type="button"
                                    className={isActiveGroup ? 'active' : ''}
                                    onClick={() => toggleGroup(group.label)}
                                >
                                    <span>
                                        <i className={`fas ${group.icon}`} aria-hidden="true"></i>
                                        <span className="admin-nav-label">{group.label}</span>
                                    </span>
                                    <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true"></i>
                                </button>
                                {isOpen ? (
                                    <div className="admin-submenu">
                                        {group.items.map((item) => (
                                            <Link key={item.to} to={item.to} className={location.pathname === item.to ? 'active' : ''}>
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </nav>
                <Link to="/admin/profile" className={location.pathname === '/admin/profile' ? 'active' : ''}>
                    Profile
                </Link>
                <button type="button" className="btn btn-outline admin-logout" onClick={handleLogout}>
                    Logout
                </button>
            </aside>
            <section className="admin-content">
                <div className="admin-topbar">
                    <button
                        type="button"
                        className="sidebar-toggle"
                        aria-label="Open navigation"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <i className="fas fa-bars" aria-hidden="true"></i>
                    </button>
                    <div className="breadcrumb">{location.pathname}</div>
                    <UserMenu user={user} onLogout={handleLogout} />
                </div>
                <Outlet />
            </section>
        </div>
    );
}
