import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../shared/layouts/PublicLayout';
import { AdminLayout } from '../shared/layouts/AdminLayout';
import { HomePage } from '../features/public/pages/HomePage';
import { CategoriesPage } from '../features/public/pages/CategoriesPage';
import { NomineesPage } from '../features/public/pages/NomineesPage';
import { VotingPage } from '../features/public/pages/VotingPage';
import { ResultsPage } from '../features/public/pages/ResultsPage';
import { TicketsPage } from '../features/public/pages/TicketsPage';
import { NewsPage } from '../features/public/pages/NewsPage';
import { GalleryPage } from '../features/public/pages/GalleryPage';
import { AboutPage } from '../features/public/pages/AboutPage';
import { SponsorsPage } from '../features/public/pages/SponsorsPage';
import { ContactPage } from '../features/public/pages/ContactPage';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminEventsPage } from '../features/admin/pages/AdminEventsPage';
import { AdminNominationsPage } from '../features/admin/pages/AdminNominationsPage';
import { AdminScoresPage } from '../features/admin/pages/AdminScoresPage';
import { AdminSmsPage } from '../features/admin/pages/AdminSmsPage';
import { AdminReportsPage } from '../features/admin/pages/AdminReportsPage';
import { AuthPage } from '../features/auth/AuthPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/nominees" element={<NomineesPage />} />
                <Route path="/voting" element={<VotingPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/sponsors" element={<SponsorsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin/login" element={<AuthPage />} />
            </Route>

            <Route
                path="/admin"
                element={(
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                )}
            >
                <Route index element={<AdminDashboardPage />} />
                <Route path="events" element={<AdminEventsPage />} />
                <Route path="nominations" element={<AdminNominationsPage />} />
                <Route path="scores" element={<AdminScoresPage />} />
                <Route path="sms" element={<AdminSmsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
