import React from 'react';
import ourVisionImg from '../assets/ourvision.png';

const BrandStorySection = () => {
  const benefits = [
    "Controls body temperature naturally",
    "Improves blood circulation",
    "Supports better digestion",
    "Skin-friendly, especially safe for children",
    "Helps reduce insomnia",
    "Encourages better sleep posture",
    "Reduces back and shoulder pain",
    "Sustainable and eco-friendly alternative"
  ];

  return (
    <section className="w-full bg-secondary/30 py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto bg-secondary/50 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-soft border border-border">
        
        {/* HEALTH BENEFITS ONLY */}
        <div className="bg-white/60 backdrop-blur-sm px-5 py-10 md:px-12 md:py-16 lg:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Side - Heading */}
            <div className="lg:col-span-5 pt-0 md:pt-4 text-center lg:text-left">
              <h3 className="font-inter text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-6 leading-tight">
                Health Benefits of<br />
                <span className="text-primary">Rope Furniture</span>
              </h3>
              <div className="w-16 h-1 bg-foreground mb-4 md:mb-6 rounded-full opacity-20 mx-auto lg:mx-0"></div>
              <p className="font-inter text-base md:text-lg text-black leading-relaxed max-w-md mx-auto lg:mx-0">
                Designed the traditional way, backed by generations of lived experience. Not just furniture, but a wellness choice for your home.
              </p>
            </div>

            {/* Right Side - Benefits List */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group flex items-center p-3 md:p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-primary/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary mr-3 md:mr-4 group-hover:scale-125 transition-transform"></div>
                    <span className="font-inter text-black text-sm md:text-base group-hover:text-black transition-colors text-left font-medium">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default BrandStorySection;
