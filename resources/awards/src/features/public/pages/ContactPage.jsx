import React from 'react';
import { Link } from 'react-router-dom';

const contacts = [
    ['fa-phone', 'Phone / WhatsApp', '+255 652 724 557'],
    ['fa-envelope', 'Email', 'info@muslimstarawomenawards.com'],
    ['fa-location-dot', 'Location', 'Dar es Salaam, Tanzania'],
];

export function ContactPage() {
    return (
        <section className="section mswa-page-shell public-inner-page contact-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">Connect</span>
                    <h1>Contact the Awards Secretariat</h1>
                    <p>Reach our team for nominations, sponsorships, media, partnerships, and gala inquiries.</p>
                    <div className="inner-page-actions">
                        <a className="btn btn-gold" href="https://wa.me/255652724557" target="_blank" rel="noreferrer">WhatsApp Team</a>
                        <Link to="/sponsorship" className="btn btn-outline">Sponsorship</Link>
                    </div>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-headset" aria-hidden="true"></i>
                    <strong>Talk</strong>
                    <span>To MSWA team</span>
                </div>
            </div>

            <div className="inner-card-grid">
                {contacts.map(([icon, label, value]) => (
                    <article key={label}>
                        <i className={`fas ${icon}`} aria-hidden="true"></i>
                        <h3>{label}</h3>
                        <p>{value}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
