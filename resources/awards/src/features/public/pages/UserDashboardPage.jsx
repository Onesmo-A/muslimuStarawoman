import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useMyNominationsQuery } from '../../../services/api/platformApi';
import { useAuth } from '../../../shared/hooks/useAuth';

export function UserDashboardPage() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const roles = user?.roles ?? [];
    const isSponsor = roles.includes('sponsor');
    const dashboardSection = searchParams.get('section') ?? 'overview';
    const { data, isLoading } = useMyNominationsQuery(undefined, { skip: isSponsor });
    const nominations = data?.data ?? [];

    const sponsorContent = {
        overview: {
            eyebrow: 'Partnership',
            title: 'Sponsor workspace',
            text: 'Your sponsor tools are separated from applicant, judge, and admin workflows so each role lands in the right workspace.',
        },
        sponsorship: {
            eyebrow: 'Sponsorship',
            title: 'Partnership planning',
            text: 'Review sponsor visibility, partnership benefits, and the profile details needed before the gala team confirms your package.',
        },
        tickets: {
            eyebrow: 'Tickets',
            title: 'Guest reservations',
            text: 'Plan gala attendance for your team, invited guests, and partner representatives from the sponsor workspace.',
        },
    }[dashboardSection] ?? {
        eyebrow: 'Partnership',
        title: 'Sponsor workspace',
        text: 'Your sponsor tools are separated from applicant, judge, and admin workflows so each role lands in the right workspace.',
    };
    const userContent = {
        overview: {
            eyebrow: 'Applications',
            title: 'My nominations',
            text: null,
        },
        vote: {
            eyebrow: 'Voting',
            title: 'Voting workspace',
            text: 'Choose award categories and prepare your votes without leaving the dashboard area.',
        },
        tickets: {
            eyebrow: 'Tickets',
            title: 'Gala tickets',
            text: 'Review gala ticket options and plan attendance from your dashboard.',
        },
    }[dashboardSection] ?? {
        eyebrow: 'Applications',
        title: 'My nominations',
        text: null,
    };

    if (dashboardSection === 'apply') {
        return <Navigate to="/dashboard/apply" replace />;
    }

    if (isSponsor) {
        return (
            <section className="section mswa-page-shell user-dashboard-page">
                <div className="dashboard-action-grid">
                <Link to="/dashboard?section=sponsorship" className="dashboard-action-card">
                        <i className="fas fa-handshake" aria-hidden="true"></i>
                        <h3>Sponsorship</h3>
                        <p>View partnership planning and sponsor visibility opportunities.</p>
                    </Link>
                    <Link to="/dashboard?section=tickets" className="dashboard-action-card">
                        <i className="fas fa-ticket" aria-hidden="true"></i>
                        <h3>Gala Tickets</h3>
                        <p>Reserve seats for your team and invited guests.</p>
                    </Link>
                    <Link to="/dashboard/profile" className="dashboard-action-card">
                        <i className="fas fa-user-shield" aria-hidden="true"></i>
                        <h3>Profile</h3>
                        <p>Keep account contacts and password details up to date.</p>
                    </Link>
                </div>

                <div className="dashboard-panel">
                    <div className="section-title">
                        <span className="eyebrow">{sponsorContent.eyebrow}</span>
                        <h2>{sponsorContent.title}</h2>
                    </div>
                    <p>{sponsorContent.text}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section mswa-page-shell user-dashboard-page">
            <div className="dashboard-action-grid">
                <Link to="/dashboard/apply" className="dashboard-action-card">
                    <i className="fas fa-file-signature" aria-hidden="true"></i>
                    <h3>Apply or Nominate</h3>
                </Link>
                <Link to="/dashboard?section=vote" className="dashboard-action-card">
                    <i className="fas fa-check-to-slot" aria-hidden="true"></i>
                    <h3>Vote</h3>
                </Link>
                <Link to="/dashboard?section=tickets" className="dashboard-action-card">
                    <i className="fas fa-ticket" aria-hidden="true"></i>
                    <h3>Gala Tickets</h3>
                </Link>
            </div>

            <div className="dashboard-panel">
                <div className="section-title">
                    <span className="eyebrow">{userContent.eyebrow}</span>
                    <h2>{userContent.title}</h2>
                </div>
                {userContent.text ? <p>{userContent.text}</p> : null}
                {isLoading ? <p>Loading applications...</p> : null}
                {!isLoading && !nominations.length && !userContent.text ? (
                    <p>No applications yet. Start by nominating an outstanding woman.</p>
                ) : null}
                <div className="dashboard-list">
                    {!userContent.text && nominations.map((nomination) => (
                        <article key={nomination.id}>
                            <strong>{nomination.reference}</strong>
                            <span>{nomination.status}</span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
