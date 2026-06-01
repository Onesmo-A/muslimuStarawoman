import React from 'react';
import { Link } from 'react-router-dom';

const packages = [
    ['Title Partner', 'Headline visibility across campaign, gala stage, media, and awards content.', 'Premium'],
    ['Category Sponsor', 'Own a category moment and support nominees in a focused recognition area.', 'Featured'],
    ['Media Partner', 'Support coverage, reels, interviews, and post-event storytelling.', 'Visibility'],
    ['Community Partner', 'Support invitations, outreach, and community impact touchpoints.', 'Impact'],
];

export function SponsorshipPage() {
    return (
        <section className="section mswa-page-shell public-inner-page sponsorship-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">Sponsorship</span>
                    <h1>Partner with Muslim Stara Women Awards</h1>
                    <p>Build meaningful visibility by supporting a platform that celebrates Muslim women in leadership, enterprise, education, creativity, and service.</p>
                    <div className="inner-page-actions">
                        <a className="btn btn-gold" href="https://wa.me/255652724557" target="_blank" rel="noreferrer">Request Package</a>
                        <Link to="/sponsors" className="btn btn-outline">View Sponsors</Link>
                    </div>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-gem" aria-hidden="true"></i>
                    <strong>4</strong>
                    <span>Partner options</span>
                </div>
            </div>

            <div className="inner-card-grid sponsorship-package-grid">
                {packages.map(([title, body, tag]) => (
                    <article key={title}>
                        <span>{tag}</span>
                        <i className="fas fa-star-and-crescent" aria-hidden="true"></i>
                        <h3>{title}</h3>
                        <p>{body}</p>
                        <a href="https://wa.me/255652724557" target="_blank" rel="noreferrer">Discuss package</a>
                    </article>
                ))}
            </div>
        </section>
    );
}
