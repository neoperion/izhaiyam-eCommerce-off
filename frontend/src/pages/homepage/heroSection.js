import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";

// Import New Editorial Images
import imgChair from "../../assets/hero/editorial_chair.png";
import imgDesktopHero from "../../assets/hero/hero.png";
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
            <section className="block lg:hidden w-full min-h-[70svh] relative overflow-hidden">

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
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img src="/favicon.ico" alt="Izhaiyam" className="w-8 h-8 object-contain opacity-90" />
                        </div>
                        <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full p-2 animate-[spin_12s_linear_infinite]">
                            <path id="curve-mobile" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
                            <text className="text-[6.5px] uppercase tracking-[0.15em] font-bold fill-white">
                                <textPath href="#curve-mobile">
                                    EST 2019 • IZHAIYAM • HANDLOOM • EST 2019 • IZHAIYAM • HANDLOOM •
                                </textPath>
                            </text>
                        </svg>
                    </div>
                </div>

                {/* Content Area - Positioned at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-8 pt-20 bg-gradient-to-t from-black/60 to-transparent">

                    {/* Main Heading */}
                    <h1 className="font-playfair text-[2.5rem] leading-[1.1] text-white tracking-tight mb-4">
                        Weaving <span className="italic text-[#c4d49a]">Comfort</span> <br />
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
                            className="flex-1 h-14 bg-[#93a267] text-white rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform font-medium text-xs sm:text-base px-2"
                        >
                            <span className="whitespace-nowrap">Explore Collection</span>
                            <ArrowUpRight size={18} className="flex-shrink-0" />
                        </Link>

                        <Link
                            to="/contactUs"
                            className="flex-1 h-14 px-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium flex items-center justify-center active:bg-white/20 transition-colors text-xs sm:text-base"
                        >
                            Custom orders
                        </Link>
                    </div>

                </div>

                {/* Swipe Up Indicator */}
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 opacity-60 animate-bounce">
                    <ChevronRight size={24} className="text-white rotate-90" />
                </div>
            </section>


            {/* ==================================================================== */}
            {/* DESKTOP LAYOUT (Visible >= 1024px) - Full Cover Hero               */}
            {/* ==================================================================== */}
            <section className="hidden lg:flex relative w-full min-h-[65vh] items-center overflow-hidden">

                {/* Full Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={imgDesktopHero}
                        alt="Izhaiyam Handloom Furniture"
                        className="w-full h-full object-cover"
                        style={{
                            objectPosition: "center center",
                            transform: `translate(${-offset.x * 0.3}px, ${-offset.y * 0.3}px) scale(1.05)`
                        }}
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 py-20">
                    <div className="max-w-2xl space-y-8">



                        {/* Main Heading */}
                        <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-white tracking-tight">
                            Weaving <br />
                            <span className="italic text-[#c4d49a]">Comfort</span> <br />
                            Into Life.
                        </h1>

                        {/* Description */}
                        <p className="font-inter text-white/80 text-lg md:text-xl leading-relaxed max-w-lg">
                            Experience the warmth of handcrafted rope furniture. Sustainable, breathable, and designed for the modern Indian home.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                to="/shop"
                                className="group relative px-8 py-4 bg-[#93a267] text-white rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
                            >
                                <span className="relative z-10 flex items-center gap-2 font-medium">
                                    Explore Collection <ArrowUpRight size={20} />
                                </span>
                                <div className="absolute inset-0 bg-[#7a8a55] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                            </Link>

                            <Link
                                to="/contactUs"
                                className="px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 backdrop-blur-sm transition-colors"
                            >
                                Custom Orders
                            </Link>
                        </div>


                    </div>
                </div>

                {/* Floating Badge - Bottom Right */}
                <div
                    className="absolute bottom-12 right-16 w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl overflow-hidden border border-white/20 z-20"
                    style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img src="/favicon.ico" alt="Izhaiyam" className="w-1/2 h-1/2 object-contain opacity-90" />
                    </div>
                    <svg viewBox="0 0 100 100" className="relative z-10 w-full h-full p-2 animate-[spin_12s_linear_infinite]">
                        <path id="curve-desktop" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
                        <text className="text-[8px] uppercase tracking-[0.10em] font-bold fill-white">
                            <textPath href="#curve-desktop">
                                EST 2019 • IZHAIYAM HANDLOOM •
                            </textPath>
                        </text>
                    </svg>
                </div>
            </section>
        </>
    );
}