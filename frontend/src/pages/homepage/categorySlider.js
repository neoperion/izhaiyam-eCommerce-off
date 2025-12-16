import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedCategory, setSelectedSubCategoryForFilter } from '../../features/filterBySlice';
import cotImg from '../../assets/category-cot.jpg';
import sofaImg from '../../assets/category-sofa.jpg';
import diwanImg from '../../assets/category-diwan.jpg';
import chairImg from '../../assets/category-chair.jpg';
import swingImg from '../../assets/category-swing.jpg';
import balconyImg from '../../assets/category-balcony.jpg';

const CategorySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = [
    { name: 'Cot', image: cotImg, products: 24, type: 'features', value: 'cot' },
    { name: 'Sofa', image: sofaImg, products: 36, type: 'features', value: 'sofa' },
    { name: 'Diwan', image: diwanImg, products: 18, type: 'features', value: 'diwan' },
    { name: 'Chair', image: chairImg, products: 20, type: 'features', value: 'chairs' },
    { name: 'Swing', image: swingImg, products: 12, type: 'features', value: 'swing' },
    { name: 'Balcony', image: balconyImg, products: 14, type: 'location', value: 'balcony' },
  ];

  // ... (keep existing state logic)

  const handleCategoryClick = (category) => {
      // Set the main category (features/location)
      dispatch(setSelectedCategory(category.type));
      // Set the sub-category (cot/sofa/etc)
      dispatch(setSelectedSubCategoryForFilter(category.value));
      // Navigate to shop
      navigate('/shop');
  };

  // ... (keep existing handlePrev, handleNext, etc)


  const cardsToShow = 3;
  const maxIndex = Math.max(0, categories.length - cardsToShow);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - go next
      handleNext();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right - go prev
      handlePrev();
    }
  };

  // Mouse/Trackpad handlers
  const handleMouseDown = (e) => {
    setTouchStart(e.clientX);
    sliderRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (touchStart !== 0) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (touchStart !== 0) {
      if (touchStart - touchEnd > 75) {
        handleNext();
      }
      if (touchStart - touchEnd < -75) {
        handlePrev();
      }
    }
    setTouchStart(0);
    setTouchEnd(0);
    sliderRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    if (touchStart !== 0) {
      setTouchStart(0);
      setTouchEnd(0);
      sliderRef.current.style.cursor = 'grab';
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8" style={{ backgroundColor: '#FFF7F2' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm tracking-widest text-gray-500 mb-2 uppercase font-medium" style={{ color: '#93a267' }}>
            BROWSE CATEGORIES
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: '#93a267' }}>
            Shop By Category
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Cards Container */}
          <div 
            ref={sliderRef}
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="flex transition-transform duration-500 ease-out gap-6 pointer-events-none"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsToShow + 2)}%)`,
              }}
            >
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / cardsToShow}% - 16px)` }}
                >
                  <div 
                    onClick={() => handleCategoryClick(category)}
                    className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer h-[200px] md:h-[350px] pointer-events-auto"
                  >
                    {/* Image */}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-xs text-white/90 mb-2">{category.products} Products</p>
                      <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all">
                        <span>Explore</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2'
                  : 'w-2 h-2 hover:opacity-70'
              }`}
              style={{
                backgroundColor: index === currentIndex ? '#93a267' : '#cbd5e0',
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
