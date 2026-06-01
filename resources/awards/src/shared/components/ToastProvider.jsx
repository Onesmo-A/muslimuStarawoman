import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const pushToast = useCallback((type, message) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setToasts((current) => [...current, { id, type, message }]);
        window.setTimeout(() => removeToast(id), 4200);
    }, [removeToast]);

    const value = useMemo(() => ({
        success: (message) => pushToast('success', message),
        error: (message) => pushToast('error', message),
        warning: (message) => pushToast('warning', message),
        info: (message) => pushToast('info', message),
    }), [pushToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast-stack" aria-live="polite" aria-atomic="true">
                {toasts.map((toast) => (
                    <button
                        key={toast.id}
                        type="button"
                        className={`toast-card ${toast.type}`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <span className="toast-icon">
                            <i className={`fas ${
                                toast.type === 'success' ? 'fa-check'
                                    : toast.type === 'error' ? 'fa-xmark'
                                        : toast.type === 'warning' ? 'fa-triangle-exclamation'
                                            : 'fa-circle-info'
                            }`}></i>
                        </span>
                        <span>{toast.message}</span>
                    </button>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used inside ToastProvider');
    }

    return context;
}
