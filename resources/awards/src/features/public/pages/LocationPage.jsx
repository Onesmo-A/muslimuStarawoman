import React from 'react';
import { Link } from 'react-router-dom';
import eventImage from '../../../assets/ima4.png';

const details = [
    ['fa-calendar-days', 'Date', '15th November 2026'],
    ['fa-clock', 'Time', 'Saturday, 6:00 PM - 11:00 PM'],
    ['fa-location-dot', 'Venue', 'Grand Palace Convention Center, Dar es Salaam'],
];

export function LocationPage() {
    return (
        <section className="section mswa-page-shell public-inner-page location-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">Venue & Map</span>
                    <h1>Find the Gala Location</h1>
                    <p>Plan your arrival for the Muslim Stara Women Awards recognition night.</p>
                    <div className="inner-page-actions">
                        <Link to="/tickets" className="btn btn-gold">Reserve Tickets</Link>
                        <a className="btn btn-outline" href="https://wa.me/255652724557" target="_blank" rel="noreferrer">Ask for Directions</a>
                    </div>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-map-location-dot" aria-hidden="true"></i>
                    <strong>DSM</strong>
                    <span>Dar es Salaam</span>
                </div>
            </div>

            <div className="inner-split">
                <div className="inner-image-panel">
                    <img src={eventImage} alt="Muslim Stara Women Awards venue" />
                </div>
                <div className="inner-copy-panel">
                    <span className="eyebrow">Event Details</span>
                    <h2>Arrive early, check in smoothly.</h2>
                    <div className="detail-list">
                        {details.map(([icon, label, value]) => (
                            <article key={label}>
                                <i className={`fas ${icon}`} aria-hidden="true"></i>
                                <div>
                                    <span>{label}</span>
                                    <strong>{value}</strong>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            <div className="location-map-panel">
                <iframe
                    title="Grand Palace Convention Center map"
                    src="https://www.google.com/maps?q=Grand%20Palace%20Convention%20Center%20Dar%20es%20Salaam%20Tanzania&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </section>
    );
}
