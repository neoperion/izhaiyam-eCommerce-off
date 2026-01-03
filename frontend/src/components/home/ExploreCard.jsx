import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExploreCard = ({ title, image, link, category }) => {
    return (
        <div className="w-80 bg-white rounded-lg shadow-lg overflow-hidden font-sans flex-shrink-0 hover:shadow-xl transition-shadow duration-300">
            {/* Image Container - Fixed Height */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-80 flex items-center justify-center overflow-hidden">
                <Link to={link} className="w-full h-full">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Category Badge */}
                {category && (
                    <div className="absolute top-3 left-3 text-white px-3 py-1 text-sm font-bold rounded font-inter" style={{ backgroundColor: '#93a267' }}>
                        {category}
                    </div>
                )}

                {/* Explore Icon */}
                <Link
                    to={link}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 cursor-pointer shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
                >
                    <ArrowRight className="w-5 h-5 text-gray-600" />
                </Link>
            </div>

            {/* Content Container - Fixed Height */}
            <div className="p-5 h-32 flex flex-col justify-between">
                {/* Title - Fixed Lines */}
                <Link to={link}>
                    <h3 className="font-inter text-sm font-semibold text-gray-800 leading-tight line-clamp-2 hover:text-orange-500 transition-colors mb-2">
                        {title}
                    </h3>
                </Link>

                {/* Brand */}
                <p className="font-inter text-xs text-gray-600 mb-3">By Wooden Street</p>

                {/* Explore Button */}
                <Link to={link}>
                    <button className="w-full font-inter text-sm font-semibold py-2.5 px-4 rounded transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2" style={{ backgroundColor: '#93a267', color: 'white' }}>
                        Explore Now
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ExploreCard;

