import React from 'react';
import conceptImage from '../../../assets/mswa-pink-concept.png';
import mswaLogo from '../../../assets/mswa-logo.png';

const galleryImages = [
    { src: conceptImage, title: 'Hero concept', caption: 'Premium pink award hero visuals' },
    { src: conceptImage, title: 'About concept', caption: 'Empowerment and excellence section' },
    { src: conceptImage, title: 'Categories concept', caption: 'Award categories design language' },
    { src: conceptImage, title: 'Event concept', caption: 'Recognition and inspiration gala' },
    { src: conceptImage, title: 'Partners concept', caption: 'Partner and sponsor presentation' },
    { src: mswaLogo, title: 'MSWA logo', caption: 'Brand mark for Muslim Stara Women Awards' },
];

export function GalleryPage() {
    return (
        <section className="section mswa-page-shell public-inner-page mswa-gallery-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">Gallery</span>
                    <h1>Cinematic Gala Moments</h1>
                    <p>All available MSWA visuals and campaign assets in one gallery.</p>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-images" aria-hidden="true"></i>
                    <strong>{galleryImages.length}</strong>
                    <span>Featured visuals</span>
                </div>
            </div>

            <div className="mswa-gallery-grid">
                {galleryImages.map((image, index) => (
                    <article className="mswa-gallery-item" key={index}>
                        <div className="mswa-gallery-image-wrap">
                            <img src={image.src} alt={image.title} />
                        </div>
                        <div className="mswa-gallery-copy">
                            <strong>{image.title}</strong>
                            <span>{image.caption}</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
