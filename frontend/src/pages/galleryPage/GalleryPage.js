import React, { useState, useEffect, useRef } from 'react';
import './GalleryPage.css';
import { motion } from 'framer-motion';

const GalleryPage = () => {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef(null);

  // YouTube videos configuration - Replace with your actual video IDs
  const youtubeVideos = [
    {
      id: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: 'Handcrafted Furniture Making Process',
      description: 'Watch our artisans craft beautiful furniture pieces'
    },
    {
      id: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: 'Behind the Scenes: Workshop Tour',
      description: 'Explore our traditional woodworking workshop'
    },
    {
      id: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: 'Design Inspiration & Craftsmanship',
      description: 'The art and soul behind every piece we create'
    },
    {
      id: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: 'Sustainable Materials & Practices',
      description: 'Our commitment to eco-friendly furniture making'
    },
    {
      id: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: 'Customer Stories & Testimonials',
      description: 'Hear from our satisfied customers'
    },
    {
      id: 'dQw4w9WgXcQ', // Replace with actual video ID
      title: 'Traditional Techniques Meets Modern Design',
      description: 'Blending heritage with contemporary aesthetics'
    }
  ];

  // Instagram inspiration images - Placeholder images that link to your Instagram
  const instagramImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      alt: 'Handcrafted wooden chair'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      alt: 'Artisan crafting furniture'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
      alt: 'Modern dining table'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
      alt: 'Bedroom furniture setup'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
      alt: 'Wooden craftsmanship detail'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
      alt: 'Living room furniture'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      alt: 'Handwoven furniture piece'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=80',
      alt: 'Traditional furniture design'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
      alt: 'Minimalist furniture'
    }
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.dataset.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Attach observer to elements
  const attachObserver = (element) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  };

  const openInstagram = () => {
    window.open('https://www.instagram.com/izhaiyam_handloom_furnitures/', '_blank');
  };

  return (
    <motion.div 
      className="gallery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="container-page">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="#E63946"/>
            </svg>
          </div>
          <h1 className="gallery-hero-title font-display">
            Discover <span className="highlight">Furniture</span>
          </h1>
          <h2 className="gallery-hero-subtitle font-display">Inspiration</h2>
          <p className="gallery-hero-text font-inter">
            Explore the elegance of our handcrafted furniture pieces, designed with care and artistry.
          </p>
        </div>
      </section>

      {/* Instagram Inspiration Section */}
      <section className="instagram-section section-padding">
        <div className="container-page">
          <div className="instagram-grid">
            {instagramImages.map((image, index) => (
              <div
                key={image.id}
                ref={attachObserver}
                data-id={`instagram-${index}`}
                className={`instagram-card ${visibleItems.has(`instagram-${index}`) ? 'visible' : ''}`}
                onClick={() => openLightbox(image)}
              >
                {index < 3 && <span className="pinned-badge">PINNED</span>}
                <img 
                  src={image.url} 
                  alt={image.alt}
                  loading="lazy"
                />
                <div className="instagram-overlay">
                  <svg className="instagram-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="card-info">
                  <div className="card-avatar">
                    <img src="https://via.placeholder.com/40" alt="Profile" />
                  </div>
                  <div className="card-details">
                    <h4>HANDLOOM CRAFT</h4>
                    <p>{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container-page">
          <h3 className="newsletter-title font-display">LET'S STAY CONNECTED</h3>
          <p className="newsletter-subtitle font-inter">Subscribe to our newsletter for exclusive offers and updates</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter Your Email Address" className="newsletter-input font-inter" />
            <button className="newsletter-btn font-inter">SUBSCRIBE</button>
          </div>
        </div>
      </section>

      {/* YouTube Showcase Section */}
      <section className="youtube-section section-padding">
        <div className="container-page">
          <div className="section-header">
            <h2 className="section-title font-display">YouTube Showcase</h2>
            <p className="section-description font-inter">
              Explore our curated collection of handcrafted furniture pieces
            </p>
          </div>

          <div className="youtube-grid">
            {youtubeVideos.map((video, index) => (
              <div
                key={video.id + index}
                ref={attachObserver}
                data-id={`video-${index}`}
                className={`youtube-card ${visibleItems.has(`video-${index}`) ? 'visible' : ''}`}
              >
                <div className="youtube-embed-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                  <div className="play-overlay">
                    <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="youtube-card-content">
                  <div className="youtube-price">₹20.00 - ₹85.00</div>
                  <h3 className="youtube-title font-inter">{video.title}</h3>
                  <button className="youtube-btn font-inter">SHOP NOW</button>
                </div>
              </div>
            ))}
          </div>

          <div className="youtube-cta">
            <button className="btn-view-more font-inter">VIEW MORE</button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            <img src={lightboxImage.url} alt={lightboxImage.alt} />
            <div className="lightbox-actions">
              <button onClick={openInstagram} className="btn-view-instagram font-inter">
                <svg className="instagram-icon-btn" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                View on Instagram
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GalleryPage;
