import React, { useRef, useState, useEffect } from 'react';
import handMadeIcon from '../../assets/hand-made.png';
import danceIcon from '../../assets/dance.png';
import tagIcon from '../../assets/tag.png';
import cardIcon from '../../assets/card.png';
import deliveryIcon from '../../assets/express-delivery.png';

const FeaturesBadges = () => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const features = [
        {
            icon: handMadeIcon,
            title: 'Handcrafted',
            description: 'By Skilled Artisans'
        },
        {
            icon: danceIcon,
            title: 'Traditional',
            description: 'Indian Craft Heritage'
        },
        {
            icon: tagIcon,
            title: 'Fair Pricing',
            description: 'Transparent & Honest'
        },
        {
            icon: cardIcon,
            title: 'Secure Payments',
            description: '100% Safe Checkout'
        },
        {
            icon: deliveryIcon,
            title: 'Fast Delivery',
            description: 'Safe & On-Time'
        }
    ];

    // Handle scroll for indicator dots
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                const scrollLeft = scrollRef.current.scrollLeft;
                const cardWidth = scrollRef.current.offsetWidth * 0.75; // Approximate card width
                const newIndex = Math.round(scrollLeft / cardWidth);
                setActiveIndex(Math.min(newIndex, features.length - 1));
            }
        };

        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [features.length]);

    return (
        <section className="w-full bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
            <div className="max-w-7xl mx-auto">

                {/* Section Header - Mobile */}
                <div className="lg:hidden text-center mb-6 px-6">
                    <p className="text-xs font-bold tracking-[0.15em] text-[#93a267] uppercase mb-1">Why Choose Us</p>
                    <h2 className="font-inter text-xl font-semibold text-gray-900">Our Promise</h2>
                </div>

                {/* Mobile & Tablet: Horizontal Swipe Carousel */}
                <div className="lg:hidden">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4 gap-4"
                        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                    >
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[72%] sm:w-[45%] md:w-[30%] snap-center"
                            >
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col items-center text-center transition-all duration-300 hover:shadow-md">
                                    {/* Icon Container */}
                                    <div className="w-16 h-16 mb-4 rounded-xl bg-[#93a267]/10 flex items-center justify-center">
                                        <img
                                            src={feature.icon}
                                            alt={feature.title}
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-inter text-sm font-semibold text-gray-900 mb-1">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="font-inter text-xs text-gray-500 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Swipe Indicator Dots */}
                    <div className="flex justify-center gap-1.5 mt-2">
                        {features.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (scrollRef.current) {
                                        const cardWidth = scrollRef.current.offsetWidth * 0.75;
                                        scrollRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
                                    }
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index
                                        ? 'w-6 bg-[#93a267]'
                                        : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to feature ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: Clean Grid Layout */}
                <div className="hidden lg:block px-6">
                    <div className="grid grid-cols-5 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-[#93a267]/30 hover:-translate-y-1"
                            >
                                {/* Icon Container */}
                                <div className="w-16 h-16 mb-4 rounded-xl bg-[#93a267]/10 flex items-center justify-center group-hover:bg-[#93a267]/20 transition-colors duration-300">
                                    <img
                                        src={feature.icon}
                                        alt={feature.title}
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>

                                {/* Title */}
                                <h3 className="font-inter text-sm font-semibold text-gray-900 mb-1">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="font-inter text-xs text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom scrollbar hide CSS */}
            <style jsx="true">{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default FeaturesBadges;
