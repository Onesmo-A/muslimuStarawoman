import React from 'react';
import { useDashboardQuery } from '../../../services/api/platformApi';

const workspaceCopy = {
    votes: {
        eyebrow: 'Voting Control',
        title: 'Votes monitoring',
        text: 'Monitor valid and blocked votes, fingerprint limits, IP traces, and source channels.',
    },
    users: {
        eyebrow: 'Access Control',
        title: 'Users workspace',
        text: 'Review platform users, roles, and future account actions from one super admin area.',
    },
    categories: {
        eyebrow: 'Awards Setup',
        title: 'Categories workspace',
        text: 'Prepare category editing, pricing, voting flags, and eligibility settings.',
    },
    nominees: {
        eyebrow: 'Nominee Control',
        title: 'Nominees workspace',
        text: 'Monitor nominee records, visibility, profile details, and category placement.',
    },
    applications: {
        eyebrow: 'Application Pipeline',
        title: 'Applications workspace',
        text: 'Track submitted applications, drafts, payments, and review status.',
    },
    content: {
        eyebrow: 'Website Content',
        title: 'Content workspace',
        text: 'Prepare website pages, posts, home content, gallery, sponsor copy, and event messaging.',
    },
};

export function SuperAdminWorkspacePage({ area }) {
    const { data } = useDashboardQuery();
    const dashboard = data?.data ?? {};
    const copy = workspaceCopy[area] ?? workspaceCopy.votes;
    const recentVotes = dashboard.recent_votes ?? [];

    return (
        <div className="admin-dashboard">
            {area === 'votes' ? (
                <>
                    <div className="grid-three">
                        <div className="chart-card">
                            <span>Valid Votes</span>
                            <strong>{dashboard.valid_votes_count ?? 0}</strong>
                        </div>
                        <div className="chart-card">
                            <span>Blocked Attempts</span>
                            <strong>{dashboard.blocked_votes_count ?? 0}</strong>
                        </div>
                        <div className="chart-card">
                            <span>Total Vote Records</span>
                            <strong>{dashboard.votes_count ?? 0}</strong>
                        </div>
                    </div>

                    <div className="dashboard-panel">
                        <div className="dashboard-list admin-activity-list">
                            {recentVotes.map((vote) => (
                                <article key={vote.id}>
                                    <div>
                                        <strong>{vote.nominee?.contact_person ?? vote.nominee?.business_name ?? 'Nominee'}</strong>
                                        <span>{vote.category?.name ?? 'Category'} | {vote.ip_address ?? 'No IP'}</span>
                                    </div>
                                    <span>{vote.status}{vote.block_reason ? `: ${vote.block_reason}` : ''}</span>
                                </article>
                            ))}
                            {!recentVotes.length ? <p>No vote records yet.</p> : null}
                        </div>
                    </div>
                </>
            ) : (
                <div className="grid-three">
                    <div className="chart-card">
                        <span>Users</span>
                        <strong>{dashboard.users_count ?? 0}</strong>
                    </div>
                    <div className="chart-card">
                        <span>Nominees</span>
                        <strong>{dashboard.nominees_count ?? 0}</strong>
                    </div>
                    <div className="chart-card">
                        <span>Applications</span>
                        <strong>{dashboard.total_nominations ?? 0}</strong>
                    </div>
                </div>
            )}
        </div>
    );
}
