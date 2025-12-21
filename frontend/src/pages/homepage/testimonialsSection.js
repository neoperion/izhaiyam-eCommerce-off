import React, { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5.0,
      avatar: 'PS',
      quote: 'The handcrafted quality of IZHAIYAM furniture is exceptional. Each piece tells a story and adds warmth to our home. The attention to detail in the weaving is simply stunning.',
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Delhi',
      rating: 4.9,
      avatar: 'RK',
      quote: 'I was amazed by the durability and comfort of my handloom sofa. It\'s been over a year and it still looks as good as new. Traditional craftsmanship at its finest!',
    },
    {
      id: 3,
      name: 'Anita Patel',
      location: 'Bangalore',
      rating: 5.0,
      avatar: 'AP',
      quote: 'IZHAIYAM truly celebrates our heritage. The furniture pieces are not just functional but works of art. Every guest admires the unique handwoven patterns.',
    },
    {
      id: 4,
      name: 'Vikram Singh',
      location: 'Jaipur',
      rating: 4.8,
      avatar: 'VS',
      quote: 'The craftsmanship and quality are unmatched. My living room has completely transformed with these beautiful pieces. Highly recommend IZHAIYAM!',
    },
    {
      id: 5,
      name: 'Neha Gupta',
      location: 'Pune',
      rating: 5.0,
      avatar: 'NG',
      quote: 'Exceptional quality and stunning designs. The customer service was amazing throughout the process. Worth every penny!',
    },
  ];

  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimestampRef = useRef(null);
  const rafRef = useRef(null);

  const speed = 80; // pixels per second
  const SMOOTH_TAU = 0.25;

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

      const target = isHovered ? 0 : speed;

      const easingFactor = 1 - Math.exp(-deltaTime / SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (totalWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % totalWidth) + totalWidth) % totalWidth;
        offsetRef.current = nextOffset;

        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
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
            ? 'fill-yellow-400 text-yellow-400'
            : index < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-300 text-gray-300'
        }
      />
    ));
  };

  // Create duplicates for seamless loop
  const extendedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="w-full bg-white py-16 px-4">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <p className="font-inter text-xs sm:text-sm tracking-widest uppercase mb-2 font-medium" style={{ color: '#93a267' }}>
          What Our Customers Say
        </p>
        <h2 className="font-inter text-3xl md:text-4xl font-bold" style={{ color: '#93a267' }}>
          Testimonials
        </h2>
      </div>

      {/* Testimonials Carousel */}
      <div className="max-w-7xl mx-auto overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 will-change-transform transition-transform"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {extendedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="testimonial-card flex-shrink-0 w-full md:w-96 bg-white border rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
              style={{ borderColor: '#93a26733' }}
            >
              {/* Customer Info */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                  style={{ background: 'linear-gradient(135deg, #93a267 0%, #7d8c56 100%)' }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 className="font-inter font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="font-inter text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">{renderStars(testimonial.rating)}</div>
                <span className="font-inter text-sm font-medium text-gray-700">{testimonial.rating.toFixed(1)}</span>
              </div>

              {/* Quote */}
              <p className="font-inter text-gray-700 leading-relaxed">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Text */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-sm" style={{ color: '#93a267' }}>
        <p className="font-inter">Hover to pause • Scroll for more reviews</p>
      </div>
    </div>
  );
};
