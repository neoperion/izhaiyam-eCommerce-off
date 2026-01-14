import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import FooterSection from "../components/footerSection";
import newsImage from "../assets/news.png";
import founderImage from "../assets/IMG_0207 (1).jpg";
import CircularGallery from "../components/CircularGallery/CircularGallery";
import BrandStorySection from "../components/BrandStorySection";

// Import award images
import award1 from "../assets/award1.jpg";
import award2 from "../assets/award2.jpeg";
import award3 from "../assets/award3.jpg";
import award4 from "../assets/award4.jpg";

export const AboutUsPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Modern Hero Section */}
      {/* Enhanced Modern Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 md:py-32 px-4 md:px-6 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(147, 162, 103, 0.05)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(147, 162, 103, 0.05)' }}></div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Eyebrow Text */}
          <p className="font-inter text-xs md:text-base font-semibold tracking-wider uppercase text-center mb-3 md:mb-4" style={{ color: '#93a267' }}>
            Weaving Tradition, Crafting Comfort
          </p>

          {/* Main Heading */}
          <h1 className="font-inter text-3xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 text-center leading-tight">
            About <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">Izhaiyam</span>
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 mb-8 md:mb-12">
            <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#93a267' }}></div>
            <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
          </div>

          {/* Description Paragraphs */}
          <div className="space-y-4 md:space-y-8 max-w-3xl mx-auto">
            <p className="font-inter text-sm md:text-2xl text-gray-800 leading-relaxed text-center font-light">
              Founded by <span className="font-semibold text-gray-900">M. Suriya Kanniyappan</span>, Izhaiyam Handloom Furniture is <span className="font-semibold text-gray-900">Chennai’s first rope furniture manufacturing company</span>, dedicated to creating sustainable, handwoven, and health-friendly furniture for modern living spaces.
            </p>

            <p className="font-inter text-sm md:text-lg text-gray-600 leading-relaxed text-center">
              With a unique combination of craftsmanship and eco-conscious design, Izhaiyam specializes in <span className="font-medium text-gray-800">cotton rope handwoven furniture</span>, offering durable, chemical-free, and breathable alternatives to conventional products. Every piece is designed to support a healthier lifestyle—crafted using natural materials that promote ventilation, posture support, and long-lasting comfort.
            </p>

            <p className="font-inter text-sm md:text-lg text-gray-600 leading-relaxed text-center">
              Izhaiyam began with a simple yet powerful vision—to make <span className="font-medium text-gray-800">sustainability an everyday lifestyle choice</span>. With a B.Sc. in Visual Communication, our founder Suriya transformed her creativity into a meaningful business that stands for environmental responsibility and human well-being. Starting without any business background or external support, she built Izhaiyam while raising two daughters, proving that dreams grow stronger with purpose.
            </p>
          </div>

          {/* Stats Section - Enhanced - Horizontal Row on Mobile */}
          <div className="mt-10 md:mt-16 grid grid-cols-3 gap-2 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center p-2 md:p-6 rounded-lg md:rounded-2xl bg-white shadow-sm md:shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <p className="font-inter text-2xl md:text-6xl font-bold mb-1 md:mb-2" style={{ color: '#93a267' }}>15+</p>
              <p className="font-inter text-[10px] md:text-sm font-semibold text-gray-900 uppercase tracking-wide">Years of Excellence</p>
              <p className="font-inter text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1 hidden md:block">Trusted tradition</p>
            </div>
            <div className="text-center p-2 md:p-6 rounded-lg md:rounded-2xl bg-white shadow-sm md:shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <p className="font-inter text-2xl md:text-6xl font-bold mb-1 md:mb-2" style={{ color: '#93a267' }}>200+</p>
              <p className="font-inter text-[10px] md:text-sm font-semibold text-gray-900 uppercase tracking-wide">Skilled Weavers</p>
              <p className="font-inter text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1 hidden md:block">Master craftspeople</p>
            </div>
            <div className="text-center p-2 md:p-6 rounded-lg md:rounded-2xl bg-white shadow-sm md:shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <p className="font-inter text-2xl md:text-6xl font-bold mb-1 md:mb-2" style={{ color: '#93a267' }}>5K+</p>
              <p className="font-inter text-[10px] md:text-sm font-semibold text-gray-900 uppercase tracking-wide">Happy Customers</p>
              <p className="font-inter text-[8px] md:text-xs text-gray-500 mt-0.5 md:mt-1 hidden md:block">Across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Articles Section */}
      <section className="w-full bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-20">Our Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
            {/* Left Column - Text */}
            <div className="flex items-start pt-8">
              <div className="text-left">
                <p className="font-inter text-base font-light text-gray-700 leading-relaxed">
                  Furniture is more than a functional element in a home—it is an expression of culture, comfort, and craftsmanship. Our brand was founded with the belief that well-made furniture should carry a story, a purpose, and a soul. We bring together traditional techniques and contemporary design to create furniture that is timeless, meaningful, and built to last.
                  <br /><br />
                  Each piece in our collection is thoughtfully handcrafted by skilled artisans who have inherited their knowledge through generations. Their hands shape raw materials into refined forms, paying close attention to detail, balance, and durability. From the initial design to the final polish, every stage of the process reflects patience, precision, and pride in workmanship. We do not believe in mass production; instead, we value quality over quantity and authenticity over shortcuts.
                  <br /><br />
                  At the heart of our work is a strong commitment to empowering artisans, especially women craftsmen who play a vital role in preserving traditional art forms. By providing fair opportunities, a supportive work environment, and consistent demand for their skills, we help sustain livelihoods while keeping heritage craftsmanship alive. When you choose our furniture, you are not just purchasing a product—you are supporting a community and a legacy.
                  <br /><br />
                  Our designs are inspired by everyday living. We focus on creating furniture that is both aesthetically pleasing and highly functional. Clean lines, balanced proportions, and natural materials define our style, making our pieces suitable for modern homes while still retaining a warm, traditional essence. Whether it is a chair, a table, or a handcrafted décor piece, each product is designed to seamlessly blend into your space and enhance your daily life.
                  <br /><br />
                  Quality is central to everything we do. We carefully source materials that are durable, sustainable, and responsibly selected. Our furniture is built to withstand time, usage, and changing trends. Rigorous quality checks ensure that every product meets our standards before reaching your home, so you can trust in its strength, finish, and comfort.
                </p>
              </div>
            </div>

            {/* Right Column - Article Preview */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={newsImage}
                alt="Article Preview"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Founder Section */}
      <section className="w-full bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-20">Our Founders</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            {[
              { name: "M. Suriya Kanniyappan", role: "Founder & Creative Director" },
              { name: "N. Manivasagam", role: "Co-Founder & Production Head" }
            ].map((founder, i) => (
              <div key={i} className="text-center">
                <div className="rounded-lg w-96 h-96 mb-8 overflow-hidden mx-auto">
                  <img
                    src={founderImage}
                    alt={founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-inter text-2xl font-light text-gray-800">{founder.name}</p>
                <p className="font-inter text-sm text-gray-500 mt-2">{founder.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <BrandStorySection />

      {/* Our Awards Section */}
      <section className="w-full bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-20">Our Awards</h2>

          {/* 3D Circular Gallery */}
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery
              items={[
                { image: founderImage, text: 'Founder' },
                { image: award1, text: 'Award 2024' },
                { image: award2, text: 'Excellence' },
                { image: award3, text: 'Innovation' },
                { image: award4, text: 'Achievement' }
              ]}
              bend={0}
              borderRadius={0.05}
              scrollEase={isMobile ? 0.05 : 0.01}
              scrollSpeed={isMobile ? 4 : 2}
              textColor="#93a267"
              font="bold 24px Inter"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};
