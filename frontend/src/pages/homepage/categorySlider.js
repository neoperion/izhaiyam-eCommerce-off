import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import cotImg from '../../assets/category-cot.jpg';
import sofaImg from '../../assets/category-sofa.jpg';
import diwanImg from '../../assets/category-diwan.jpg';
import chairImg from '../../assets/category-chair.jpg';
import swingImg from '../../assets/category-swing.jpg';
import balconyImg from '../../assets/category-balcony.jpg';

const CategorySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    { name: 'Cot', image: cotImg, products: 24 },
    { name: 'Sofa', image: sofaImg, products: 36 },
    { name: 'Diwan', image: diwanImg, products: 18 },
    { name: 'Chair', image: chairImg, products: 20 },
    { name: 'Swing', image: swingImg, products: 12 },
    { name: 'Balcony', image: balconyImg, products: 14 },
  ];

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

  return (
    <section className="py-16 px-4 md:px-8" style={{ backgroundColor: '#FFF7F2' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest text-gray-500 mb-2 uppercase font-medium" style={{ color: '#93a267' }}>
            BROWSE CATEGORIES
          </p>
          <h2 className="text-2xl md:text-4xl font-bold" style={{ color: '#93a267' }}>
            Shop By Category
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
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
                  <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group cursor-pointer h-[350px]">
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

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10"
            style={{ backgroundColor: '#93a267' }}
          >
            <ChevronLeft className="text-white" size={24} />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed z-10"
            style={{ backgroundColor: '#93a267' }}
          >
            <ChevronRight className="text-white" size={24} />
          </button>
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
