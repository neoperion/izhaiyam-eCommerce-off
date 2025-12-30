import React from 'react';
import handMadeIcon from '../../assets/hand-made.png';
import danceIcon from '../../assets/dance.png';
import tagIcon from '../../assets/tag.png';
import cardIcon from '../../assets/card.png';
import deliveryIcon from '../../assets/express-delivery.png';

const FeaturesBadges = () => {
    const features = [
        {
            icon: handMadeIcon,
            label: 'Handcrafted by Skilled Artisans'
        },
        {
            icon: danceIcon,
            label: 'Traditional Indian Craft'
        },
        {
            icon: tagIcon,
            label: 'Fair & Transparent Pricing'
        },
        {
            icon: cardIcon,
            label: 'Secure Online Payments'
        },
        {
            icon: deliveryIcon,
            label: 'Fast and Safe Delivery'
        }
    ];

    return (
        <section className="w-full bg-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Mobile: Horizontal Scrolling */}
                <div className="lg:hidden overflow-x-auto scrollbar-hide pb-4">
                    <div className="flex gap-4 min-w-max px-2">
                        {features.map((feature, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 min-w-[140px]"
                                >
                                    <div className="mb-3 p-3 rounded-full bg-primary/10 flex items-center justify-center">
                                        <img
                                            src={feature.icon}
                                            alt={feature.label}
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    <p className="font-inter text-xs font-medium text-gray-800 leading-relaxed">
                                        {feature.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop: Grid Layout */}
                <div className="hidden lg:grid grid-cols-5 gap-8">
                    {features.map((feature, index) => {
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                            >
                                <div className="mb-4 p-4 rounded-full bg-primary/10 flex items-center justify-center">
                                    <img
                                        src={feature.icon}
                                        alt={feature.label}
                                        className="w-12 h-12 object-contain"
                                    />
                                </div>
                                <p className="font-inter text-sm font-medium text-gray-800 leading-relaxed">
                                    {feature.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesBadges;
