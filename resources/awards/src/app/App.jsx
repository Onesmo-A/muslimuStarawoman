import React from 'react';
import { AppRouter } from '../routes/AppRouter';
import { ToastProvider } from '../shared/components/ToastProvider';

export default function App() {
    return (
        <ToastProvider>
            <AppRouter />
        </ToastProvider>
    );
}
