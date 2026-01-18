import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";

// Import New Editorial Images
import imgChair from "../../assets/hero/editorial_chair.png";
import imgDecor from "../../assets/hero/editorial_decor.png";
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
      <section className="block lg:hidden w-full h-[85vh] relative overflow-hidden bg-[#e9e8e4]">
         
         {/* Background Image - Pushed Down to reveal top space */}
         <div className="absolute inset-x-0 bottom-0 h-[70%] z-0">
             <img 
                src={imgMobileVertical} 
                alt="Handwoven Swing" 
                className="w-full h-full object-cover animate-[scale_20s_linear_infinite]" 
                style={{ objectPosition: "center top" }}
             />
             {/* Smooth fade at the top of the image to blend with background */}
             <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#e9e8e4] to-transparent"></div>
         </div>



         {/* Content Area (Top Reserved Space) */}
         <div className="absolute top-0 left-0 w-full z-10 px-5 pt-12 pb-4 flex flex-col gap-5">
             
             {/* Text Content */}
             <div className="space-y-4 animate-fade-in-up">
                 
                 <h1 className="font-playfair text-[2.75rem] leading-[1.1] text-[#2f3e2f] tracking-tight drop-shadow-sm">
                    Weaving <span className="italic text-[#93a267]">Comfort</span> <br/>
                    Into Life.
                 </h1>

                 {/* Minimal Divider */}
                 <div className="w-16 h-1 bg-[#2f3e2f]/20 rounded-full"></div>

                 <p className="font-inter text-[#4a5e4a] text-sm leading-relaxed max-w-[95%] font-medium">
                    Experience the warmth of handcrafted rope furniture. Sustainable, breathable, and designed for the modern Indian home.
                 </p>
             </div>

             {/* Action Buttons */}
             <div className="flex gap-3 mt-2 w-full animate-fade-in-up delay-100">
                <Link 
                    to="/shop" 
                    className="flex-1 h-12 bg-[#2f3e2f] text-[#fdfbf7] rounded-full flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform whitespace-nowrap"
                >
                    <span className="font-medium text-sm">Explore Collection</span>
                    <ArrowUpRight size={16} />
                </Link>
                
                <Link 
                    to="/contactUs"
                    className="px-5 h-12 rounded-full border border-[#2f3e2f]/20 text-[#2f3e2f] font-medium text-sm flex items-center justify-center active:bg-[#2f3e2f]/5 backdrop-blur-sm whitespace-nowrap"
                >
                    Custom Orders
                </Link>
             </div>
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

         {/* Main Hero Image - The Chair */}
         <div className="relative z-10 w-full max-w-lg lg:max-w-xl aspect-square">
             <img 
                src={imgChair} 
                alt="Editorial Rope Chair" 
                className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"
                style={{ transform: `translate(${-offset.x}px, ${-offset.y}px)` }}
             />
             
             {/* Overlapping Decor Image - Floating Lamp */}
             <div 
                className="absolute -top-10 -right-10 w-40 md:w-56 aspect-square hidden md:block animate-float-slow"
                style={{ transform: `translate(${offset.x * 2}px, ${offset.y * 2}px)` }}
             >
                 <img src={imgDecor} alt="Decor Detail" className="w-full h-full object-contain drop-shadow-lg" />
             </div>

             {/* Badge */}
             <div className="absolute bottom-10 -left-6 md:-left-12 w-28 h-28 md:w-36 md:h-36 bg-[#93a267]/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl overflow-hidden border border-white/10">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/favicon.ico" alt="Izhaiyam" className="w-1/2 h-1/2 object-contain opacity-90" />
                 </div>
                 <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full p-2 animate-[spin_12s_linear_infinite]">
                     <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent"/>
                     <text className="text-[11px] uppercase tracking-[0.2em] font-bold fill-[#2f3e2f]">
                         <textPath href="#curve">
                          izhayam|Handloom|Furniture
                         </textPath>
                     </text>
                 </svg>
             </div>
         </div>

      </div>

    </section>
    </>
  );
}