import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const navItems = [
    { to: '/', label: 'Home', children: [] },
    {
        label: 'The Awards',
        children: [
            { to: '/categories', label: 'Award Categories', desc: 'Browse all available award categories.' },
            { to: '/results', label: 'Past Winners', desc: 'See the hall of fame and past winners.' },
            { to: '/nominees', label: 'Participate / Nominate', desc: 'Join the competition or nominate a business.' },
            { to: '/voting', label: 'Public Voting', desc: 'Cast your vote for your favorite nominees.' },
        ],
    },
    {
        label: 'The Event',
        children: [
            { to: '/tickets', label: 'Get Tickets', desc: 'Book your spot for the gala night.' },
            { to: '/gallery', label: 'Event Gallery', desc: 'Photos & videos from our past events.' },
            { to: '/about', label: 'Guest of Honor', desc: 'Learn about our distinguished guest of honor.' },
            { to: '/#location', label: 'Venue & Map', desc: 'Find the event location and directions.' },
        ],
    },
    {
        label: 'Connect',
        children: [
            { to: '/sponsors', label: 'Our Sponsors', desc: 'View our esteemed partners and sponsors.' },
            { to: '/sponsorship-packages', label: 'Sponsorship', desc: 'Explore partnership opportunities.' },
            { to: '/news', label: 'News & Updates', desc: 'Latest updates and articles about the awards.' },
            { to: '/contact', label: 'Contact Us', desc: 'Get in touch with our team.' },
        ],
    },
];

export function PublicLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(null);

    // Function to close the mobile menu completely
    const closeMenu = () => {
        setIsMenuOpen(false);
        setOpenAccordion(null); // Also reset accordion
    };

    // Function to toggle the main menu
    const toggleMenu = () => {
        if (isMenuOpen) {
            closeMenu();
        } else {
            setIsMenuOpen(true);
        }
    };

    // Function to toggle accordion items
    const toggleAccordion = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    return (
        <div className="luxury-shell">
            <header className="public-header">
                <Link to="/" className="brand" onClick={isMenuOpen ? closeMenu : undefined}>
                    <div className="brand-mark">B</div>
                    <span className="brand-text">Business Awards</span>
                </Link>
                
                <button 
                    className="mobile-toggle"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>

                {isMenuOpen && <div className="nav-backdrop" onClick={closeMenu} aria-hidden="true"></div>}

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    {navItems.map((item, index) => (
                        <div key={index} className={`nav-group ${openAccordion === index ? 'accordion-open' : ''}`}>
                            {item.children.length > 0 ? (
                                <>
                                    <button className="nav-link" onClick={() => toggleAccordion(index)}>
                                        <span>{item.label}</span>
                                        <i className="fas fa-chevron-down"></i>
                                    </button>
                                    <div className="mega-menu">
                                        <div className="mega-grid">
                                            {item.children.map((child, cIndex) => (
                                                <Link 
                                                    key={cIndex} 
                                                    to={child.to} 
                                                    className="mega-item"
                                                    onClick={closeMenu}
                                                >
                                                    <span className="mega-title">{child.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Link to={item.to} className="nav-link" onClick={closeMenu}>
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                    <div className="mobile-actions">
                        <Link to="/tickets" className="btn btn-gold w-full" onClick={closeMenu}>Get Tickets</Link>
                        <Link to="/admin/login" className="btn btn-outline w-full" onClick={closeMenu}>Login</Link>
                    </div>
                </nav>
                <div className="header-actions desktop-actions">
                    <Link to="/tickets" className="btn btn-ghost">Buy Tickets</Link>
                    <Link to="/admin/login" className="btn btn-outline">Login</Link>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="footer">
                <div className="footer-grid">
                    <div>
                        <h3>Business Awards</h3>
                        <p>Celebrating excellence, innovation, and impact across the business community.</p>
                    </div>
                    <div>
                        <h4>Programs</h4>
                        <Link to="/categories">Award Categories</Link>
                        <Link to="/voting">Public Voting</Link>
                        <Link to="/tickets">Tickets</Link>
                    </div>
                    <div>
                        <h4>Resources</h4>
                        <Link to="/news">News & Blog</Link>
                        <Link to="/gallery">Gallery</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                    <div>
                        <h4>Get Updates</h4>
                        <p>Join the VIP list for gala announcements.</p>
                        <div className="footer-form">
                            <input type="email" placeholder="Your email" />
                            <button type="button" className="btn btn-gold">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>(c) 2026 Business Awards. All rights reserved.</span>
                    <span className="footer-note">Designed for luxury recognition.</span>
                </div>
            </footer>
        </div>
    );
}
