import React from 'react';

export function Modal({ open, title, children }) {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h3>{title}</h3>
                {children}
            </div>
        </div>
    );
}
