import React, { useState, useEffect, useRef } from 'react';
import './GalleryPage.css';
import { motion } from 'framer-motion';
import axios from 'axios';

const GalleryPage = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  // YouTube videos configuration (Preserved)
  const youtubeVideos = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Handcrafted Furniture Making Process',
      description: 'Watch our artisans craft beautiful furniture pieces'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Behind the Scenes: Workshop Tour',
      description: 'Explore our traditional woodworking workshop'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Design Inspiration & Craftsmanship',
      description: 'The art and soul behind every piece we create'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Sustainable Materials & Practices',
      description: 'Our commitment to eco-friendly furniture making'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Customer Stories & Testimonials',
      description: 'Hear from our satisfied customers'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Traditional Techniques Meets Modern Design',
      description: 'Blending heritage with contemporary aesthetics'
    }
  ];

  useEffect(() => {
    // NO EXTERNAL SCRIPTS LOADED

    const fetchInstagramPosts = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
        const response = await axios.get(`${serverUrl}/api/v1/instagram/public`);
        if (response.data && response.data.posts) {
          setInstagramPosts(response.data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch Instagram posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  // Intersection Observer
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



  return (
    <motion.div
      className="gallery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="gallery-hero">
        <div className="container-page">
          <div className="hero-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="#E63946" />
            </svg>
          </div>
          <h1 className="gallery-hero-title font-inter">
            Discover <span className="highlight">Furniture</span>
          </h1>
          <h2 className="gallery-hero-subtitle font-inter">Inspiration</h2>
          <p className="gallery-hero-text font-inter">
            Explore the elegance of our handcrafted furniture pieces.
          </p>
        </div>
      </section>

      <section className="instagram-section section-padding">
        <div className="container-page">
          {loading ? (
            <div className="loading-state" style={{ textAlign: 'center', padding: '50px' }}>Loading Gallery...</div>
          ) : instagramPosts.length > 0 ? (
            <div className="instagram-grid">
              {instagramPosts.map((post, index) => (
                <div
                  key={post._id || index}
                  ref={attachObserver}
                  data-id={`instagram-${index}`}
                  className={`instagram-card ${visibleItems.has(`instagram-${index}`) ? 'visible' : ''}`}
                  style={{
                    background: '#000',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Video Wrapper 9:16 Aspect Ratio */}
                  <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '177.77%' }}>
                    <iframe
                      src={`${post.embedUrl}/captioned/?autoplay=0&muted=1&playsinline=1`}
                      title={`Instagram post ${index}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        background: '#000'
                      }}
                      scrolling="no"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      loading="lazy"
                    ></iframe>
                  </div>

                  <div style={{ padding: '15px', background: '#fff' }}>
                    <a
                      href={post.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '14px', color: '#0095f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      View on Instagram <span>↗</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: 'center', padding: '50px' }}>
              <h3 className="font-inter" style={{ fontSize: '24px', marginBottom: '10px' }}>Gallery updating soon.</h3>
              <p className="font-inter" style={{ color: '#666' }}>Follow us on Instagram.</p>
            </div>
          )}
        </div>
      </section>



      <section className="youtube-section section-padding">
        <div className="container-page">
          <div className="section-header">
            <h2 className="section-title font-inter">YouTube Showcase</h2>
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
                </div>
                <div className="youtube-card-content">
                  <h3 className="youtube-title font-inter">{video.title}</h3>
                  <button className="youtube-btn font-inter">SHOP NOW</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default GalleryPage;
