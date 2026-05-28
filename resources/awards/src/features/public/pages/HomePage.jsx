import React, { useState, useEffect } from 'react';
import PageLoader from '../../../shared/components/PageLoader';
import { Link } from 'react-router-dom';

export const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Data ya Picha za Slider (Placeholder URLs)
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
            title: "Recognizing Business Excellence",
            subtitle: "An exclusive platform to celebrate business achievements."
        },
        {
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
            title: "A Night of Prestigious Awards",
            subtitle: "Join industry leaders for a golden night of celebration."
        },
        {
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
            title: "Build Your Network",
            subtitle: "A prime opportunity to meet investors and innovators."
        }
    ];

    // Simulizi ya Loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    // Slider Logic
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [slides.length]);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <>
            
            {/* --- Hero Section with Sliding Images --- */}
            <section className="hero-slider-container">
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide.image}
                        alt="Hero Slide"
                        className={`hero-slide-image ${index === currentSlide ? 'active' : ''}`}
                    />
                ))}

                <div className="hero-content-overlay">
                    <span className="eyebrow hero-text-anim" key={`eyebrow-${currentSlide}`}>
                        Business Excellence Awards 2026
                    </span>
                    <h1 className="hero-text-anim" style={{ fontSize: '3.5rem', maxWidth: '800px', margin: '1rem 0' }} key={`title-${currentSlide}`}>
                        {slides[currentSlide].title}
                    </h1>
                    <p className="hero-text-anim" style={{ fontSize: '1.2rem', color: 'var(--muted)', maxWidth: '600px', marginBottom: '2rem' }} key={`sub-${currentSlide}`}>
                        {slides[currentSlide].subtitle}
                    </p>
                    <div className="hero-actions hero-text-anim" key={`actions-${currentSlide}`}>
                        <button className="btn btn-gold">Nominate a Winner</button>
                        <button className="btn btn-ghost">View Categories</button>
                    </div>
                </div>
            </section>

            {/* --- Countdown Section --- */}
            <Countdown date="2026-10-24T19:00:00" />

            {/* --- Categories Section --- */}
            <section className="section">
                <div className="section-title">
                    <span className="eyebrow">The Awards</span>
                    <h2>Award Categories</h2>
                </div>
                <CategoriesSlider />
            </section>

            {/* --- Sponsors Section --- */}
            <section className="section sponsors-section">
                <div className="section-title" style={{ textAlign: 'center', margin: '0 auto 2rem auto' }}>
                    <span className="eyebrow">Our Partners</span>
                    <h2>Esteemed Sponsors</h2>
                </div>
                <div className="sponsors-grid">
                    {['forbes', 'cocacola', 'google', 'microsoft', 'samsung', 'toyota'].map(name => (
                        <div key={name} className="sponsor-logo">
                            <img src={`https://logo.clearbit.com/${name}.com`} alt={`${name} logo`} />
                        </div>
                    ))}
                </div>
            </section>

            {/* --- Updates Section --- */}
            <section className="section">
                <div className="section-title">
                    <span className="eyebrow">Stay Informed</span>
                    <h2>Latest Updates</h2>
                </div>
                <div className="grid-three">
                    <div className="card">
                        <h4>Nominations Now Open</h4>
                        <p className="text-muted">The nomination period for the 2026 Business Awards has officially begun. Submit your entries before the deadline.</p>
                        <Link to="/nominees" className="text-gold font-bold mt-4 inline-block">Learn More &rarr;</Link>
                    </div>
                    <div className="card">
                        <h4>Gala Night Venue Announced</h4>
                        <p className="text-muted">We are thrilled to announce that this year's gala will be held at the prestigious Grand Hyatt Convention Center.</p>
                        <Link to="/#location" className="text-gold font-bold mt-4 inline-block">View Venue &rarr;</Link>
                    </div>
                    <div className="card">
                        <h4>Keynote Speaker Revealed</h4>
                        <p className="text-muted">Internationally acclaimed entrepreneur, Jane Doe, will be our guest of honor and keynote speaker.</p>
                        <Link to="/about" className="text-gold font-bold mt-4 inline-block">About the Speaker &rarr;</Link>
                    </div>
                </div>
            </section>

            {/* --- Reels Section --- */}
            <section className="section reels-section">
                <div className="section-title" style={{ textAlign: 'center', margin: '0 auto 2rem auto' }}>
                    <span className="eyebrow">Quick Highlights</span>
                    <h2>Event Reels</h2>
                </div>
                <ReelsSlider />
            </section>

            {/* --- Testimonials Section --- */}
            <section className="section testimonial-section">
                <div className="section-title" style={{ textAlign: 'center', margin: '0 auto 2rem auto' }}>
                    <span className="eyebrow">Voices of Success</span>
                    <h2>What Our Winners Say</h2>
                </div>
                <div className="testimonial-slider">
                    <div className="testimonial-card">
                        <p>"Winning the 'Innovator of the Year' award was a pivotal moment for our company. The recognition and networking opportunities have been invaluable."</p>
                        <footer>
                            <strong>John Smith</strong>, CEO of TechCorp (2025 Winner)
                        </footer>
                    </div>
                    <div className="testimonial-card">
                        <p>"The entire awards process was seamless and professional. It gave our team a huge morale boost and validated all our hard work."</p>
                        <footer>
                            <strong>Emily White</strong>, Founder of Creative Solutions (2025 Winner)
                        </footer>
                    </div>
                </div>
            </section>

            {/* --- Gallery Section --- */}
            <section className="section">
                <div className="section-title">
                    <span className="eyebrow">Moments of Glory</span>
                    <h2>Event Gallery</h2>
                </div>
                <GallerySlider />
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link to="/gallery" className="btn btn-outline">View Full Gallery</Link>
                </div>
            </section>

            {/* --- Location & Map Section --- */}
            <section id="location" className="section location-section">
                <div className="section-title">
                    <span className="eyebrow">Join Us</span>
                    <h2>Event Venue & Location</h2>
                </div>
                <div className="card">
                    <div className="split">
                        <div>
                            <h3>Grand Hyatt Convention Center</h3>
                            <p className="text-muted">123 Luxury Avenue, Business City, 10101</p>
                            <p>The awards ceremony will take place in the main ballroom. Doors open at 6:00 PM for a cocktail reception, followed by the main event at 7:00 PM.</p>
                            <div className="mt-8">
                                <Link to="/tickets" className="btn btn-gold">Get Your Tickets</Link>
                            </div>
                        </div>
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019494759436!2d144.9537353159042!3d-37.8200113423125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20Convention%20and%20Exhibition%20Centre!5e0!3m2!1sen!2sau!4v1629861630385!5m2!1sen!2sau"
                                width="100%"
                                height="350"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Event Location Map"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const Countdown = ({ date }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(date) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <section className="section countdown-section">
            <div className="countdown-grid">
                <div className="countdown-item"><span>{timeLeft.days || '0'}</span>Days</div>
                <div className="countdown-item"><span>{timeLeft.hours || '0'}</span>Hours</div>
                <div className="countdown-item"><span>{timeLeft.minutes || '0'}</span>Minutes</div>
                <div className="countdown-item"><span>{timeLeft.seconds || '0'}</span>Seconds</div>
            </div>
        </section>
    );
};

const CategoriesSlider = () => {
    const categories = [
        { name: 'Innovator of the Year', icon: 'fa-lightbulb' },
        { name: 'Best Tech Startup', icon: 'fa-rocket' },
        { name: 'Excellence in Customer Service', icon: 'fa-heart' },
        { name: 'Sustainable Business Award', icon: 'fa-leaf' },
        { name: 'Community Impact Award', icon: 'fa-users' },
        { name: 'Digital Transformation Leader', icon: 'fa-laptop-code' },
    ];
    return (
        <div className="category-slider-container">
            <div className="category-slider">
                {categories.map(cat => (
                    <div key={cat.name} className="category-slide-card">
                        <i className={`fas ${cat.icon}`}></i>
                        <h4>{cat.name}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReelsSlider = () => {
    const reels = [
        {
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
            title: 'Red Carpet Arrival',
            tag: 'Gala Night',
        },
        {
            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
            title: 'Winner Reactions',
            tag: 'Live Moments',
        },
        {
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
            title: 'Audience Energy',
            tag: 'Behind The Scenes',
        },
        {
            image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80',
            title: 'Spotlight Highlights',
            tag: 'Top Performances',
        },
    ];

    const [activeReel, setActiveReel] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveReel((prev) => (prev + 1) % reels.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [reels.length]);

    const goToPrevious = () => {
        setActiveReel((prev) => (prev - 1 + reels.length) % reels.length);
    };

    const goToNext = () => {
        setActiveReel((prev) => (prev + 1) % reels.length);
    };

    return (
        <div className="reels-carousel">
            <div className="reels-viewport">
                <div
                    className="reels-track"
                    style={{ transform: `translateX(-${activeReel * 100}%)` }}
                >
                    {reels.map((reel) => (
                        <article key={reel.title} className="reel-slide">
                            <div className="reel-item">
                                <img src={reel.image} alt={reel.title} />
                                <div className="reel-play-icon">
                                    <i className="fas fa-play"></i>
                                </div>
                            </div>
                            <div className="reel-copy">
                                <span className="reel-tag">{reel.tag}</span>
                                <h3>{reel.title}</h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <div className="reels-controls">
                <button type="button" className="reels-arrow" onClick={goToPrevious} aria-label="Previous reel">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div className="reels-dots" aria-label="Reel navigation">
                    {reels.map((reel, index) => (
                        <button
                            key={reel.title}
                            type="button"
                            className={`reels-dot ${index === activeReel ? 'active' : ''}`}
                            onClick={() => setActiveReel(index)}
                            aria-label={`View ${reel.title}`}
                        />
                    ))}
                </div>
                <button type="button" className="reels-arrow" onClick={goToNext} aria-label="Next reel">
                    <i className="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    );
};

const GallerySlider = () => {
    const galleryItems = [
        {
            image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
            title: 'Awards Night Entrance',
        },
        {
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
            title: 'VIP Reception Moments',
        },
        {
            image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
            title: 'Winners On Stage',
        },
        {
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
            title: 'Audience Celebration',
        },
    ];

    const [activeGalleryItem, setActiveGalleryItem] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveGalleryItem((prev) => (prev + 1) % galleryItems.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [galleryItems.length]);

    const goToPrevious = () => {
        setActiveGalleryItem((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    };

    const goToNext = () => {
        setActiveGalleryItem((prev) => (prev + 1) % galleryItems.length);
    };

    return (
        <div className="gallery-carousel">
            <div className="gallery-viewport">
                <div
                    className="gallery-track"
                    style={{ transform: `translateX(-${activeGalleryItem * 100}%)` }}
                >
                    {galleryItems.map((item) => (
                        <article key={item.title} className="gallery-slide">
                            <div className="gallery-item">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="gallery-caption">
                                <span className="gallery-count">
                                    {String(activeGalleryItem + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
                                </span>
                                <h3>{item.title}</h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <div className="gallery-controls">
                <button type="button" className="gallery-arrow" onClick={goToPrevious} aria-label="Previous gallery image">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div className="gallery-dots" aria-label="Gallery navigation">
                    {galleryItems.map((item, index) => (
                        <button
                            key={item.title}
                            type="button"
                            className={`gallery-dot ${index === activeGalleryItem ? 'active' : ''}`}
                            onClick={() => setActiveGalleryItem(index)}
                            aria-label={`View ${item.title}`}
                        />
                    ))}
                </div>
                <button type="button" className="gallery-arrow" onClick={goToNext} aria-label="Next gallery image">
                    <i className="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    );
};
