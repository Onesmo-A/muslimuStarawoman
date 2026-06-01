import React from 'react';
import { Link } from 'react-router-dom';
import eventImage from '../../../assets/ima4.png';

const tickets = [
    ['Standard Seat', 'Community access for one guest.', 'TSh 50,000'],
    ['VIP Seat', 'Premium seating, reception access, and priority check-in.', 'TSh 150,000'],
    ['Corporate Table', 'Reserved table for teams, partners, or invited guests.', 'Contact team'],
];

export function TicketsPage() {
    return (
        <section className="section mswa-page-shell public-inner-page tickets-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">Gala Night</span>
                    <h1>Reserve Gala Tickets</h1>
                    <p>VIP, standard, and premium table bookings for the Muslim Stara Women Awards recognition night.</p>
                    <div className="inner-page-actions">
                        <a className="btn btn-gold" href="https://wa.me/255652724557" target="_blank" rel="noreferrer">Book on WhatsApp</a>
                        <Link to="/location" className="btn btn-outline">View Location</Link>
                    </div>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-ticket" aria-hidden="true"></i>
                    <strong>15 Nov</strong>
                    <span>Gala night</span>
                </div>
            </div>

            <div className="inner-split">
                <div className="inner-image-panel">
                    <img src={eventImage} alt="Muslim Stara Women Awards gala" />
                </div>
                <div className="inner-copy-panel">
                    <span className="eyebrow">Experience</span>
                    <h2>A refined night of recognition.</h2>
                    <p>Join nominees, families, sponsors, leaders, and media for an evening built around celebration, networking, and inspiration.</p>
                </div>
            </div>

            <div className="inner-card-grid ticket-package-grid">
                {tickets.map(([title, body, price]) => (
                    <article key={title}>
                        <i className="fas fa-receipt" aria-hidden="true"></i>
                        <h3>{title}</h3>
                        <p>{body}</p>
                        <strong>{price}</strong>
                    </article>
                ))}
            </div>
        </section>
    );
}
