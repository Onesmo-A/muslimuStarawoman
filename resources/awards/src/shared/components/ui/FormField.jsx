import React from 'react';

export function FormField({ label, children }) {
    return (
        <label className="form-field">
            <span>{label}</span>
            {children}
        </label>
    );
}
