import React from 'react';
import { motion } from 'framer-motion';

const ShopImagesSection = ({ data = [] }) => {

  return (
    <section className="gallery-section container-page shop-collection-section">
      <div className="gallery-section-header shop-collection-header">
        <h2 className="gallery-section-title font-inter">Our Collection</h2>
        <p className="gallery-section-subtitle font-inter">
          Explore our handcrafted furniture pieces from the workshop.
        </p>
      </div>

      <div className="shop-images-grid">
        {data.map((item, index) => (
          <motion.div 
            key={item.public_id || index}
            className="shop-image-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
          >
            <img 
              src={item.url.replace('/upload/', '/upload/q_auto,f_auto,w_600/')} 
              alt="Shop Product" 
              className="shop-image"
              loading="lazy" 
            />
            <div className="shop-image-overlay">
              <p className="font-inter font-semibold text-lg">View Details</p>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .shop-collection-section {
          position: relative;
          padding: 80px 0;
        }

        .shop-collection-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 400px;
          background-image: url('/assets/our-collection-bg.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
          opacity: 0.15;
        }

        .shop-collection-section::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 400px;
          background: linear-gradient(to bottom, rgba(250, 249, 246, 0.3) 0%, rgba(250, 249, 246, 0.95) 80%, rgba(250, 249, 246, 1) 100%);
          z-index: 1;
        }

        .shop-collection-header {
          position: relative;
          z-index: 2;
          padding: 60px 40px;
          text-align: center;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          margin-bottom: 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .shop-collection-header .gallery-section-title {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #93a267 0%, #6b7a47 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .shop-collection-header .gallery-section-subtitle {
          font-size: 1.25rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .shop-images-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 32px;
          margin-top: 2rem;
        }

        .shop-image-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          border: 2px solid transparent;
        }

        .shop-image-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(147, 162, 103, 0.1) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 1;
        }

        .shop-image-card:hover::before {
          opacity: 1;
        }

        .shop-image-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.18);
          border-color: rgba(147, 162, 103, 0.3);
        }

        .shop-image {
          width: 100%;
          height: 320px;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }

        .shop-image-card:hover .shop-image {
          transform: scale(1.08);
        }

        .shop-image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 24px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
          color: white;
          opacity: 0;
          transition: opacity 0.4s ease;
          text-align: center;
          z-index: 2;
        }

        .shop-image-card:hover .shop-image-overlay {
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .shop-collection-header .gallery-section-title {
            font-size: 2.5rem;
          }

          .shop-images-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .shop-collection-section::before,
          .shop-collection-section::after {
            height: 300px;
          }

          .shop-collection-header {
            padding: 40px 24px;
          }

          .shop-collection-header .gallery-section-title {
            font-size: 2rem;
          }

          .shop-collection-header .gallery-section-subtitle {
            font-size: 1.1rem;
          }

          .shop-images-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          
          .shop-image {
            height: 240px;
          }
        }

        @media (max-width: 480px) {
          .shop-collection-section::before,
          .shop-collection-section::after {
            height: 250px;
          }

          .shop-collection-header {
            padding: 30px 20px;
          }

          .shop-collection-header .gallery-section-title {
            font-size: 1.75rem;
          }

          .shop-images-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .shop-image {
            height: 280px;
          }
        }
      `}</style>
    </section>
  );
};

export default ShopImagesSection;
