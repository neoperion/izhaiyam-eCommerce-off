import React from 'react';
import { motion } from 'framer-motion';

const InstagramSection = ({ data }) => {
  // Use passed data or empty array
  const items = data || [];

  // Informative log for the developer/user about AdBlockers
  React.useEffect(() => {
    console.info(
      "%c[Instagram Gallery] Note: 'ERR_BLOCKED_BY_CLIENT' errors in the console are normal if you use an AdBlocker. This means your privacy is being protected from Instagram tracking scripts.",
      "color: green; font-weight: bold;"
    );
  }, []);

  // Transform data for display
  const displayData = items.map((item, index) => {
    let imageUrl = item.url;
    
    // Apply Cloudinary optimizations if applicable (legacy support)
    if (imageUrl && imageUrl.includes('cloudinary.com') && imageUrl.includes('/upload/')) {
        imageUrl = imageUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    return {
      id: item._id || `inst-${index}`,
      embedUrl: item.embedUrl || "https://www.instagram.com/p/DEFAULT/embed", // Fallback info
      link: item.link || "https://www.instagram.com/izhaiyam_handloom_furnitures"
    };
  });

  if (displayData.length === 0) {
      return null; // Don't render section if no posts
  }

  // Helper to extract ID from various Instagram URL formats
  const getInstagramId = (url) => {

    try {
      if (!url) return null;
      // Matches /p/, /reel/, /reels/ followed by the ID (alphanumeric, dash, underscore)
      const match = url.match(/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
      return match ? match[1] : null;
    } catch (e) {
      return null;
    }
  };

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
            style={{ color: '#5B8C51' }} 
          >
            @Izhaiyam
          </a>
        </h2>
        <p className="gallery-section-subtitle font-inter">
          Daily inspiration from our community.
        </p>
      </div>

      <div className="instagram-grid">
        {displayData.map((item, index) => {
            const postId = getInstagramId(item.link) || getInstagramId(item.embedUrl);
            
            let iframeSrc = null;
            if (postId) {
                // Ensure we use the robust embed URL
                iframeSrc = `https://www.instagram.com/p/${postId}/embed/captioned/`;
            } else if (item.embedUrl && item.embedUrl.includes('instagram.com') && item.embedUrl.includes('/embed/')) {
                // Only accept existing embedUrls if they look like actual Embed pages, NOT image links
                iframeSrc = item.embedUrl;
            }

            // Strictly ignore invalid or direct-image URLs to prevent 410 errors
            if (!iframeSrc || !iframeSrc.includes('/embed/')) return null; 

            return (
              <motion.div 
                key={item.id}
                className="instagram-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'block', textDecoration: 'none', cursor: 'pointer', height: '100%' }}
                >
                 <div className="instagram-iframe-wrapper">
                   {/* 
                      pointer-events: none ensures that clicking ANYWHERE on this card 
                      (including the iframe) triggers the parent <a> tag redirect. 
                   */}
                   <iframe 
                      src={iframeSrc}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, overflow: 'hidden', display: 'block', pointerEvents: 'none' }} 
                      scrolling="no" 
                      allowtransparency="true"
                      allow="autoplay; encrypted-media"
                      title={`Instagram Post ${index}`}
                    ></iframe>
                 </div>
                </a>
              </motion.div>
            );
        })}
      </div>
      
      <div className="flex justify-center mt-8 w-full" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <a 
          href="https://www.instagram.com/izhaiyam_handloom_furnitures" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2"
          style={{ textDecoration: 'none' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          View Full Profile
        </a>
      </div>
    </section>
  );

};

export default InstagramSection;
