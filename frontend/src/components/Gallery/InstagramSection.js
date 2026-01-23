import React from 'react';
import { motion } from 'framer-motion';

const INSTAGRAM_IMAGES = [
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929389/IMG_6225_bmiboe.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929382/IMG_7633_qrlsyu.jpg",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929180/IMG_0933_a8qk9e.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929161/IMG_1139_pkeegw.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929052/IMG_8445_xl8gtb.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929014/IMG_6223_i7nc9g.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929011/IMG_6996_t9nsfx.jpg",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929004/IMG_4207_ekzpbw.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768928992/IMG_4206_wh3xuh.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768928885/IMG_1644_qg8pri.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768928690/IMG_1003_xvhcn9.heic"
];

const InstagramSection = () => {
  // Transform URLs to ensure browser compatibility (auto format/quality)
  const displayData = INSTAGRAM_IMAGES.map((url, index) => ({
    id: `inst-${index}`,
    url: url.replace('/upload/', '/upload/f_auto,q_auto/'),
    link: "https://www.instagram.com/hzhaiyam/" // Defaulting to the profile mention in title
  }));

  return (
    <section className="gallery-section container-page">
      <div className="gallery-section-header">
        <h2 className="gallery-section-title font-inter">Follow Us @Hzhaiyam</h2>
        <p className="gallery-section-subtitle font-inter">
          Daily inspiration from our community.
        </p>
      </div>

      <div className="instagram-grid">
        {displayData.map((item, index) => (
          <motion.div 
            key={item.id}
            className="instagram-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <img src={item.url} alt="Instagram Post" loading="lazy" />
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="instagram-overlay"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default InstagramSection;
