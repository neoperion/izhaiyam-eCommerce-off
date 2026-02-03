import React from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

export const MarqueeContent = ({ isMobile, mediaItems }) => {
  const baseX = useMotionValue(0);
  
  // Create 4 sets of items for seamless loop (enough to cover 200% width easily)
  const items = [...mediaItems, ...mediaItems, ...mediaItems, ...mediaItems];

  // Speed configuration - Optimized for "perfect slow speed"
  // previous calculation resulted in ~2.5s loop (too fast). Now targeting ~15s-20s.
  const baseVelocity = isMobile ? 1.5 : 0.8; 

  useAnimationFrame((t, delta) => {
    // Move left continuously
    let moveBy = baseVelocity * (delta / 1000) * 5; 
    baseX.set(baseX.get() - moveBy);
  });

  // Infinite Wrap Logic: Maps the motion value to a 0% -> -50% cycle
  // This assumes the list is 4x the original, so 50% covers 2x, providing a perfect loop.
  const x = useTransform(baseX, (v) => `${((v % 50) - 50) % 50}%`);

  const handlePan = (_, info) => {
    // Add drag momentum to the base scroll position using a slightly higher multiplier for better feel
    baseX.set(baseX.get() + info.delta.x * 0.05); 
  };

  return (
    <motion.div
        className="flex items-center px-4 md:px-8 w-max"
        style={{ x, cursor: 'grab' }}
        onPan={handlePan}
        whileTap={{ cursor: 'grabbing' }}
    >
      {items.map((media, index) => (
        <div
            key={index}
            className="flex-shrink-0 group flex flex-col items-center justify-center transition-opacity duration-300 mr-8 md:mr-16"
        >
            <img
            src={media.img}
            alt={media.name}
            // Prevent default image dragging behavior to allow container drag
            className="h-16 md:h-28 w-auto max-w-[150px] object-contain transition-all duration-300 pointer-events-none select-none" 
            />
        </div>
      ))}
    </motion.div>
  );
};
