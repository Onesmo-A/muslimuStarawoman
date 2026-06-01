import React from 'react';
import { Link } from 'react-router-dom';
import aboutImage from '../../../assets/imag2.png';

const pillars = [
    ['fa-star-and-crescent', 'Faith & Excellence', 'Celebrating Muslim women with purpose, modesty, and visible achievement.'],
    ['fa-people-group', 'Community Impact', 'Honoring women whose work uplifts families, businesses, and communities.'],
    ['fa-handshake-angle', 'Sisterhood', 'Creating a platform for connection, learning, recognition, and opportunity.'],
];

export function AboutPage() {
    return (
        <section className="section mswa-page-shell public-inner-page about-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">About MSWA</span>
                    <h1>Muslim Stara Women Awards</h1>
                    <p>
                        A learning and networking platform for modest women, rooted in Islamic
                        education, sisterhood, business recognition, charity initiatives, and social support.
                    </p>
                    <div className="inner-page-actions">
                        <Link to="/nominees" className="btn btn-gold">Nominate Her</Link>
                        <Link to="/voting" className="btn btn-outline">Vote Now</Link>
                    </div>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-award" aria-hidden="true"></i>
                    <strong>MSWA</strong>
                    <span>Recognition platform</span>
                </div>
            </div>

            <div className="inner-split">
                <div className="inner-image-panel">
                    <img src={aboutImage} alt="Muslim Stara Women Awards community" />
                </div>
                <div className="inner-copy-panel">
                    <span className="eyebrow">Our Purpose</span>
                    <h2>Recognition that opens doors.</h2>
                    <p>
                        MSWA brings together nominees, voters, partners, media, and guests to celebrate
                        women building impact through leadership, business, education, creativity, and service.
                    </p>
                </div>
            </div>

            <div className="inner-card-grid">
                {pillars.map(([icon, title, body]) => (
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
