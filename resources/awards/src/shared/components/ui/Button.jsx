import React from 'react';

export function Button({ children, variant = 'gold', ...props }) {
    return (
        <button className={`btn btn-${variant}`} {...props}>
            {children}
        </button>
    );
}
