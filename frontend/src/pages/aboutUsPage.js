import React, { useState, useEffect } from 'react';
import { SEO } from "../components/SEO/SEO";
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from "framer-motion";
import FooterSection from "../components/footerSection";
import newsImage from "../assets/news.png";
import founderImage from "../assets/IMG_0207 (1).jpg";
import CircularGallery from "../components/CircularGallery/CircularGallery";
import BrandStorySection from "../components/BrandStorySection";
import MissionVisionSection from "../components/MissionVisionSection"; // Imported new section

// Import award images
import award1 from "../assets/award1.jpg";
import award2 from "../assets/award2.jpeg";
import award3 from "../assets/award3.jpg";
import award4 from "../assets/award4.jpg";
import aboutHeroImage from "../assets/about_us_hero.png";
import ourMissionImage from "../assets/our_mission.png";

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
      <SEO 
        title="About Us - Tradition Meets Craftsmanship"
        description="Discover the story of Izhaiyam Handloom Furniture. Founded to preserve traditional rope furniture making while empowering local artisans in Tamil Nadu."
        canonical="https://www.izhaiyam.com/aboutUs"
        type="article"
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Izhaiyam Handloom Furniture",
          "url": "https://www.izhaiyam.com",
          "logo": "https://www.izhaiyam.com/logo.jpg",
          "sameAs": [
            "https://www.instagram.com/izhaiyam_furniture",
            "https://www.facebook.com/izhaiyam"
          ]
        }}
      />
      {/* Enhanced Modern Hero Section with Image Background */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full py-20 md:py-40 px-4 md:px-6 overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: `url(${aboutHeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto relative z-10 text-center"
        >
          {/* Eyebrow Text */}
          <p className="font-inter text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-center mb-3 md:mb-4 text-[#E8F0D6] drop-shadow-md">
            Weaving Tradition, Crafting Comfort
          </p>

          {/* Main Heading */}
          <h1 className="font-playfair text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
            About Izhaiyam
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 mb-8 md:mb-12">
            <div className="w-8 md:w-12 h-0.5 bg-white/70"></div>
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#93a267]"></div>
            <div className="w-8 md:w-12 h-0.5 bg-white/70"></div>
          </div>

          {/* Description Paragraphs - White Text */}
          <div className="space-y-4 md:space-y-8 max-w-3xl mx-auto">
            <p className="font-inter text-sm md:text-xl text-white/90 leading-relaxed font-light drop-shadow-sm">
              Founded by <span className="font-semibold text-white">M. Suriya Kanniyappan</span>, Izhaiyam Handloom Furniture is <span className="font-semibold border-b border-[#93a267]">Chennai’s first rope furniture manufacturing company</span>, dedicated to creating sustainable, handwoven, and health-friendly furniture.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section - Moved outside Hero for cleaner look */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-12 bg-white relative -mt-10 z-20"
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-2 md:gap-8 shadow-2xl rounded-2xl bg-white border border-gray-100 p-6 md:p-8">
            <div className="text-center">
              <p className="font-inter text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-[#93a267]">6+</p>
              <p className="font-inter text-[10px] md:text-sm font-semibold text-gray-900 uppercase tracking-wide">Years of Excellence</p>
            </div>
            <div className="text-center border-l border-gray-100">
              <p className="font-inter text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-[#93a267]">40+</p>
              <p className="font-inter text-[10px] md:text-sm font-semibold text-gray-900 uppercase tracking-wide">Skilled Weavers</p>
            </div>
            <div className="text-center border-l border-gray-100">
              <p className="font-inter text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-[#93a267]">800+</p>
              <p className="font-inter text-[10px] md:text-sm font-semibold text-gray-900 uppercase tracking-wide">Happy Customers</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* NEW MISSION AND VISION SECTION */}
      <MissionVisionSection />

      {/* Our Articles Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gray-50 py-24 px-6"
      >
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
      </motion.section>

      {/* Our Founder Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white py-24 px-6"
      >
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
      </motion.section>

      {/* Brand Story Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <BrandStorySection />
      </motion.div>

      {/* Our Awards Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full bg-white py-24 px-6"
      >
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
      </motion.section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};
