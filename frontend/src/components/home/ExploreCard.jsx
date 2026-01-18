import React from 'react';
import { Link } from 'react-router-dom';
import { withWatermark } from '../../utils/withWatermark';

const ExploreCard = ({ title, image, link, category }) =>
{
    return (
        <div className="w-full max-w-sm bg-white rounded-none shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            {/* Image Container */}
            <div className="relative bg-gradient-to-b from-orange-50 to-orange-100 aspect-square overflow-hidden">
                <Link to={link} className="block w-full h-full">
                    <img
                        src={withWatermark(image)}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Category Badge */}
                {category && (
                    <div className="absolute top-3 left-3 text-white px-3 py-1 text-[10px] lg:text-sm font-bold rounded-none font-inter" style={{ backgroundColor: '#93a267' }}>
                        {category}
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="p-3 lg:p-4 flex flex-col justify-between h-auto">
                <div>
                    {/* Brand */}
                    <p className="font-inter text-gray-500 text-[8px] lg:text-xs font-normal mb-0.5 lg:mb-1">
                        By Wooden Street
                    </p>

                    {/* Title */}
                    <Link to={link}>
                        <h3 className="font-inter text-gray-800 font-medium text-[8px] lg:text-base leading-snug line-clamp-2 hover:text-orange-500 transition-colors mb-2 lg:mb-3">
                            {title}
                        </h3>
                    </Link>
                </div>

                {/* Explore Button */}
                <Link to={link}>
                    <button className="w-full font-inter text-[10px] lg:text-sm font-semibold py-2 lg:py-2.5 px-4 rounded-none transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2" style={{ backgroundColor: '#93a267', color: 'white' }}>
                        Explore Now
                    </button>
                </Link>
            </div>
        </div>
    );
};


export default ExploreCard;

