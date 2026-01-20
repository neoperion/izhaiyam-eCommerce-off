import React, { useState, useEffect } from 'react';
import { SEO } from "../components/SEO/SEO";
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { motion, useSpring, useTransform, useInView, useMotionValue } from "framer-motion";
import FooterSection from "../components/footerSection";
import newsImage from "../assets/news.png";
import founderImage from "../assets/IMG_0207 (1).jpg";
import suriyaImage from "../assets/team/suriya_kanniyappan.png";
import manivasagamImage from "../assets/team/manivasagam.png";
import CircularGallery from "../components/CircularGallery/CircularGallery";
import BrandStorySection from "../components/BrandStorySection";
import MissionVisionSection from "../components/MissionVisionSection";

// Import award images
import award2 from "../assets/award2.jpeg";
import award3 from "../assets/award3.jpg";
import aboutHeroImage from "../assets/about_us_hero.png";
import ourMissionImage from "../assets/our_mission.png";
import thinamalarImg from '../assets/thinamalar.png';
import puthuguamImg from '../assets/puthuguam.png';
import dinathanthiImg from '../assets/dinathanthi.png';
import chankayaImg from '../assets/chankaya.png';
import behindtakiesImg from '../assets/behindtakies.png';
import viktanImg from '../assets/viktan.png';

// Reusable Counter Component
const Counter = ({ value, duration = 2 }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const rounded = useTransform(springValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

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

  // Founders data with individual images
  const founders = [
    {
      name: "M. Suriya Kanniyappan",
      role: "Founder & Creative Director",
      image: suriyaImage
    },
    {
      name: "N. Manivasagam",
      role: "Co-Founder & Production Head",
      image: manivasagamImage
    }
  ];

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
              Founded by <span className="font-semibold text-white">M. Suriya Kanniyappan</span>, Izhaiyam Handloom Furniture is <span className="font-semibold border-b border-[#93a267]">Chennai's first rope furniture manufacturing company</span>, dedicated to creating sustainable, handwoven, and health-friendly furniture.
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
              <p className="font-inter text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-[#93a267]">
                <Counter value={6} />+
              </p>
              <p className="font-inter text-[10px] md:text-sm font-semibold text-gray-900 uppercase tracking-wide">Years of Excellence</p>
            </div>
            <div className="text-center border-l border-gray-100">
              <p className="font-inter text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-[#93a267]">
                <Counter value={40} />+
              </p>
              <p className="font-inter text-[10px] md:text-sm font-semibold text-gray-900 uppercase tracking-wide">Skilled Weavers</p>
            </div>
            <div className="text-center border-l border-gray-100">
              <p className="font-inter text-2xl md:text-5xl font-bold mb-1 md:mb-2 text-[#93a267]">
                <Counter value={1500} duration={2.5} />+
              </p>
              <p className="font-inter text-[10px] md:text-sm font-semibold text-gray-900 uppercase tracking-wide">Happy Customers</p>
            </div>
          </div>
        </div>
      </motion.section>



      {/* NEW MISSION AND VISION SECTION */}
      <MissionVisionSection />

      {/* Press & Media Recognition Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white py-20 border-t border-gray-100 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto text-center px-6">
          <h2 className="font-inter text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Press & Media Recognition
          </h2>
          <p className="font-inter text-base text-gray-500 max-w-2xl mx-auto mb-16 leading-relaxed">
            Celebrated by leading media outlets for our unwavering commitment to <span className="text-[#93a267] font-medium">Tradition</span> and <span className="text-[#93a267] font-medium">Quality Craftsmanship</span>.
          </p>
        </div>

        {/* Auto-Scrolling Marquee */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient Masks for Fade Effect */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="flex w-max">
            <motion.div
              className="flex items-center gap-16 md:gap-24 px-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: isMobile ? 10 : 30, // Faster on mobile (10s)
              }}
            >
              {[
                { name: 'Chanakya TV', img: chankayaImg },
                { name: 'Puthuyugam TV', img: puthuguamImg },
                { name: 'Behind Talkies', img: behindtakiesImg },
                { name: 'Dinamalar', img: thinamalarImg },
                { name: 'Dinathanthi', img: dinathanthiImg },
                { name: 'Aval Vikatan', img: viktanImg },
                // Duplicates for seamless loop
                { name: 'Chanakya TV', img: chankayaImg },
                { name: 'Puthuyugam TV', img: puthuguamImg },
                { name: 'Behind Talkies', img: behindtakiesImg },
                { name: 'Dinamalar', img: thinamalarImg },
                { name: 'Dinathanthi', img: dinathanthiImg },
                { name: 'Aval Vikatan', img: viktanImg },
              ].map((media, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 group flex flex-col items-center justify-center transition-opacity duration-300"
                >
                  <img
                    src={media.img}
                    alt={media.name}
                    className="h-20 md:h-28 w-auto object-contain transition-all duration-300 hover:scale-110"
                  />
                </div>
              ))}
            </motion.div>
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
        <div className="max-w-8xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-20">Our Founders</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {founders.map((founder, i) => (
              <div key={i} className="text-center">
                <div className="rounded-lg w-full max-w-sm h-[23rem] md:w-[23rem] md:h-[23rem] mb-8 overflow-hidden mx-auto shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover object-top"
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
                { image: award2, text: 'Excellence' },
                { image: award3, text: 'Innovation' }
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
