import React, { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import bedroomCategoryBgImg from "../../../assets/bedRoomCategory.jpg";
import kidsCategoryBgImg from "../../../assets/kidsCategory.jpg";
import livingRoomCategoryBgImg from "../../../assets/livingRoomCategory.jpg";
import cotCategoryBgImg from "../../../assets/COT1.png";
import balconyCategoryBgImg from "../../../assets/ourvision.png";
import { useNavigate } from "react-router-dom";

export const FeaturedCategories = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Categories for handloom furniture
  const categoriesArr = [
    { title: "Cot", count: 24, src: cotCategoryBgImg },
    { title: "Sofa", count: 36, src: livingRoomCategoryBgImg },
    { title: "Diwan", count: 18, src: kidsCategoryBgImg },
    { title: "Chair", count: 28, src: livingRoomCategoryBgImg },
    { title: "Balcony Furniture", count: 15, src: balconyCategoryBgImg },
    { title: "Swing", count: 12, src: kidsCategoryBgImg },
  ];

  const itemsPerView = 3;
  const maxIndex = Math.max(0, categoriesArr.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-page">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase mb-3">
            Explore Our Collection
          </p>
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Shop by Category
          </h2>
        </div>

        {/* Categories Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-primary hover:bg-sage-dark text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-primary hover:bg-sage-dark text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Next categories"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Categories Grid with Carousel */}
          <div className="overflow-hidden px-1">
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                gridTemplateColumns: `repeat(${categoriesArr.length}, minmax(0, 1fr))`,
              }}
            >
              {categoriesArr.map((category, index) => (
                <article
                  key={index}
                  className="card-category group cursor-pointer"
                  onClick={() => navigate("/shop")}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.src}
                      alt={`${category.title} furniture collection`}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-wood-dark/90 via-wood-dark/50 to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl md:text-3xl font-bold font-inter mb-2">
                        {category.title}
                      </h3>
                      <p className="text-sm text-white/80 mb-3">
                        Explore {category.count}+
                      </p>

                      {/* Explore Button */}
                      <button className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all duration-300">
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-border hover:bg-primary/50"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
