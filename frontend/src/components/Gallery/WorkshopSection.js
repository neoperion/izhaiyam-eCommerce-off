import React from 'react';

import { motion } from 'framer-motion';

const WorkshopSection = ({ data = [] }) => {

  const manualImages = [
    "https://res.cloudinary.com/deft85hk9/image/upload/v1768929396/IMG_1949_ifqlxs.jpg",
    "https://res.cloudinary.com/deft85hk9/image/upload/v1768929155/IMG_1738_zwpkn1.jpg",
    "https://res.cloudinary.com/deft85hk9/image/upload/v1768929108/IMG_1932_gtg0ee.jpg",
    "https://res.cloudinary.com/deft85hk9/image/upload/v1768929090/IMG_3863_ndsvwo.jpg",
    "https://res.cloudinary.com/deft85hk9/image/upload/v1768929046/IMG_6152_gm4wvb.jpg",
    "https://res.cloudinary.com/deft85hk9/image/upload/v1768928972/IMG_3820_glmfhy.jpg",
    "https://res.cloudinary.com/deft85hk9/image/upload/v1768928921/IMG_1296_fmasfl.jpg",
    "https://res.cloudinary.com/deft85hk9/image/upload/v1768928918/IMG_1614_yviwni.jpg"
  ];

  const displayData = manualImages.map(url => ({
      url: url.replace('/upload/', '/upload/q_auto,f_auto,w_600/'),
      resource_type: 'image',
      format: 'jpg',
      public_id: url
  }));

  return (
    <section className="gallery-section container-page">
      <div className="gallery-section-header">
        <h2 className="gallery-section-title font-inter">Workshop & Manufacturing</h2>
        <p className="gallery-section-subtitle font-inter">
          No factory mass production. Every piece is handcrafted by skilled artisans.
        </p>
      </div>

      <div style={{ columnCount: 3, columnGap: '20px' }} className="workshop-masonry">
        {displayData.map((item, index) => {
          const isVideo = item.resource_type === 'video' || item.format === 'mp4' || item.format === 'webm' || item.format === 'mov';
          
          return (
            <motion.div 
              key={item.public_id || index}
              className="gallery-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{ display: 'inline-block', width: '100%', marginBottom: '20px', breakInside: 'avoid' }}
            >
              {isVideo ? (
                <video 
                  src={item.url} 
                  className="gallery-image" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                />
              ) : (
                <img 
                  src={item.url} 
                  alt="Workshop" 
                  className="gallery-image"
                  loading="lazy" 
                />
              )}
              <div className="gallery-item-overlay">
                <p className="font-inter font-medium">
                  {item.context?.custom?.caption || "Handcrafted with passion"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Mobile override in CSS usually handles column count */}
      <style>{`
        @media (max-width: 1024px) {
          .workshop-masonry { column-count: 2 !important; }
        }
        @media (max-width: 600px) {
          .workshop-masonry { column-count: 1 !important; }
        }
      `}</style>
    </section>
  );
};

export default WorkshopSection;
