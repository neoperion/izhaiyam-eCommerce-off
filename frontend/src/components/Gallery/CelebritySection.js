import React, { useState, useEffect, useRef } from 'react';

const CELEBRITY_IMAGES = [
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768928849/IMG_1235_upruwd.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929374/IMG_0867_ifeurh.jpg",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929234/IMG_1024_iws3p0.jpg",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929389/IMG_6225_bmiboe.heic",
  "https://res.cloudinary.com/deft85hk9/image/upload/v1768929161/IMG_1139_pkeegw.heic"
];

const CelebritySection = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Speed configuration (pixels per frame)
  const SCROLL_SPEED = 0.5;

  // Process images
  const baseImages = CELEBRITY_IMAGES.map(url => ({
    url: url.replace(/\.heic$/i, '.jpg'), // Ensure browser compatibility
    id: url
  }));

  // Create a larger buffer for smooth looping since we have fewer celebrity images
  // Duplicating 6 times to ensure enough width for scrolling
  const galleryImages = [
    ...baseImages, ...baseImages, ...baseImages,
    ...baseImages, ...baseImages, ...baseImages
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    let exactScroll = scrollContainer.scrollLeft;

    const scrollLoop = () => {
      if (!isPaused && scrollContainer) {
        exactScroll += SCROLL_SPEED;

        // Logic for loop point:
        // We have 6 sets. Seamless point is after 1 set full width?
        // Actually simpler to just reset when we reach halfway or similar.
        // Let's use simpler logic: Reset when scrollLeft >= scrollWidth / 2
        const resetThreshold = scrollContainer.scrollWidth / 2;

        if (exactScroll >= resetThreshold) {
          // Reset to a point where visuals align. 
          // Since we have Identical sets, we can subtract the width of (Total Sets / 2).
          // If we have 6 sets, reset by width of 3 sets.
          exactScroll = exactScroll - resetThreshold;
        }

        scrollContainer.scrollLeft = exactScroll;
      } else {
        exactScroll = scrollContainer.scrollLeft;
      }

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <section className="gallery-section" style={{ backgroundColor: '#f9f9f9' }}>
      <div className="container-page">
        <div className="gallery-section-header">
          <h2 className="gallery-section-title font-inter" style={{ color: '#93a267' }}>Featured With Celebrities</h2>
          <p className="gallery-section-subtitle font-inter" style={{ color: '#000000' }}>
            Izhaiyam products spotted with your favorite stars.
          </p>
        </div>

        <div className="relative w-full py-4 group">
          {/* Gradient Masks */}
          <div className="absolute top-0 left-0 w-8 md:w-32 h-full bg-gradient-to-r from-[#f9f9f9] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-8 md:w-32 h-full bg-gradient-to-l from-[#f9f9f9] to-transparent z-10 pointer-events-none"></div>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 md:gap-8 px-4 scrollbar-hide"
            style={{
              scrollBehavior: 'auto',
              WebkitOverflowScrolling: 'touch',
              cursor: 'grab'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 1000)}
          >
            {galleryImages.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex-shrink-0 relative overflow-hidden shadow-md select-none" style={{ borderRadius: 0 }}>
                <div className="h-[300px] md:h-[400px] aspect-[4/5] relative">
                  <img
                    src={item.url}
                    alt="Celebrity"
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                    style={{ borderRadius: 0 }}
                  />
                  <div className="featured-badge font-inter">Featured</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CelebritySection;
