import React from 'react';
import { motion } from 'framer-motion';
import InstagramCard from './InstagramCard';

const InstagramSection = ({ data }) => {
  // Use passed data or empty array
  const items = data || [];

  console.log("Instagram Data:", items);

  // Helper to extract ID
  const getInstagramId = (url) => {
      try {
          if (!url) return null;
          const match = url.match(/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
          return match ? match[1] : null;
      } catch (e) {
          return null;
      }
  };

  // Transform data for display
  const displayData = items.map((item, index) => {
    let imageUrl = item.url;
    
    // Apply Cloudinary optimizations if applicable
    if (imageUrl && imageUrl.includes('cloudinary.com') && imageUrl.includes('/upload/')) {
        imageUrl = imageUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    // Fallback if no image URL is found
    if (!imageUrl) {
        imageUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    }
    
    // Determine Embed URL
    const postId = getInstagramId(item.link) || getInstagramId(item.embedUrl);
    let finalEmbedUrl = item.embedUrl;
    
    if (postId) {
        finalEmbedUrl = `https://www.instagram.com/p/${postId}/embed/captioned/`;
    }

    return {
      id: item._id || `inst-${index}`,
      image: imageUrl,
      link: item.link || "https://www.instagram.com/izhaiyam_handloom_furnitures",
      embedUrl: finalEmbedUrl,
      caption: item.caption || "Transform your living space with our handcrafted furniture collection. ✨ #Izhaiyam #Handloom #InteriorDesign",
      video: item.type === 'video', 
      likes: item.likes || 0,
      comments: item.comments || 0
    };
  });

  if (displayData.length === 0) {
      return null; 
  }

  return (
    <section className="gallery-section container-page">
      <div className="gallery-section-header">
        <h2 className="gallery-section-title font-inter">
          Follow Us 
          <a 
            href="https://www.instagram.com/izhaiyam_handloom_furnitures/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primaryColor hover:underline ml-2"
            style={{ color: '#93a267' }} 
          >
            @Izhaiyam
          </a>
        </h2>
        <p className="gallery-section-subtitle font-inter">
          Daily inspiration from our community.
        </p>
      </div>

      <div className="instagram-grid">
        {displayData.map((item, index) => (
            <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            >
                <InstagramCard item={item} />
            </motion.div>
        ))}
      </div>
      
      <div className="flex justify-center mt-8 w-full" style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <a 
          href="https://www.instagram.com/izhaiyam_handloom_furnitures" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-zinc-800 transition-colors shadow-lg flex items-center gap-2 text-sm"
          style={{ textDecoration: 'none', backgroundColor: '#262626' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          View Full Profile
        </a>
      </div>
    </section>
  );
};

export default InstagramSection;

