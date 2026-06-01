import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardQuery } from '../../../services/api/platformApi';
import { ChartCard } from '../../../shared/components/ui/ChartCard';

export function AdminDashboardPage() {
    const { data } = useDashboardQuery();
    const kpis = data?.data ?? {};

    return (
        <div className="admin-dashboard">
            <div className="grid-three">
                <ChartCard title="Nominations" value={kpis.total_nominations ?? 0} />
                <ChartCard title="Valid Votes" value={kpis.valid_votes_count ?? 0} />
                <ChartCard title="Blocked Votes" value={kpis.blocked_votes_count ?? 0} />
            </div>
            <div className="dashboard-action-grid admin-quick-actions">
                <Link to="/admin/votes" className="dashboard-action-card">
                    <i className="fas fa-fingerprint" aria-hidden="true"></i>
                    <h3>Votes Monitor</h3>
                </Link>
                <Link to="/admin/nominations" className="dashboard-action-card">
                    <i className="fas fa-file-signature" aria-hidden="true"></i>
                    <h3>Review Nominations</h3>
                </Link>
                <Link to="/admin/scores" className="dashboard-action-card">
                    <i className="fas fa-star-half-stroke" aria-hidden="true"></i>
                    <h3>Scoring</h3>
                </Link>
                <Link to="/admin/reports" className="dashboard-action-card">
                    <i className="fas fa-chart-line" aria-hidden="true"></i>
                    <h3>Reports</h3>
                </Link>
            </div>
            <div className="dashboard-panel admin-simple-panel">
                <div className="dashboard-action-grid">
                    <Link to="/admin/categories" className="dashboard-action-card">
                        <i className="fas fa-layer-group" aria-hidden="true"></i>
                        <h3>Categories</h3>
                    </Link>
                    <Link to="/admin/users" className="dashboard-action-card">
                        <i className="fas fa-users-gear" aria-hidden="true"></i>
                        <h3>Users</h3>
                    </Link>
                    <Link to="/admin/content" className="dashboard-action-card">
                        <i className="fas fa-pen-nib" aria-hidden="true"></i>
                        <h3>Website Content</h3>
                    </Link>
                </div>
            </div>
        </div>
    );
}
