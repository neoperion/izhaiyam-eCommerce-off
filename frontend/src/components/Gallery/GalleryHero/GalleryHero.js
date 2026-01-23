import React from 'react';
import { motion } from 'framer-motion';
import './GalleryHero.css';

const GalleryHero = ({ data }) => {
  // Use first image/video from data, or fallback
  const heroMedia = data?.[0] || {};
  const isVideo = heroMedia.format === 'mp4' || heroMedia.format === 'webm';

  return (
    <>
      <section className="gallery-hero">
        {isVideo ? (
          <video 
            className="gallery-hero-bg"
            autoPlay 
            muted 
            loop 
            playsInline
            poster={heroMedia.url?.replace(/\.(mp4|webm)$/, '.jpg')}
          >
            <source src={heroMedia.url} type={`video/${heroMedia.format}`} />
          </video>
        ) : (
          <img 
            src={heroMedia.url || 'https://res.cloudinary.com/deft85hk9/image/upload/q_auto,f_auto/v1768928795/IMG_2426_qarkbr.png'} 
            alt="Izhaiyam Gallery" 
            className="gallery-hero-bg" 
          />
        )}
        
        <div className="gallery-hero-overlay"></div>
        <div className="gallery-hero-pattern"></div>
        
        <div className="gallery-hero-content">
          <motion.div
            className="gallery-hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-icon">✦</span>
            <span className="badge-text">Handcrafted Excellence</span>
            <span className="badge-icon">✦</span>
          </motion.div>

          <motion.h1 
            className="gallery-hero-title font-playfair"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="title-line">Crafted Stories</span>
            <span className="title-highlight">from Izhaiyam</span>
          </motion.h1>

          <motion.p 
            className="gallery-hero-subtitle font-inter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From our workshop to your home
          </motion.p>

          <motion.div
            className="gallery-hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="hero-explore-btn">
              <span>Explore Gallery</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </motion.div>
        </div>

        <div className="gallery-hero-scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span className="scroll-text">Scroll to explore</span>
        </div>
      </section>


    </>
  );
};

export default GalleryHero;
