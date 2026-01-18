import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";

// Import New Editorial Images
import imgChair from "../../assets/hero/editorial_chair.png";
import imgDesktopHero from "../../assets/hero/hero_desktop.jpg";
import imgBadge from "../../assets/hero/badge_logo.png";
// Mobile Specific Assets
import imgMobileVertical from "../../assets/hero/mobile_vertical.png";
import imgMobileBg from "../../assets/hero/mobile_bg.png";

export function HeroSection() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Mouse Parallax Effect (Desktop Only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setOffset({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* ============================================================ */}
      {/* MOBILE HERO - Fullscreen Immersive (< 1024px)                  */}
      {/* ============================================================ */}
      <section className="block lg:hidden w-full min-h-[100svh] relative overflow-hidden">
         
         {/* Full Background Image */}
         <div className="absolute inset-0 z-0">
             <img 
                src={imgDesktopHero} 
                alt="Izhaiyam Handloom Furniture" 
                className="w-full h-full object-cover"
                style={{ objectPosition: "center center" }}
             />
             {/* Dark gradient overlay for text readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
         </div>

         {/* Floating Brand Badge - Top Right */}
         <div className="absolute top-6 right-5 z-20">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                 <img src="/favicon.ico" alt="Izhaiyam" className="w-8 h-8 object-contain" />
             </div>
         </div>

         {/* Content Area - Positioned at Bottom */}
         <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8 pt-20 bg-gradient-to-t from-black/60 to-transparent">
             
             {/* Tagline Badge */}
             <div className="inline-flex items-center gap-2 mb-4">
                 <div className="w-6 h-[2px] bg-[#93a267]"></div>
                 <span className="font-inter text-xs uppercase tracking-[0.2em] text-white/80 font-medium">
                     Handcrafted Since 2019
                 </span>
             </div>

             {/* Main Heading */}
             <h1 className="font-playfair text-[2.5rem] leading-[1.1] text-white tracking-tight mb-4">
                Weaving <span className="italic text-[#c4d49a]">Comfort</span> <br/>
                Into Life.
             </h1>

             {/* Description */}
             <p className="font-inter text-white/70 text-sm leading-relaxed mb-6 max-w-[90%]">
                Experience the warmth of handcrafted rope furniture. Sustainable, breathable, and designed for the modern Indian home.
             </p>

             {/* CTA Buttons */}
             <div className="flex gap-3">
                <Link 
                    to="/shop" 
                    className="flex-1 h-14 bg-[#93a267] text-white rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform font-medium"
                >
                    <span>Explore Collection</span>
                    <ArrowUpRight size={18} />
                </Link>
                
                <Link 
                    to="/contactUs"
                    className="h-14 px-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium flex items-center justify-center active:bg-white/20 transition-colors"
                >
                    Custom
                </Link>
             </div>

             {/* Bottom Features Strip */}
             <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                 <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-[#93a267]"></div>
                     <span className="text-white/60 text-xs font-inter">Free Delivery</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-[#93a267]"></div>
                     <span className="text-white/60 text-xs font-inter">100% Natural</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-[#93a267]"></div>
                     <span className="text-white/60 text-xs font-inter">5 Yr Warranty</span>
                 </div>
             </div>
         </div>

         {/* Swipe Up Indicator */}
         <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 opacity-60 animate-bounce">
             <ChevronRight size={24} className="text-white rotate-90" />
         </div>
      </section>


      {/* ==================================================================== */}
      {/* DESKTOP LAYOUT (Visible >= 1024px) - "Editorial Split" (LOCKED)      */}
      {/* ==================================================================== */}
      <section className="hidden lg:flex relative w-full min-h-[90vh] bg-[#fdfbf7] flex-col lg:flex-row items-center overflow-hidden">
      
      {/* --- LEFT: Typography & Content (40%) --- */}
      <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-6 md:px-12 lg:pl-24 py-12 lg:py-0 relative z-20">
        
        {/* Floating Decor Element (Mobile Hidden) */}
        <div 
            className="hidden lg:block absolute -top-10 -left-10 w-64 h-64 opacity-20 pointer-events-none"
            style={{ transform: `translate(${-offset.x}px, ${-offset.y}px)` }}
        >
             <div className="w-full h-full rounded-full bg-[#93a267] blur-[80px]"></div>
        </div>

        <div className="space-y-6 relative">

             <h1 className="font-playfair text-5xl md:text-7xl lg:text-[5.5rem] leading-[1] text-[#2f3e2f] tracking-tight">
                Weaving <br/>
                <span className="italic text-[#93a267] ml-4 md:ml-8">Comfort</span> <br/>
                Into Life.
             </h1>

             <p className="font-inter text-gray-600 text-lg md:text-xl max-w-md leading-relaxed">
                Experience the warmth of handcrafted rope furniture. Sustainable, breathable, and designed for the modern Indian home.
             </p>

             <div className="pt-6 flex flex-wrap gap-5">
                <Link 
                    to="/shop" 
                    className="group relative px-8 py-4 bg-[#2f3e2f] text-[#fdfbf7] rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
                >
                    <span className="relative z-10 flex items-center gap-2 font-medium">
                        Explore Collection <ArrowUpRight size={20} />
                    </span>
                    <div className="absolute inset-0 bg-[#3f523f] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                </Link>

                <Link 
                    to="/contactUs"
                    className="px-8 py-4 rounded-full border border-[#2f3e2f]/20 text-[#2f3e2f] font-medium hover:bg-[#2f3e2f]/5 transition-colors"
                >
                    Custom Orders
                </Link>
             </div>
        </div>
      </div>


      {/* --- RIGHT: Visual Showcase (60%) --- */}
      <div className="w-full lg:w-[55%] h-[50vh] lg:h-full relative flex items-center justify-center p-6 lg:p-0">
         
         {/* Background Shape (Abstract Blob) */}
         <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#f4ebd0] rounded-full blur-3xl opacity-60"
            style={{ transform: `translate(-50%, -50%) translate(${offset.x * 1.5}px, ${offset.y * 1.5}px)` }}
         ></div>

         {/* Main Hero Image - Desktop: Full showcase image */}
         <div className="relative z-10 w-full max-w-2xl lg:max-w-3xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
             <img 
                src={imgDesktopHero} 
                alt="Izhaiyam Handloom Furniture Showcase" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                style={{ transform: `translate(${-offset.x * 0.5}px, ${-offset.y * 0.5}px)` }}
             />
         </div>

         {/* Badge */}
         <div className="absolute bottom-10 -left-6 md:-left-12 w-28 h-28 md:w-36 md:h-36 bg-[#93a267]/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl overflow-hidden border border-white/10 z-20">
             <div className="absolute inset-0 flex items-center justify-center">
                <img src="/favicon.ico" alt="Izhaiyam" className="w-1/2 h-1/2 object-contain opacity-90" />
             </div>
             <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full p-2 animate-[spin_12s_linear_infinite]">
                 <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent"/>
                 <text className="text-[11px] uppercase tracking-[0.2em] font-bold fill-[#2f3e2f]">
                     <textPath href="#curve">
                      EST 2019 izhayam Handloom
                     </textPath>
                 </text>
             </svg>
         </div>
      </div>

    </section>
    </>
  );
}