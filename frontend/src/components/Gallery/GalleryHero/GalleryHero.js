import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './GalleryHero.css';

import mobileHeroImage from '../../../assets/features/gallryhero.png';

const GalleryHero = ({ data }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);

    return (
        <>
            {/* --- Mobile Hero (About Page Style) --- */}
            <section
                className="relative w-full h-screen md:hidden flex items-center justify-center overflow-hidden"
                style={{
                    backgroundImage: `url(${mobileHeroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-black/40 z-0"></div>

                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="font-inter text-xs font-bold tracking-[0.2em] uppercase text-[#E8F0D6] mb-4 drop-shadow-md">
                            Est. 2019
                        </p>
                        <h1 className="font-playfair text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                            Timeless<br />Craftsmanship
                        </h1>
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-8 h-0.5 bg-white/70"></div>
                            <div className="w-2 h-2 rounded-full bg-[#93a267]"></div>
                            <div className="w-8 h-0.5 bg-white/70"></div>
                        </div>
                        <p className="font-inter text-sm text-white/90 font-light max-w-xs mx-auto leading-relaxed drop-shadow-sm">
                            Immerse yourself in the artistry of Izhaiyam. Where handloom tradition meets modern living spaces.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- Desktop Hero (Existing Split Layout - Simplified) --- */}
            <section className="gallery-hero-container hidden md:flex">
                <div className="gallery-hero-split">
                    {/* Left Content Side */}
                    <div className="gallery-hero-left">
                        <div className="gallery-hero-content-wrapper">
                            <motion.div
                                className="hero-eyebrow"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="eyebrow-line"></span>
                                <span className="eyebrow-text">Est. 2019</span>
                            </motion.div>

                            <h1 className="hero-big-title">
                                <span className="block-reveal">
                                    <motion.span
                                        initial={{ y: 100 }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        Timeless
                                    </motion.span>
                                </span>
                                <span className="block-reveal highlight-font">
                                    <motion.span
                                        initial={{ y: 100 }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        Craftsmanship
                                    </motion.span>
                                </span>
                            </h1>

                            <motion.p
                                className="hero-description"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                Immerse yourself in the artistry of Izhaiyam. Where handloom tradition meets modern living spaces.
                            </motion.p>

                            <motion.div
                                className="hero-actions"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                            >
                                <button className="btn-modern-primary">
                                    Explore Collection
                                </button>
                                <button className="btn-modern-text">
                                    Watch our collection <span className="play-icon">▶</span>
                                </button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Visual Side - Simple Fixed Image */}
                    <div className="gallery-hero-right">
                        <div className="hero-visual-composition">
                            <motion.div
                                className="simple-hero-image-wrapper"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <img src={mobileHeroImage} alt="Gallery Highlight" className="hero-media-object" />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="hero-scroll-line"
                    initial={{ height: 0 }}
                    animate={{ height: 100 }}
                    transition={{ delay: 1.5, duration: 1 }}
                ></motion.div>
            </section>
        </>
    );
};

export default GalleryHero;
