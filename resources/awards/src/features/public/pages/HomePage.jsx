import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLoader from '../../../shared/components/PageLoader';
import heroOne from '../../../assets/image1.png';
import aboutImage from '../../../assets/imag2.png';
import categoriesImage from '../../../assets/imag3.png';
import eventImage from '../../../assets/ima4.png';
import momentsImage from '../../../assets/imag5.png';
import footerImage from '../../../assets/imag6.png';

const ownerPhone = '+255652724557';
const whatsappOwner = `https://wa.me/${ownerPhone.replace(/\D/g, '')}`;

const categories = [
    {
        icon: 'fa-star-half-stroke',
        title: 'Leadership Excellence',
        body: 'Celebrating women who lead with vision and positive community impact.',
    },
    {
        icon: 'fa-briefcase',
        title: 'Entrepreneurship Award',
        body: 'Honoring business growth, innovation, and inspiring enterprise.',
    },
    {
        icon: 'fa-people-group',
        title: 'Community Impact',
        body: 'Recognizing service that creates meaningful change for others.',
    },
    {
        icon: 'fa-book-open-reader',
        title: 'Education Excellence',
        body: 'Celebrating education, mentorship, and confidence-building work.',
    },
    {
        icon: 'fa-palette',
        title: 'Creativity & Culture',
        body: 'Showcasing talent across arts, media, culture, and creativity.',
    },
    {
        icon: 'fa-trophy',
        title: 'Young Achiever Award',
        body: 'For young women making bold progress early in their journey.',
    },
];

const impactPillars = [
    {
        icon: 'fa-award',
        title: 'Recognize Excellence',
        body: 'Celebrating achievement and community contribution.',
    },
    {
        icon: 'fa-user-astronaut',
        title: 'Inspire Generations',
        body: 'Inspiring Muslim women to rise with confidence.',
    },
    {
        icon: 'fa-hands-holding-circle',
        title: 'Build Community',
        body: 'Creating room for networks and collaboration.',
    },
    {
        icon: 'fa-lightbulb',
        title: 'Create Impact',
        body: 'Supporting women with bold ideas and purpose.',
    },
];

const gallery = [
    { image: momentsImage, position: '50% 18%' },
    { image: momentsImage, position: '50% 35%' },
    { image: momentsImage, position: '50% 52%' },
    { image: momentsImage, position: '50% 68%' },
    { image: footerImage, position: '50% 34%' },
];

const heroSlides = [
    {
        image: footerImage,
        kicker: 'Stara Women Awards 2026',
        title: 'Muslim Stara Women Awards',
        accent: 'Celebrate Her.',
        body: 'Honoring Muslim women in leadership, business, creativity, education, and community impact.',
        secondaryCta: { to: '/nominees', label: 'Nominate Her' },
    },
    {
        image: heroOne,
        kicker: 'Women of Impact',
        title: 'Bold Women',
        accent: 'Bright Futures.',
        body: 'A platform for visibility, recognition, and new opportunities.',
        secondaryCta: { to: '/about', label: 'Explore the Awards' },
    },
    {
        image: eventImage,
        kicker: 'Recognition Night',
        title: 'A Night to Honor',
        accent: 'Real Impact.',
        body: 'Join partners, sponsors, and the community as we celebrate excellence.',
        secondaryCta: { to: '/tickets', label: 'Get Tickets' },
    },
];

const partners = [
    { name: 'Aman', tone: '#f2a21b', icon: 'fa-diamond' },
    { name: 'Premium', tone: '#0099bf', icon: 'fa-building-columns' },
    { name: 'Zainab', tone: '#d92ba6', icon: 'fa-spa' },
    { name: 'ILM Media', tone: '#c88719', icon: 'fa-broadcast-tower' },
    { name: 'Sisters', tone: '#ec2e90', icon: 'fa-people-roof' },
    { name: 'Safa Tours', tone: '#178f5f', icon: 'fa-route' },
];

export const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((current) => (current + 1) % heroSlides.length);
        }, 8000);

        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return <PageLoader />;
    }

    const slide = heroSlides[activeSlide];

    return (
        <div className="mswa-home mswa-pink-home">
            <section className="mswa-hero section">
                <div className="hero-copy-content">
                    <span className="eyebrow">{slide.kicker}</span>
                    <h1>
                        {slide.title} <span>{slide.accent}</span>
                    </h1>
                    <p>{slide.body}</p>
                    <div className="hero-actions">
                        <Link to="/voting" className="btn btn-primary">Vote Now</Link>
                        <Link to={slide.secondaryCta.to} className="btn btn-outline">
                            {slide.secondaryCta.label}
                            <i className="fas fa-arrow-right" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="hero-slide-dots" aria-label="Hero slides">
                        {heroSlides.map((item, index) => (
                            <button
                                key={item.title}
                                type="button"
                                className={index === activeSlide ? 'active' : ''}
                                onClick={() => setActiveSlide(index)}
                                aria-label={`Show slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mswa-hero-visual" aria-label="Muslim Stara Women Awards celebration">
                    <div className="hero-star" aria-hidden="true"></div>
                    <img key={slide.image} src={slide.image} alt="Muslim women awards celebration" />
                    <div className="hero-award-badge">
                        <i className="fas fa-star-and-crescent" aria-hidden="true" />
                        <span>Muslim Stara Women Awards</span>
                    </div>
                </div>
            </section>

            <section className="mswa-about section">
                <div className="about-copy">
                    <span className="eyebrow">About the Awards</span>
                    <h2>
                        Empowering Women. Celebrating <span>Excellence.</span>
                    </h2>
                    <p>
                        Stara Women Awards 2026 recognizes Muslim women making a meaningful
                        difference in community, business, leadership, creativity, and education.
                        The platform creates visibility, confidence, and new opportunities.
                    </p>
                    <div className="about-points">
                        {impactPillars.map((point) => (
                            <div className="about-point" key={point.title}>
                                <i className={`fas ${point.icon}`} aria-hidden="true" />
                                <div>
                                    <strong>{point.title}</strong>
                                    <p>{point.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="about-actions">
                        <Link to="/categories" className="btn btn-primary">Discover More</Link>
                    </div>
                </div>
                <div className="about-visual">
                    <img src={aboutImage} alt="Muslim Stara Women Awards about section" />
                </div>
            </section>

            <section className="mswa-categories section">
                <div className="section-heading">
                    <span className="eyebrow">Award Categories</span>
                    <h2>Honoring Excellence in Every Field</h2>
                    <p>
                        Celebrating Muslim women shaping communities through leadership,
                        enterprise, education, creativity, service, and vision.
                    </p>
                </div>
                <div className="categories-grid">
                    {categories.map((category) => (
                        <article className="category-card" key={category.title}>
                            <i className={`fas ${category.icon}`} aria-hidden="true" />
                            <h3>{category.title}</h3>
                            <p>{category.body}</p>
                        </article>
                    ))}
                </div>
                <div className="section-action">
                    <Link to="/categories" className="btn btn-outline">View All Categories</Link>
                </div>
            </section>

            <section className="mswa-save-date section" id="location">
                <div className="save-date-visual">
                    <img src={eventImage} alt="Muslim Stara Women Awards gala event" />
                </div>
                <div className="save-date-copy">
                    <span className="eyebrow">Save the Date</span>
                    <h2>The Biggest Night of Recognition & Inspiration</h2>
                    <div className="event-meta">
                        <span><i className="fas fa-calendar-days" aria-hidden="true" />15th November 2026</span>
                        <span><i className="fas fa-clock" aria-hidden="true" />Saturday, 6:00 PM - 11:00 PM</span>
                        <span><i className="fas fa-location-dot" aria-hidden="true" />Grand Palace Convention Center, Dar es Salaam</span>
                        <a href={whatsappOwner} target="_blank" rel="noreferrer">
                            <i className="fab fa-whatsapp" aria-hidden="true" />{ownerPhone.replace('+255', '+255 ')}
                        </a>
                    </div>
                    <div className="countdown-wrap">
                        <Countdown date="2026-11-15T18:00:00" />
                    </div>
                    <Link to="/tickets" className="btn btn-primary">Get Your Tickets</Link>
                </div>
                <div className="venue-map">
                    <iframe
                        title="Grand Palace Convention Center map"
                        src="https://www.google.com/maps?q=Grand%20Palace%20Convention%20Center%20Dar%20es%20Salaam%20Tanzania&output=embed"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </section>

            <section className="mswa-video-section section">
                <div className="video-showcase">
                    <div className="video-poster">
                        <img src={categoriesImage} alt="Muslim Stara Women Awards video preview" />
                        <a
                            className="play-ripple"
                            href="https://www.instagram.com/muslim_stara_women_awards?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Play Muslim Stara Women Awards video"
                        >
                            <i className="fas fa-play" aria-hidden="true" />
                        </a>
                    </div>
                    <div className="video-copy">
                        <span className="eyebrow">Watch the Story</span>
                        <h2>Feel the Spirit of Stara Women Awards</h2>
                        <p>
                            Watch highlights, reels, and campaign moments celebrating women
                            with purpose, courage, and community impact.
                        </p>
                        <div className="video-links">
                            <a href="https://www.youtube.com/results?search_query=Muslim+Stara+Women+Awards" target="_blank" rel="noreferrer">
                                <i className="fab fa-youtube" aria-hidden="true" /> YouTube Videos
                            </a>
                            <a href="https://www.instagram.com/muslim_stara_women_awards?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer">
                                <i className="fab fa-instagram" aria-hidden="true" /> Instagram Reels
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mswa-gallery-preview section">
                <div className="section-heading">
                    <span className="eyebrow">Our Moments</span>
                    <h2>Glimpses of Inspiration</h2>
                </div>
                <div className="gallery-grid">
                    {gallery.map((item, index) => (
                        <article className="gallery-card" key={`${item.position}-${index}`}>
                            <img
                                src={item.image}
                                alt={`Muslim Stara Women Awards moment ${index + 1}`}
                                style={{ objectPosition: item.position }}
                            />
                        </article>
                    ))}
                </div>
                <div className="section-action">
                    <Link to="/gallery" className="btn btn-outline">View Gallery</Link>
                </div>
            </section>

            <section className="mswa-partners section">
                <div className="section-heading">
                    <span className="eyebrow">Our Partners</span>
                    <h2>Proudly Supported by</h2>
                </div>
                <div className="partner-logos">
                    {[...partners, ...partners].map((partner, index) => (
                        <div
                            className="partner-logo"
                            key={`${partner.name}-${index}`}
                            style={{ '--partner-tone': partner.tone }}
                            aria-hidden={index >= partners.length ? 'true' : undefined}
                        >
                            <i className={`fas ${partner.icon}`} aria-hidden="true" />
                            <span>{partner.name}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const Countdown = ({ date }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(date) - +new Date();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [date]);

    return (
        <div className="countdown-grid">
            <div className="countdown-item"><span>{timeLeft.days}</span>Days</div>
            <div className="countdown-item"><span>{timeLeft.hours}</span>Hours</div>
            <div className="countdown-item"><span>{timeLeft.minutes}</span>Minutes</div>
            <div className="countdown-item"><span>{timeLeft.seconds}</span>Seconds</div>
        </div>
    );
};
