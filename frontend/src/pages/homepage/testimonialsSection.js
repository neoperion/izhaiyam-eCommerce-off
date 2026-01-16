import React, { useState, useRef, useEffect } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Siva',
      location: 'Verified Customer',
      rating: 5.0,
      avatar: 'PS',
      link: 'https://share.google/b7PkAQAGrqqA4b6nl',
      quote: 'This sofa and chair set is worldclass❤️. I dint expect this colour, design and comfort turn out this great. This combo added a new class to our living room. Every guest coming to my home feels happy on seeing this traditional touch 😍. Thankyou so much for yua efforts ka. Specially This grey colour adds great look.',
    },
    {
      id: 2,
      name: 'Lakshmi Ramasubramanian',
      location: 'Verified Customer',
      rating: 5.0,
      avatar: 'LR',
      link: 'https://share.google/afaALIdvEejfl7UFq',
      quote: 'Found them on Instagram and ordered 2 cots from them. One of the best furniture purchases I have done so far... Best quality (both wood frame and the cotton rope). Since this is a custom made furniture, you should allow sometime for the makers to do their magic. And they deliver within 5-7 days. Highly recommended',
    },
    {
      id: 3,
      name: 'Mohan Manickam',
      location: 'Verified Customer',
      rating: 5.0,
      avatar: 'MM',
      link: 'https://share.google/wggaNOsp02qBdgD4a',
      quote: 'I was searching this rope furniture in my area for long time and not able to find a rope cot in retteri surroundings. But while watching shorts in YouTube I seen their videos all of a sudden. Called them and ordered the products. They are very keen in understanding my needs and manufactured the same. Bulid quality is good and cost effective. Highly recommended.',
    },
    {
      id: 4,
      name: 'Gracy Vargheese',
      location: 'Verified Customer',
      rating: 5.0,
      avatar: 'GV',
      link: 'https://share.google/AkEnhMw0D5KIr7nif',
      quote: 'Reliable and beautiful craftsmanship. The proprietor was very kind and understanding, they take customisation very seriously to deliver expectations at gold standard. It was a pleasure doing business with them.',
    },
    {
      id: 5,
      name: 'Tushar Xavier Joseph',
      location: 'Verified Customer',
      rating: 5.0,
      avatar: 'TJ',
      link: 'https://share.google/yVhrW3AHmtDnsFNsA',
      quote: 'Very good durable cot. Built strong with good quality for long life. I am sleeping well for 8 hours peacefully. Moment I see this cot in my room, I don’t feel like watching TV or phone not directly sleep on it. Thank you.',
    },
    {
      id: 6,
      name: 'viji s',
      location: 'Verified Customer',
      rating: 5.0,
      avatar: 'VS',
      link: 'https://share.google/4wz86v8Y9HBwnIESz',
      quote: 'I just watched a YouTube post and gave order to them blindly, but the outcome of the product was too good and neat. REALLY TRUSTWORTHY. THANKYOU SO MUCH',
    },
    {
      id: 7,
      name: 'Manoj Prabha',
      location: 'Verified Customer',
      rating: 5.0,
      avatar: 'MP',
      link: 'https://share.google/UfP0NCwOSe1bcOoUg',
      quote: 'THREAD COT RECEIVED, REALLY GOOD QUALITY AND GOOD TO USE. REALLY LOVE IT, THANKS FOR THE GOOD QUALITY',
    },
  ];

  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimestampRef = useRef(null);
  const rafRef = useRef(null);

  const speed = 60; // Slightly slower for better readability
  const SMOOTH_TAU = 0.25;

  const handleScroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 32; // width + gap
    
    if (direction === 'left') {
        // Move backwards (reduce offset)
        offsetRef.current -= cardWidth;
    } else {
        // Move forwards (increase offset)
        offsetRef.current += cardWidth;
    }
  };

  // Touch handling refs
  const isDraggingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const touchStartOffsetRef = useRef(0);

  const handleTouchStart = (e) => {
    setIsHovered(true);
    isDraggingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartOffsetRef.current = offsetRef.current;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    const currentX = e.touches[0].clientX;
    const delta = touchStartXRef.current - currentX; // Drag left = positive delta (moving forward)
    offsetRef.current = touchStartOffsetRef.current + delta;
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setIsHovered(false);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Get the width of one card
    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + 32; // include gap
    const totalWidth = cardWidth * testimonials.length;

    const animate = (timestamp) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      // Only apply physics if NOT dragging
      if (!isDraggingRef.current) {
        const target = isHovered ? 0 : speed;
        const easingFactor = 1 - Math.exp(-deltaTime / SMOOTH_TAU);
        velocityRef.current += (target - velocityRef.current) * easingFactor;
        
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        offsetRef.current = nextOffset;
      }

      if (totalWidth > 0) {
        // Apply wrapping logic for display
        const displayOffset = ((offsetRef.current % totalWidth) + totalWidth) % totalWidth;
        track.style.transform = `translate3d(${-displayOffset}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      lastTimestampRef.current = null;
    };
  }, [isHovered, testimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < Math.floor(rating)
            ? 'fill-[#93a267] text-[#93a267]' // Changed to Brand Green
            : 'fill-gray-300 text-gray-300'
        }
      />
    ));
  };

  // Create duplicates for seamless loop
  const extendedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="w-full bg-[#fdfbf7] py-20 px-4 relative group/section">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#93a267]/10 mb-4">
           <Star size={14} className="fill-[#93a267] text-[#93a267]" />
           <span className="text-[#93a267] font-medium text-xs tracking-wider uppercase font-inter">Verified Reviews</span>
        </div>
        <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#2f3e2f] mb-4">
          What Our Customers Say
        </h2>
        <p className="font-inter text-gray-600 max-w-2xl mx-auto">
          Discover why thousands of homeowners trust Izhaiyam for their premium furniture needs.
        </p>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
        <button 
            onClick={() => handleScroll('left')}
            className="w-12 h-12 bg-white rounded-full shadow-lg border border-[#93a267]/20 flex items-center justify-center text-[#2f3e2f] hover:bg-[#93a267] hover:text-white transition-all active:scale-95"
            aria-label="Previous Testimonial"
        >
            <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-20 hidden md:block opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
        <button 
            onClick={() => handleScroll('right')}
            className="w-12 h-12 bg-white rounded-full shadow-lg border border-[#93a267]/20 flex items-center justify-center text-[#2f3e2f] hover:bg-[#93a267] hover:text-white transition-all active:scale-95"
            aria-label="Next Testimonial"
        >
            <ChevronRight size={24} />
        </button>
      </div>

      {/* Desktop Testimonials (Auto Marquee) - Hidden on Mobile */}
      <div className="hidden md:block w-full overflow-hidden py-4">
        <div
          ref={trackRef}
          className="flex gap-8 will-change-transform cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {extendedTestimonials.map((testimonial, index) => (
            <DesktopTestimonialCard key={`desktop-${testimonial.id}-${index}`} testimonial={testimonial} renderStars={renderStars} />
          ))}
        </div>
      </div>

      {/* Mobile Testimonials (Snap Carousel) - Visible only on Mobile */}
      <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory flex gap-4 px-4 pb-8 no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
        {testimonials.map((testimonial, index) => (
            <div key={`mobile-${testimonial.id}-${index}`} className="snap-center flex-shrink-0 w-[85vw]">
                <DesktopTestimonialCard testimonial={testimonial} renderStars={renderStars} isMobile={true} />
            </div>
        ))}
      </div>

      {/* Info Text */}
      <div className="max-w-7xl mx-auto mt-4 md:mt-12 text-center">
        <div className="inline-flex items-center gap-2 text-xs md:text-sm text-[#93a267]/80 bg-white px-4 py-2 rounded-full shadow-sm border border-[#93a267]/10">
          <span className="w-2 h-2 rounded-full bg-[#93a267] animate-pulse"></span>
          <span className="font-inter font-medium hidden md:inline">Hover to pause • Click name to view review</span>
          <span className="font-inter font-medium md:hidden">Swipe to explore reviews</span>
        </div>
      </div>
    </div>
  );
};

// Extracted Card Component for Reusability
const DesktopTestimonialCard = ({ testimonial, renderStars, isMobile = false }) => (
    <div
      className={`testimonial-card flex-shrink-0 bg-white border border-[#93a267]/20 rounded-xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(147,162,103,0.15)] transition-all duration-300 relative group/card h-full flex flex-col ${isMobile ? 'w-full' : 'w-[350px] md:w-[450px]'}`}
    >
      <a href={testimonial.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0" aria-label={`View review by ${testimonial.name}`}></a>
      
      {/* Rating & Verified Badge */}
      <div className="flex items-center justify-between mb-4 md:mb-6 relative z-10">
        <div className="flex gap-1">{renderStars(testimonial.rating)}</div>
        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-[#93a267] bg-[#93a267]/5 px-2.5 py-1 rounded-full border border-[#93a267]/10">
          <CheckCircle size={12} />
          <span>Verified</span>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="mb-6 md:mb-8 relative z-10 flex-grow">
        <p className="font-inter text-gray-700 leading-relaxed text-sm md:text-base italic relative">
          <span className="text-4xl text-[#93a267]/20 font-serif absolute -top-4 -left-2 z-[-1]">“</span>
          {testimonial.quote}
        </p>
      </blockquote>

      {/* Customer Info */}
      <div className="flex items-center gap-3 md:gap-4 mt-auto pt-5 md:pt-6 border-t border-gray-100 relative z-10">
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg shadow-md flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #93a267 0%, #5d6b38 100%)' }}
        >
          {testimonial.avatar}
        </div>
        <div className="min-w-0">
          <a href={testimonial.link} target="_blank" rel="noopener noreferrer" className="hover:text-[#93a267] transition-colors flex items-center gap-2 group-hover/card:text-[#93a267]">
             <h3 className="font-playfair font-bold text-[#2f3e2f] text-base md:text-lg lg:text-xl group-hover/card:text-[#93a267] transition-colors truncate">{testimonial.name}</h3>
             <ExternalLink size={14} className="opacity-0 group-hover/card:opacity-100 transition-opacity text-[#93a267] flex-shrink-0" />
          </a>
          <p className="font-inter text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wide truncate">
             {testimonial.location}
          </p>
        </div>
      </div>
    </div>
);
