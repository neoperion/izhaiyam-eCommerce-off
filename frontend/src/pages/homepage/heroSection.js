import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from 'react';
import heroImage from '../../assets/heroimage.jpg';
import heroImage2 from '../../assets/heroimage2.jpg';
// Add CSS animations
const animationStyles = `
  @keyframes slideInFromRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slideOutToLeft {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  .hero-slide-in {
    animation: slideInFromRight 1s ease-out forwards;
  }

  .hero-slide-out {
    animation: slideOutToLeft 1s ease-in forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = animationStyles;
  if (!document.head.querySelector('style[data-hero-animation]')) {
    style.setAttribute('data-hero-animation', 'true');
    document.head.appendChild(style);
  }
}

export function HeroSection() {
  const [isSliding, setIsSliding] = useState(false);
  const [heroImage2Active, setHeroImage2Active] = useState(false);

  useEffect(() => {
    const cycle = () => {
      // After 5 seconds, start sliding in heroImage2 from right to left
      setTimeout(() => {
        setIsSliding(true);
        setHeroImage2Active(true);
      }, 5000);

      // After 6 seconds (1s animation + 5s display), slide out to left
      setTimeout(() => {
        setIsSliding(true);
        setHeroImage2Active(false);
      }, 11000);

      // After 6 seconds (1s animation + 5s display), reset and repeat
      setTimeout(() => {
        setIsSliding(false);
        cycle();
      }, 17000);
    };

    cycle();
  }, []);

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] flex items-center overflow-hidden">
      {/* Base Background - HeroImage1 (Always Fixed) */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern living room with elegant wooden furniture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-background/10 to-transparent" />
      </div>

      {/* Sliding Overlay - HeroImage2 */}
      <div
        className={`absolute inset-0 z-[5] overflow-hidden ${
          isSliding && heroImage2Active ? 'hero-slide-in' : ''
        } ${
          isSliding && !heroImage2Active ? 'hero-slide-out' : ''
        } ${!isSliding && !heroImage2Active ? 'translate-x-full' : ''}`}
      >
        <img
          src={heroImage2}
          alt="Handloom furniture heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-background/10 to-transparent" />
      </div>

      {/* Fixed Content - Switches based on active image */}
      <div className="container-page relative z-10 ml-0 px-4 sm:px-6 md:px-8">
        <div className="max-w-xl md:max-w-2xl animate-fade-in-up">
          {/* HeroImage1 Content */}
          {!heroImage2Active && (
            <>
              <p className="text-primary font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 text-xs sm:text-sm drop-shadow-lg transition-all duration-700">
                Handcrafted Furniture
              </p>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-4 sm:mb-6 drop-shadow-2xl transition-all duration-700"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
              >
                Inspired by
                <br />
                <span className="text-primary font-extrabold italic">Heritage</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-foreground/90 font-medium mb-6 sm:mb-8 max-w-lg drop-shadow-lg leading-relaxed transition-all duration-700">
                IZHAIYAM — Celebrating the art of handloom in modern living.
              </p>
            </>
          )}

          {/* HeroImage2 Content */}
          {heroImage2Active && (
            <>
              <p className="text-[#faf0e6] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 text-xs sm:text-sm drop-shadow-lg transition-all duration-700">
                Handloom furniture 
              </p>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#faf0e6] leading-tight mb-4 sm:mb-6 drop-shadow-2xl transition-all duration-700"
                style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
              >
                Crafted By,
                <br />
                <span className="text-[#faf0e6] font-extrabold italic">Hand.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#faf0e6] font-medium mb-6 sm:mb-8 max-w-lg drop-shadow-lg leading-relaxed transition-all duration-700">
                “IZHAIYAM — Where every weave tells a story.”
              </p>
            </>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/shop"
              className={`inline-flex items-center justify-center gap-2 group font-semibold px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base rounded-lg shadow-xl transition-all duration-300 transform hover:scale-105 ${
                heroImage2Active
                  ? 'bg-[#faf0e6] hover:bg-[#f5ebe0] text-[#2c2c2c]'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/collection"
              className={`inline-flex items-center justify-center border-2 font-semibold px-8 py-4 rounded-lg shadow-xl transition-all duration-300 backdrop-blur-sm ${
                heroImage2Active
                  ? 'border-[#faf0e6] text-[#faf0e6] hover:bg-[#faf0e6] hover:text-[#2c2c2c]'
                  : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              Explore Premium
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}