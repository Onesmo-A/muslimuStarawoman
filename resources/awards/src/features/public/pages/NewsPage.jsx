import React from 'react';
import { Link } from 'react-router-dom';

const updates = [
    ['Nomination season is open', 'Applicants can now begin nominations through a secure account workspace.', 'Applications'],
    ['Public voting experience refreshed', 'Vote by category, review nominee cards, and follow current leaders.', 'Voting'],
    ['Partnership opportunities', 'Sponsors can support visibility, awards, media moments, and gala experiences.', 'Sponsors'],
];

export function NewsPage() {
    return (
        <section className="section mswa-page-shell public-inner-page news-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">Newsroom</span>
                    <h1>MSWA Updates</h1>
                    <p>Insights, nomination announcements, honoree stories, and award season updates.</p>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-newspaper" aria-hidden="true"></i>
                    <strong>News</strong>
                    <span>Award season</span>
                </div>
            </div>

            <div className="news-list">
                {updates.map(([title, body, tag]) => (
                    <article key={title}>
                        <span>{tag}</span>
                        <h3>{title}</h3>
                        <p>{body}</p>
                        <Link to={tag === 'Voting' ? '/voting' : tag === 'Sponsors' ? '/sponsorship' : '/nominees'}>
                            Read more <i className="fas fa-arrow-right" aria-hidden="true"></i>
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}
