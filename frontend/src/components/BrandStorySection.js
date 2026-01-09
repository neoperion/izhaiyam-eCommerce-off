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
    <section className="w-full bg-[#f9f8f6] py-24 px-6">
      <div className="max-w-7xl mx-auto bg-[#f2efeb] rounded-[3rem] overflow-hidden shadow-sm border border-stone-100">

        {/* TOP PART — “OUR VISION” */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Left Column - Text */}
          <div className="p-12 lg:p-20 flex flex-col justify-center order-2 lg:order-1">
            <h2 className="font-inter text-4xl lg:text-5xl font-bold text-[#93a267] mb-6 tracking-wide">
              Our Vision
            </h2>
            <div className="w-24 h-1 bg-[#93a267] mb-8 rounded-full opacity-80"></div>

            <p className="font-inter text-xl lg:text-2xl font-light leading-relaxed text-[#2c2c2c]">
              “A world with a <span className="font-medium text-[#7a8a55]">healthier lifestyle</span> and a commitment to ensure <span className="font-medium text-[#7a8a55]">traditional crafts</span> never disappear.”
            </p>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-64 lg:h-auto order-1 lg:order-2 overflow-hidden">
            <div
              className="absolute inset-0 z-0 transform transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url(${ourVisionImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Overlay for fading */}
            <div className="absolute inset-0 bg-[#f2efeb] opacity-30 mix-blend-overlay z-10"></div>
            {/* Gradient overlay to blend with left side on desktop, bottom on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-[#f2efeb] via-transparent to-transparent z-10 opacity-90 lg:opacity-100"></div>
          </div>
        </div>

        {/* BOTTOM PART — “HEALTH BENEFITS” */}
        <div className="bg-white/50 backdrop-blur-sm px-8 py-16 lg:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Side - Heading */}
            <div className="lg:col-span-5 pt-4">
              <h3 className="font-inter text-3xl lg:text-4xl font-bold text-[#2c2c2c] mb-6 leading-tight">
                Health Benefits of<br />
                <span className="text-[#93a267]">Rope Furniture</span>
              </h3>
              <div className="w-16 h-1 bg-[#2c2c2c] mb-6 rounded-full opacity-20"></div>
              <p className="font-inter text-lg text-[#5a5a5a] leading-relaxed max-w-md">
                Designed the traditional way, backed by generations of lived experience. Not just furniture, but a wellness choice for your home.
              </p>
            </div>

            {/* Right Side - Benefits List */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group flex items-center p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-[#93a267]/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-[#93a267] mr-4 group-hover:scale-125 transition-transform"></div>
                    <span className="font-inter text-[#4a4a4a] text-base group-hover:text-[#2c2c2c] transition-colors">
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
