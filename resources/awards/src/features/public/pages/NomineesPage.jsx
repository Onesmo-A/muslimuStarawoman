import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';

export function NomineesPage() {
    const { user } = useAuth();

    return (
        <section className="section mswa-page-shell nomination-flow-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">Applications</span>
                    <h1>Nominate through your account.</h1>
                    <p>The awards application flow begins after login. Create an account or sign in, then complete nominations from your dashboard.</p>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-award" aria-hidden="true"></i>
                    <strong>2026</strong>
                    <span>Awards season</span>
                </div>
            </div>

            <div className="nomination-callout">
                {user ? (
                    <>
                        <i className="fas fa-user-check" aria-hidden="true"></i>
                        <div>
                            <strong>You are signed in as {user.name ?? user.email}.</strong>
                            <p>Continue to your account workspace to submit or manage a nomination.</p>
                        </div>
                        <Link to="/dashboard/apply" className="btn btn-gold">Go to workspace</Link>
                    </>
                ) : (
                    <>
                        <i className="fas fa-lock" aria-hidden="true"></i>
                        <div>
                            <strong>Login or register to start your application.</strong>
                            <p>Applications are processed inside your account for security and admin review.</p>
                        </div>
                        <Link to="/auth" className="btn btn-gold">Login / Register</Link>
                    </>
                )}
            </div>

            <div className="nomination-steps">
                {[
                    ['fa-user-plus', 'Create account', 'Use your account to keep applications secure.'],
                    ['fa-file-signature', 'Submit details', 'Add nominee information and category details.'],
                    ['fa-clipboard-check', 'Admin review', 'The team reviews and publishes approved nominees.'],
                ].map(([icon, title, body]) => (
                    <article key={title}>
                        <i className={`fas ${icon}`} aria-hidden="true"></i>
                        <h3>{title}</h3>
                        <p>{body}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
