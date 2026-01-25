import React, { useState, useEffect, useRef } from 'react';

const CLIENT_HOMES_IMAGES = [
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

const ClientHomesSection = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Speed configuration
  const SCROLL_SPEED = 0.5; // Pixels per frame

  // Process images
  const baseImages = CLIENT_HOMES_IMAGES.map(url => ({
    url: url.replace(/\.heic$/i, '.jpg'),
    id: url
  }));

  // Triple the array to ensure smooth infinite loop buffer
  const galleryImages = [...baseImages, ...baseImages, ...baseImages];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;
    let exactScroll = scrollContainer.scrollLeft;

    const scrollLoop = () => {
      if (!isPaused && scrollContainer) {
        // Increment scroll position
        exactScroll += SCROLL_SPEED;

        // Maximum scroll width (approx 1/3 of total content for seamless loop point)
        // Actually, we want to reset when we've scrolled past the first set entire width.
        // Since we tripled the array, the "single set width" is roughly 1/3 of scrollWidth.
        const singleSetWidth = scrollContainer.scrollWidth / 3;

        if (exactScroll >= singleSetWidth) {
          exactScroll = 0; // Reset to start (seamless because 2nd set looks same as 1st)
        }

        scrollContainer.scrollLeft = exactScroll;
      } else {
        // If paused (manual interaction), sync exactScroll to current real position
        // so when resumed it continues smoothly.
        exactScroll = scrollContainer.scrollLeft;
      }

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  return (
    <section className="gallery-section container-page overflow-hidden">
      <div className="gallery-section-header">
        <h2 className="gallery-section-title font-inter" style={{ color: '#93a267' }}>Client Homes</h2>
        <p className="gallery-section-subtitle font-inter" style={{ color: '#000000' }}>
          Trusted by families across Tamil Nadu.
        </p>
      </div>

      <div className="relative w-full py-4 group">
        {/* Gradient Masks (optional, can hide during swipe if annoying) */}
        <div className="absolute top-0 left-0 w-8 md:w-32 h-full bg-gradient-to-r from-[#F9F8F6] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-8 md:w-32 h-full bg-gradient-to-l from-[#F9F8F6] to-transparent z-10 pointer-events-none"></div>

        {/* Swipe text hint (optional)
          <div className="absolute top-0 right-4 text-xs text-gray-400 md:hidden z-20 mt-2 italic">Swipe to explore</div>
          */}

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 md:gap-8 px-4 scrollbar-hide"
          style={{
            scrollBehavior: 'auto', // Disable smooth scroll for JS control
            WebkitOverflowScrolling: 'touch',
            cursor: 'grab'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            // Short delay before resuming to allow fling to settle? 
            // Or just resume immediately. Usually immediate is fine or 1s delay.
            setTimeout(() => setIsPaused(false), 1000);
          }}
        >
          {galleryImages.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0 relative overflow-hidden shadow-md select-none"
              style={{ borderRadius: 0 }}
            >
              <img
                src={item.url}
                alt="Client Home"
                className="h-48 md:h-72 w-auto object-cover pointer-events-none" // prevent img drag interfering with swipe
                loading="lazy"
                style={{ borderRadius: 0 }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientHomesSection;
