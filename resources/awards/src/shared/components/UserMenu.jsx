import React, { useEffect, useRef, useState } from 'react';

export function UserMenu({ user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const initials = (user?.name ?? 'User')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    useEffect(() => {
        const handleClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="user-menu" ref={menuRef}>
            <button
                type="button"
                className="user-menu-trigger"
                aria-expanded={isOpen}
                aria-label="User profile"
                onClick={() => setIsOpen((value) => !value)}
            >
                <span className="profile-avatar">{initials}</span>
                <i className="fas fa-chevron-down" aria-hidden="true"></i>
            </button>
            {isOpen ? (
                <div className="user-menu-dropdown">
                    <strong>{user?.name ?? 'User'}</strong>
                    <button type="button" onClick={onLogout}>Logout</button>
                </div>
            ) : null}
        </div>
    );
}
