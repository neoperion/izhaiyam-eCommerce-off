import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory, setSelectedSubCategoryForFilter } from '../../features/filterBySlice';
import cotImg from '../../assets/COT1.png';
import sofaImg from '../../assets/sofa.png';
import diwanImg from '../../assets/category-diwan.png';
import chairImg from '../../assets/chair (2).png';
import swingImg from '../../assets/HEALTH (5).png';
import balconyImg from '../../assets/ourvision.png';

const CategorySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allProductsData } = useSelector((state) => state.productsData);

  const categories = [
    { name: 'Cot', image: cotImg, type: 'features', value: 'cot' },
    { name: 'Sofa', image: sofaImg, type: 'features', value: 'sofa' },
    { name: 'Diwan', image: diwanImg, type: 'features', value: 'diwan' },
    { name: 'Chair', image: chairImg, type: 'features', value: 'chairs' },
    { name: 'Swing', image: swingImg, type: 'features', value: 'swing' },
    { name: 'Balcony', image: balconyImg, type: 'location', value: 'balcony' },
  ];

  const getProductCount = (categoryType, categoryValue) => {
    if (!allProductsData) return 0;
    return allProductsData.filter((product) =>
      product.categories &&
      product.categories[categoryType] &&
      product.categories[categoryType].some(cat => cat.toLowerCase() === categoryValue.toLowerCase())
    ).length;
  };

  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(category.type));
    dispatch(setSelectedSubCategoryForFilter(category.value));
    navigate('/shop');
  };

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
      handleNext();
    }
    if (touchStart - touchEnd < -75) {
      handlePrev();
    }
  };

  // Mouse/Trackpad handlers
  const handleMouseDown = (e) => {
    setTouchStart(e.clientX);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grabbing';
    }
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
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (touchStart !== 0) {
      setTouchStart(0);
      setTouchEnd(0);
      if (sliderRef.current) {
        sliderRef.current.style.cursor = 'grab';
      }
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8" style={{ backgroundColor: '#FFF7F2' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-6 sm:mb-10">
          <p className="font-inter text-xs sm:text-sm tracking-widest text-gray-500 mb-2 uppercase font-medium" style={{ color: '#93a267' }}>
            BROWSE CATEGORIES
          </p>
          <h2 className="font-inter text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold" style={{ color: '#000000' }}>
            Shop By Category
          </h2>
        </div>

        {/* Mobile Grid Layout - 3 rows x 2 columns */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category)}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer aspect-square w-[85%] mx-auto"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="text-sm font-bold mb-1">{category.name}</h3>
                <p className="text-[10px] text-white/90 mb-1">{getProductCount(category.type, category.value)} Products</p>
                <div className="flex items-center gap-2 text-[10px] font-medium group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Slider - Hidden on mobile */}
        <div className="hidden md:block relative">
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
                    className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer w-[85%] mx-auto aspect-square pointer-events-auto"
                  >
                    {/* Image */}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                      <p className="text-[11px] text-white/90 mb-2">{getProductCount(category.type, category.value)} Products</p>
                      <div className="flex items-center gap-2 text-[11px] font-medium group-hover:gap-3 transition-all">
                        <span>Explore</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots - Desktop only */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`rounded-full transition-all duration-300 ${index === currentIndex
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

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-[#93a267] hover:text-white transition-all duration-300 z-10 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
            disabled={currentIndex === 0}
            aria-label="Previous category"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-[#93a267] hover:text-white transition-all duration-300 z-10 ${currentIndex === maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
            disabled={currentIndex === maxIndex}
            aria-label="Next category"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
