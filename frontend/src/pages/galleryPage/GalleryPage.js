import React, { useState, useEffect, useRef } from 'react';
import './GalleryPage.css';
import { motion } from 'framer-motion';
import FooterSection from '../../components/footerSection';
import heroImage from '../../assets/image.png';

const GalleryPage = () => {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef(null);

  // Instagram posts with categories
  const instagramPosts = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      alt: 'Handcrafted wooden chair with intricate carvings',
      category: 'chairs',
      likes: 245,
      comments: 32,
      date: '2 days ago',
      description: 'Traditional hand-carved rosewood chair showcasing our artisan\'s expertise in woodworking.'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
      alt: 'Artisan crafting furniture with traditional tools',
      category: 'workshop',
      likes: 189,
      comments: 28,
      date: '3 days ago',
      description: 'Master craftsman using age-old techniques to create timeless furniture pieces.'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
      alt: 'Modern dining table with organic finish',
      category: 'tables',
      likes: 312,
      comments: 45,
      date: '1 week ago',
      description: 'Contemporary dining table featuring sustainable teak wood with natural oil finish.'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
      alt: 'Complete bedroom furniture setup',
      category: 'bedroom',
      likes: 278,
      comments: 38,
      date: '4 days ago',
      description: 'Custom bedroom suite including bed, nightstands, and wardrobe in matching design.'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
      alt: 'Wooden craftsmanship detail closeup',
      category: 'details',
      likes: 156,
      comments: 19,
      date: '5 days ago',
      description: 'Close-up view of dovetail joints showcasing our commitment to quality joinery.'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
      alt: 'Modern living room furniture arrangement',
      category: 'living',
      likes: 421,
      comments: 56,
      date: '2 weeks ago',
      description: 'Complete living room set featuring modular sofas and coffee tables.'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      alt: 'Handwoven rattan furniture piece',
      category: 'handmade',
      likes: 198,
      comments: 24,
      date: '6 days ago',
      description: 'Handwoven rattan chair using traditional weaving techniques passed through generations.'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=80',
      alt: 'Traditional Kerala style furniture',
      category: 'traditional',
      likes: 267,
      comments: 41,
      date: '1 week ago',
      description: 'Authentic Kerala-style wooden chest with brass fittings and traditional motifs.'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80',
      alt: 'Minimalist Scandinavian furniture design',
      category: 'modern',
      likes: 334,
      comments: 49,
      date: '3 days ago',
      description: 'Scandinavian-inspired minimalist desk with clean lines and functional design.'
    },
    {
      id: 10,
      url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
      alt: 'Outdoor garden furniture set',
      category: 'outdoor',
      likes: 189,
      comments: 22,
      date: '4 days ago',
      description: 'Weather-resistant teak wood garden furniture designed for durability and comfort.'
    },
    {
      id: 11,
      url: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&q=80',
      alt: 'Wood polishing and finishing process',
      category: 'workshop',
      likes: 145,
      comments: 18,
      date: '5 days ago',
      description: 'Natural oil polishing process that enhances wood grain and provides lasting protection.'
    },
    {
      id: 12,
      url: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80',
      alt: 'Custom bookshelf design',
      category: 'storage',
      likes: 231,
      comments: 33,
      date: '2 weeks ago',
      description: 'Custom-built bookshelf with adjustable shelves and integrated lighting.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: instagramPosts.length },
    { id: 'chairs', name: 'Chairs', count: instagramPosts.filter(p => p.category === 'chairs').length },
    { id: 'tables', name: 'Tables', count: instagramPosts.filter(p => p.category === 'tables').length },
    { id: 'bedroom', name: 'Bedroom', count: instagramPosts.filter(p => p.category === 'bedroom').length },
    { id: 'living', name: 'Living Room', count: instagramPosts.filter(p => p.category === 'living').length },
    { id: 'traditional', name: 'Traditional', count: instagramPosts.filter(p => p.category === 'traditional').length },
    { id: 'modern', name: 'Modern', count: instagramPosts.filter(p => p.category === 'modern').length }
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? instagramPosts 
    : instagramPosts.filter(post => post.category === selectedCategory);

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

  const attachObserver = (element) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  const openLightbox = (post) => {
    setLightboxImage(post);
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
      <section className="gallery-hero" style={{ position: 'relative', padding: 0 }}>
        <div style={{
           position: 'absolute',
           top: 0,
           left: 0,
           width: '100%',
           height: '100%',
           backgroundImage: `url(${heroImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           zIndex: 0
        }} />
        <div style={{
           position: 'absolute',
           top: 0,
           left: 0,
           width: '100%',
           height: '100%',
           background: 'rgba(0, 0, 0, 0.5)',
           zIndex: 1
        }} />
        <div className="container-page" style={{ position: 'relative', zIndex: 2, color: 'white', padding: '3rem 0 4rem' }}>
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="instagramGradientHero" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <path d="M12 2.163C15.204 2.163 15.584 2.175 16.85 2.233C18.102 2.291 18.782 2.502 19.234 2.678C19.832 2.909 20.257 3.208 20.704 3.655C21.151 4.102 21.45 4.527 21.681 5.125C21.857 5.577 22.068 6.257 22.127 7.509C22.184 8.775 22.196 9.155 22.196 12.359C22.196 15.563 22.185 15.943 22.127 17.209C22.069 18.461 21.858 19.141 21.682 19.593C21.451 20.191 21.152 20.616 20.705 21.063C20.258 21.51 19.833 21.809 19.235 22.04C18.783 22.216 18.103 22.427 16.851 22.485C15.585 22.542 15.205 22.554 12.001 22.554C8.797 22.554 8.417 22.543 7.151 22.485C5.899 22.427 5.219 22.216 4.767 22.04C4.169 21.809 3.744 21.51 3.296 21.063C2.849 20.616 2.55 20.191 2.319 19.593C2.143 19.141 1.932 18.461 1.874 17.209C1.817 15.943 1.805 15.563 1.805 12.359C1.805 9.155 1.817 8.775 1.874 7.509C1.932 6.257 2.143 5.577 2.319 5.125C2.55 4.527 2.849 4.102 3.296 3.655C3.743 3.208 4.168 2.909 4.766 2.678C5.218 2.502 5.898 2.291 7.15 2.233C8.416 2.175 8.796 2.163 12 2.163ZM12 0C8.741 0 8.333 0.014 7.053 0.072C5.775 0.131 4.903 0.334 4.14 0.631C3.351 0.938 2.682 1.353 2.016 2.019C1.35 2.685 0.935 3.354 0.628 4.143C0.331 4.906 0.128 5.778 0.069 7.056C0.011 8.336 0 8.744 0 12.003C0 15.262 0.011 15.67 0.069 16.95C0.128 18.228 0.331 19.101 0.628 19.863C0.935 20.652 1.35 21.321 2.016 21.987C2.682 22.653 3.351 23.068 4.14 23.375C4.903 23.672 5.775 23.875 7.053 23.934C8.333 23.992 8.741 24.006 12 24.006C15.259 24.006 15.667 23.992 16.947 23.934C18.225 23.875 19.097 23.672 19.86 23.375C20.649 23.068 21.318 22.653 21.984 21.987C22.65 21.321 23.065 20.652 23.372 19.863C23.669 19.101 23.872 18.228 23.931 16.95C23.989 15.67 24 15.262 24 12.003C24 8.744 23.989 8.336 23.931 7.056C23.872 5.778 23.669 4.906 23.372 4.143C23.065 3.354 22.65 2.685 21.984 2.019C21.318 1.353 20.649 0.938 19.86 0.631C19.097 0.334 18.225 0.131 16.947 0.072C15.667 0.014 15.259 0 12 0Z" fill="url(#instagramGradientHero)"/>
              <path d="M12 5.838C8.597 5.838 5.838 8.598 5.838 12C5.838 15.402 8.597 18.162 12 18.162C15.403 18.162 18.162 15.402 18.162 12C18.162 8.598 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16Z" fill="url(#instagramGradientHero)"/>
              <path d="M18.406 4.155C17.61 4.155 16.965 4.8 16.965 5.596C16.965 6.392 17.61 7.037 18.406 7.037C19.202 7.037 19.847 6.392 19.847 5.596C19.847 4.8 19.202 4.155 18.406 4.155Z" fill="url(#instagramGradientHero)"/>
            </svg>
          </div>
          <h1 className="gallery-hero-title font-display" style={{color: 'white'}}>
            Our <span className="highlight">Instagram</span>
          </h1>
          <h2 className="gallery-hero-subtitle font-display" style={{color: 'rgba(255,255,255,0.9)'}}>Gallery</h2>
          <p className="gallery-hero-text font-inter" style={{color: 'rgba(255,255,255,0.8)'}}>
            Follow our journey of crafting timeless furniture pieces. Each post tells a story of tradition, craftsmanship, and passion.
          </p>
          <div className="instagram-handle">
            <svg className="instagram-handle-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
            </svg>
            <span className="instagram-handle-text">@izhaiyam_handloom_furnitures</span>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-filter">
        <div className="container-page">
          <div className="filter-container">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="filter-name">{category.name}</span>
                <span className="filter-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="instagram-gallery section-padding">
        <div className="container-page">
          <div className="instagram-grid">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                ref={attachObserver}
                data-id={`instagram-${index}`}
                className={`instagram-card ${visibleItems.has(`instagram-${index}`) ? 'visible' : ''}`}
                onClick={() => openLightbox(post)}
              >
                <div className="post-image">
                  <img 
                    src={post.url} 
                    alt={post.alt}
                    loading="lazy"
                  />
                  <div className="post-overlay">
                    <div className="post-stats">
                      <div className="stat">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                        <span>{post.likes}</span>
                      </div>
                      <div className="stat">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                        </svg>
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="post-content">
                  <div className="post-header">
                    <div className="post-avatar">
                      <img src="https://images.unsplash.com/photo-1604275673993-6ba9f82fb0d9?w=100&q=80" alt="Izhaiyam Handloom" />
                    </div>
                    <div className="post-info">
                      <h4 className="post-username">izhaiyam_handloom</h4>
                      <span className="post-date">{post.date}</span>
                    </div>
                    <div className="post-category">
                      <span className={`category-badge ${post.category}`}>
                        {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="post-caption">
                    <p className="post-description">{post.description}</p>
                  </div>
                  
                  <div className="post-footer">
                    <div className="post-location">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                      </svg>
                      <span>Kerala, India</span>
                    </div>
                    <div className="post-actions">
                      <button className="action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                      </button>
                      <button className="action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                        </svg>
                      </button>
                      <button className="action-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"/>
                          <path d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="instagram-cta">
        <div className="container-page">
          <div className="cta-content">
            <div className="cta-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="instagramGradientCTA" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <path d="M12 2.163C15.204 2.163 15.584 2.175 16.85 2.233C18.102 2.291 18.782 2.502 19.234 2.678C19.832 2.909 20.257 3.208 20.704 3.655C21.151 4.102 21.45 4.527 21.681 5.125C21.857 5.577 22.068 6.257 22.127 7.509C22.184 8.775 22.196 9.155 22.196 12.359C22.196 15.563 22.185 15.943 22.127 17.209C22.069 18.461 21.858 19.141 21.682 19.593C21.451 20.191 21.152 20.616 20.705 21.063C20.258 21.51 19.833 21.809 19.235 22.04C18.783 22.216 18.103 22.427 16.851 22.485C15.585 22.542 15.205 22.554 12.001 22.554C8.797 22.554 8.417 22.543 7.151 22.485C5.899 22.427 5.219 22.216 4.767 22.04C4.169 21.809 3.744 21.51 3.296 21.063C2.849 20.616 2.55 20.191 2.319 19.593C2.143 19.141 1.932 18.461 1.874 17.209C1.817 15.943 1.805 15.563 1.805 12.359C1.805 9.155 1.817 8.775 1.874 7.509C1.932 6.257 2.143 5.577 2.319 5.125C2.55 4.527 2.849 4.102 3.296 3.655C3.743 3.208 4.168 2.909 4.766 2.678C5.218 2.502 5.898 2.291 7.15 2.233C8.416 2.175 8.796 2.163 12 2.163ZM12 0C8.741 0 8.333 0.014 7.053 0.072C5.775 0.131 4.903 0.334 4.14 0.631C3.351 0.938 2.682 1.353 2.016 2.019C1.35 2.685 0.935 3.354 0.628 4.143C0.331 4.906 0.128 5.778 0.069 7.056C0.011 8.336 0 8.744 0 12.003C0 15.262 0.011 15.67 0.069 16.95C0.128 18.228 0.331 19.101 0.628 19.863C0.935 20.652 1.35 21.321 2.016 21.987C2.682 22.653 3.351 23.068 4.14 23.375C4.903 23.672 5.775 23.875 7.053 23.934C8.333 23.992 8.741 24.006 12 24.006C15.259 24.006 15.667 23.992 16.947 23.934C18.225 23.875 19.097 23.672 19.86 23.375C20.649 23.068 21.318 22.653 21.984 21.987C22.65 21.321 23.065 20.652 23.372 19.863C23.669 19.101 23.872 18.228 23.931 16.95C23.989 15.67 24 15.262 24 12.003C24 8.744 23.989 8.336 23.931 7.056C23.872 5.778 23.669 4.906 23.372 4.143C23.065 3.354 22.65 2.685 21.984 2.019C21.318 1.353 20.649 0.938 19.86 0.631C19.097 0.334 18.225 0.131 16.947 0.072C15.667 0.014 15.259 0 12 0Z" fill="url(#instagramGradientCTA)"/>
                <path d="M12 5.838C8.597 5.838 5.838 8.598 5.838 12C5.838 15.402 8.597 18.162 12 18.162C15.403 18.162 18.162 15.402 18.162 12C18.162 8.598 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16Z" fill="url(#instagramGradientCTA)"/>
                <path d="M18.406 4.155C17.61 4.155 16.965 4.8 16.965 5.596C16.965 6.392 17.61 7.037 18.406 7.037C19.202 7.037 19.847 6.392 19.847 5.596C19.847 4.8 19.202 4.155 18.406 4.155Z" fill="url(#instagramGradientCTA)"/>
              </svg>
            </div>
            <h3 className="cta-title">Follow Our Journey</h3>
            <p className="cta-description">
              See more behind-the-scenes, new arrivals, and customer stories on Instagram.
            </p>
            <button className="btn-instagram" onClick={openInstagram}>
              <svg className="instagram-icon-btn" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
              </svg>
              Follow @izhaiyam_handloom
            </button>
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
            
            <div className="lightbox-image-container">
              <img src={lightboxImage.url} alt={lightboxImage.alt} />
            </div>
            
            <div className="lightbox-details">
              <div className="lightbox-header">
                <div className="lightbox-avatar">
                  <img src="https://images.unsplash.com/photo-1604275673993-6ba9f82fb0d9?w=100&q=80" alt="Izhaiyam Handloom" />
                </div>
                <div className="lightbox-user-info">
                  <h3>izhaiyam_handloom</h3>
                  <span className="lightbox-location">Kerala, India</span>
                </div>
              </div>
              
              <div className="lightbox-description">
                <p>{lightboxImage.description}</p>
                <div className="lightbox-stats">
                  <span className="lightbox-stat">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                    </svg>
                    {lightboxImage.likes} likes
                  </span>
                  <span className="lightbox-stat">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                    </svg>
                    {lightboxImage.comments} comments
                  </span>
                </div>
              </div>
              
              <div className="lightbox-actions">
                <button className="btn-instagram-lightbox" onClick={openInstagram}>
                  <svg className="instagram-icon-btn" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073z"/>
                  </svg>
                  View on Instagram
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <FooterSection />
    </motion.div>
  );
};

export default GalleryPage;