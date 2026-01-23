import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './GalleryHero.css';

const GalleryHero = ({ data }) => {
  const heroMedia = data?.[0] || {};
  const isVideo = heroMedia.format === 'mp4' || heroMedia.format === 'webm';
  const mediaUrl = heroMedia.url || 'https://res.cloudinary.com/deft85hk9/image/upload/q_auto,f_auto/v1768928795/IMG_2426_qarkbr.png';

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="gallery-hero-container">
      <div className="gallery-hero-split">
        {/* Left Content Side */}
        <div className="gallery-hero-left">
          <div className="gallery-hero-content-wrapper">
            <motion.div 
              className="hero-eyebrow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="eyebrow-line"></span>
              <span className="eyebrow-text">Est. 2019</span>
            </motion.div>
            
            <h1 className="hero-big-title">
              <span className="block-reveal">
                <motion.span 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  Timeless
                </motion.span>
              </span>
              <span className="block-reveal highlight-font">
                <motion.span 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  Craftsmanship
                </motion.span>
              </span>
            </h1>

            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Immerse yourself in the artistry of Izhaiyam. Where handloom tradition meets modern living spaces.
            </motion.p>

            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <button className="btn-modern-primary">
                Explore Collection
              </button>
              <button className="btn-modern-text">
                Watch our collection <span className="play-icon">▶</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Right Visual Side */}
        <div className="gallery-hero-right">
          {/* Decorative Elements */}
          <div className="hero-decor-circle"></div>
          
          <div className="hero-visual-composition">
            {/* Main Image Mask */}
            <motion.div 
              className="main-image-mask"
              style={{ y: y1 }}
              initial={{ scale: 0.9, opacity: 0, borderRadius: '100px' }}
              animate={{ scale: 1, opacity: 1, borderRadius: '300px 300px 0 0' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {isVideo ? (
                <video 
                  className="hero-media-object"
                  autoPlay muted loop playsInline
                  poster={mediaUrl?.replace(/\.(mp4|webm)$/, '.jpg')}
                >
                  <source src={mediaUrl} type={`video/${heroMedia.format}`} />
                </video>
              ) : (
                <img src={mediaUrl} alt="Gallery Highlight" className="hero-media-object" />
              )}
              
              <div className="image-overlay-gradient"></div>
            </motion.div>

            {/* Floating Secondary Image (Visual Echo) */}
            <motion.div 
              className="secondary-image-card"
              style={{ y: y2 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
            >
              <div className="glass-card-content">
                <span className="stat-number">100%</span>
                <span className="stat-label">Handcrafted</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="hero-scroll-line"
        initial={{ height: 0 }}
        animate={{ height: 100 }}
        transition={{ delay: 1.5, duration: 1 }}
      ></motion.div>
    </section>
  );
};

export default GalleryHero;
