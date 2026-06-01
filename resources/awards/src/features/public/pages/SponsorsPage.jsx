import React from 'react';
import { Link } from 'react-router-dom';

const partners = [
    ['fa-building-columns', 'Corporate Partners', 'Brands supporting women, enterprise, and community progress.'],
    ['fa-photo-film', 'Media Partners', 'Storytelling partners amplifying nominees and the awards season.'],
    ['fa-hands-holding-circle', 'Community Partners', 'Organizations helping connect the platform with real impact.'],
];

export function SponsorsPage() {
    return (
        <section className="section mswa-page-shell public-inner-page sponsors-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">Partners</span>
                    <h1>Sponsors and Strategic Partners</h1>
                    <p>Premium ethical partners powering the Muslim Stara Women Awards experience.</p>
                    <div className="inner-page-actions">
                        <Link to="/sponsorship" className="btn btn-gold">View Packages</Link>
                        <a className="btn btn-outline" href="https://wa.me/255652724557" target="_blank" rel="noreferrer">Talk to Team</a>
                    </div>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-handshake" aria-hidden="true"></i>
                    <strong>Partner</strong>
                    <span>With MSWA</span>
                </div>
            </div>

            <div className="inner-card-grid">
                {partners.map(([icon, title, body]) => (
                    <article key={title}>
                        <i className={`fas ${icon}`} aria-hidden="true"></i>
                        <h3>{title}</h3>
                        <p>{body}</p>
                    </article>
                ))}
            </div>

            <div className="partner-showcase">
                {['Aman', 'Premium', 'Zainab', 'ILM Media', 'Sisters', 'Safa Tours'].map((name) => (
                    <span key={name}>{name}</span>
                ))}
            </div>
        </section>
    );
}
