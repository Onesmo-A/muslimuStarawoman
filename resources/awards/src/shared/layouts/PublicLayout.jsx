import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../../assets/mswa-logo.png';

const contactPhone = '+255 652 724 557';
const nativePhone = '+255743331626';
const ownerWhatsapp = `https://wa.me/${contactPhone.replace(/\D/g, '')}`;
const nativeWhatsapp = `https://wa.me/${nativePhone.replace(/\D/g, '')}`;
const instagramUrl = 'https://www.instagram.com/muslim_stara_women_awards?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';
const youtubeUrl = 'https://www.youtube.com/results?search_query=Muslim+Stara+Women+Awards';
const tiktokUrl = 'https://www.tiktok.com/search?q=Muslim%20Stara%20Women%20Awards';

const navItems = [
    { to: '/', label: 'Home', children: [] },
    {
        label: 'The Awards',
        children: [
            { to: '/categories', label: 'Award Categories', desc: 'Browse all available award categories.' },
            { to: '/results', label: 'Results / Winners', desc: 'See current vote leaders and winners.' },
            { to: '/nominees', label: 'Nominate', desc: 'Nominate an outstanding Muslim woman.' },
            { to: '/voting', label: 'Public Voting', desc: 'Cast your vote for your favorite nominees.' },
        ],
    },
    {
        label: 'The Event',
        children: [
            { to: '/tickets', label: 'Get Tickets', desc: 'Book your spot for the gala night.' },
            { to: '/gallery', label: 'Gallery', desc: 'Photos and videos from our events.' },
            { to: '/about', label: 'About MSWA', desc: 'Learn about the awards mission.' },
            { to: '/location', label: 'Venue & Map', desc: 'Find the event location and directions.' },
        ],
    },
    {
        label: 'Connect',
        children: [
            { to: '/sponsors', label: 'Our Sponsors', desc: 'View our esteemed partners and sponsors.' },
            { to: '/sponsorship', label: 'Sponsorship', desc: 'Explore partnership opportunities.' },
            { to: '/news', label: 'News & Updates', desc: 'Latest updates and articles about the awards.' },
            { to: '/contact', label: 'Contact Us', desc: 'Get in touch with our team.' },
        ],
    },
];

export function PublicLayout() {
    const location = useLocation();
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
                    <span className="brand-mark">
                        <img src={logo} alt="Muslim Stara Women Awards logo" />
                    </span>
                    <span className="brand-copy">
                        <span className="brand-kicker">Muslim</span>
                        <span className="brand-text">Stara Women Awards</span>
                    </span>
                </Link>

                <a className="header-contact" href={ownerWhatsapp} target="_blank" rel="noreferrer">
                    <i className="fab fa-whatsapp" aria-hidden="true"></i>
                    <span>{contactPhone}</span>
                </a>
                
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
                                    <button
                                        type="button"
                                        className="nav-link"
                                        onClick={() => toggleAccordion(index)}
                                        aria-expanded={openAccordion === index}
                                    >
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
                                                    <span className="mega-icon" aria-hidden="true">
                                                        <i className="fas fa-star-and-crescent"></i>
                                                    </span>
                                                    <span className="mega-title">{child.label}</span>
                                                    <span className="mega-desc">{child.desc}</span>
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
                        <Link to="/nominees" className="btn btn-gold w-full" onClick={closeMenu}>Apply</Link>
                        <Link to="/voting" className="btn btn-outline w-full" onClick={closeMenu}>Vote</Link>
                        <Link to="/auth" className="btn btn-ghost w-full" onClick={closeMenu}>Login</Link>
                    </div>
                </nav>
                <div className="header-actions desktop-actions">
                    <Link to="/tickets" className="btn btn-ghost">Gala Tickets</Link>
                    <Link to="/nominees" className="btn btn-outline">Apply</Link>
                    <Link to="/auth" className="btn btn-gold">Login</Link>
                </div>
            </header>
            <main key={location.pathname} className="page-transition">
                <Outlet />
            </main>
            <footer className="footer">
                <div className="footer-glow" aria-hidden="true"></div>
                <div className="footer-grid">
                    <div className="footer-brand-block">
                        <span className="footer-emblem">
                            <img src={logo} alt="Muslim Stara Women Awards logo" />
                        </span>
                        <h3>Muslim Stara Women Awards</h3>
                        <p>
                            Jukwaa la kutambua, kuhamasisha na kuenzi mchango mkubwa wa wanawake
                            wa Kiislamu katika jamii, biashara, uongozi, ubunifu na elimu.
                        </p>
                        <div className="footer-socials">
                            <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                                <i className="fab fa-instagram" aria-hidden="true"></i>
                            </a>
                            <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label="YouTube">
                                <i className="fab fa-youtube" aria-hidden="true"></i>
                            </a>
                            <a href={tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok">
                                <i className="fab fa-tiktok" aria-hidden="true"></i>
                            </a>
                            <a href={ownerWhatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                                <i className="fab fa-whatsapp" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4>Quick Links</h4>
                        <Link to="/">Home</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/categories">Awards</Link>
                        <Link to="/nominees">Nominate</Link>
                        <Link to="/sponsorship">Sponsorship</Link>
                    </div>
                    <div>
                        <h4>Categories</h4>
                        <Link to="/categories">Leadership Excellence</Link>
                        <Link to="/categories">Entrepreneurship Award</Link>
                        <Link to="/categories">Community Impact</Link>
                        <Link to="/categories">Education Excellence</Link>
                    </div>
                    <div>
                        <h4>Experience</h4>
                        <Link to="/tickets">Gala Tickets</Link>
                        <Link to="/gallery">Gallery</Link>
                        <Link to="/location">Location</Link>
                        <Link to="/news">News</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                    <div>
                        <h4>Contact</h4>
                        <a href={ownerWhatsapp} target="_blank" rel="noreferrer">{contactPhone}</a>
                        <p>Stay updated with nominations, sponsorship opportunities and gala announcements.</p>
                        <div className="footer-form">
                            <input type="email" placeholder="Your email" />
                            <button type="button" className="btn btn-primary">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>(c) 2026 Muslim Stara Women Awards. All rights reserved.</span>
                    <span className="footer-note">
                        Design and Developed by{' '}
                        <a href="https://nativetechnology.africa/" target="_blank" rel="noreferrer">Native Technology tz</a>
                        {' | '}
                        <a href={nativeWhatsapp} target="_blank" rel="noreferrer">{nativePhone}</a>
                    </span>
                </div>
            </footer>
        </div>
    );
}
