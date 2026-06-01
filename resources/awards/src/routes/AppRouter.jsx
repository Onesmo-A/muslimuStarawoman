import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from '../shared/layouts/PublicLayout';
import { AdminLayout } from '../shared/layouts/AdminLayout';
import { AccountLayout } from '../shared/layouts/AccountLayout';
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
import { LocationPage } from '../features/public/pages/LocationPage';
import { SponsorshipPage } from '../features/public/pages/SponsorshipPage';
import { UserDashboardPage } from '../features/public/pages/UserDashboardPage';
import { ProfilePage } from '../features/account/ProfilePage';
import { ApplyNominationPage } from '../features/account/ApplyNominationPage';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminCategoriesPage } from '../features/admin/pages/AdminCategoriesPage';
import { AdminCategoryDetailPage } from '../features/admin/pages/AdminCategoryDetailPage';
import { AdminEventsPage } from '../features/admin/pages/AdminEventsPage';
import { AdminNomineesPage } from '../features/admin/pages/AdminNomineesPage';
import { AdminNomineeDetailPage } from '../features/admin/pages/AdminNomineeDetailPage';
import { AdminNominationsPage } from '../features/admin/pages/AdminNominationsPage';
import { AdminScoresPage } from '../features/admin/pages/AdminScoresPage';
import { AdminSmsPage } from '../features/admin/pages/AdminSmsPage';
import { AdminReportsPage } from '../features/admin/pages/AdminReportsPage';
import { SuperAdminWorkspacePage } from '../features/admin/pages/SuperAdminWorkspacePage';
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
                <Route path="/sponsorship" element={<SponsorshipPage />} />
                <Route path="/sponsorship-packages" element={<SponsorshipPage />} />
                <Route path="/location" element={<LocationPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin/login" element={<Navigate to="/auth" replace />} />
            </Route>

            <Route
                path="/dashboard"
                element={(
                    <ProtectedRoute>
                        <AccountLayout />
                    </ProtectedRoute>
                )}
            >
                <Route index element={<UserDashboardPage />} />
                <Route path="apply" element={<ApplyNominationPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route
                path="/admin"
                element={(
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                )}
            >
                <Route
                    index
                    element={(
                        <ProtectedRoute permissions={['manage_dashboard']}>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="events"
                    element={(
                        <ProtectedRoute permissions={['manage_content']}>
                            <AdminEventsPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="votes"
                    element={(
                        <ProtectedRoute permissions={['manage_votes']}>
                            <SuperAdminWorkspacePage area="votes" />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="categories"
                    element={(
                        <ProtectedRoute permissions={['manage_categories']}>
                            <AdminCategoriesPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="categories/:id"
                    element={(
                        <ProtectedRoute permissions={['manage_categories']}>
                            <AdminCategoryDetailPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="nominees"
                    element={(
                        <ProtectedRoute permissions={['manage_nominees']}>
                            <AdminNomineesPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="nominees/:id"
                    element={(
                        <ProtectedRoute permissions={['manage_nominees']}>
                            <AdminNomineeDetailPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="applications"
                    element={(
                        <ProtectedRoute permissions={['manage_applications']}>
                            <AdminNominationsPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="users"
                    element={(
                        <ProtectedRoute permissions={['manage_users']}>
                            <SuperAdminWorkspacePage area="users" />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="content"
                    element={(
                        <ProtectedRoute permissions={['manage_content']}>
                            <SuperAdminWorkspacePage area="content" />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="nominations"
                    element={(
                        <ProtectedRoute permissions={['manage_nominations']}>
                            <AdminNominationsPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="scores"
                    element={(
                        <ProtectedRoute permissions={['manage_scores']} roles={['super_admin', 'admin', 'judge']}>
                            <AdminScoresPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="sms"
                    element={(
                        <ProtectedRoute permissions={['manage_sms']}>
                            <AdminSmsPage />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="reports"
                    element={(
                        <ProtectedRoute permissions={['manage_reports']}>
                            <AdminReportsPage />
                        </ProtectedRoute>
                    )}
                />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
