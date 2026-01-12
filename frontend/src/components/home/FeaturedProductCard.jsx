import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleWishlistModification } from '../../utils/handleWishlistModification';

const FeaturedProductCard = ({ product, isWishlisted }) => {
    const { _id, title, price, image, discountPercentValue, rating, reviews, isFeatured } = product;

    const dispatch = useDispatch();

    // Calculate discounted price
    const discountedPrice = discountPercentValue > 0
        ? price - (price * discountPercentValue) / 100
        : price;

    const originalPrice = price;

    return (
        <div className="w-full max-w-sm">
            <div className="bg-white rounded-none shadow-md overflow-hidden hover:shadow-lg transition-shadow">

                {/* Image Container */}
                <div className="relative bg-gradient-to-b from-orange-50 to-orange-100 aspect-square overflow-hidden group">
                    <Link to={`/product/${_id}`} className="block w-full h-full">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    {/* Badge */}
                    {isFeatured && (
                        <div className="absolute top-3 left-3 text-white px-3 py-1 rounded-none font-semibold text-sm" style={{ backgroundColor: '#93a267' }}>
                            Bestseller
                        </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={() => handleWishlistModification(_id, dispatch)}
                        className="absolute top-3 right-3 hover:scale-110 transition-transform"
                    >
                        <Heart
                            size={24}
                            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"}
                        />
                    </button>
                </div>

                {/* Content */}
                <div className="p-3 lg:p-4">

                    {/* Brand */}
                    <p className="text-gray-500 text-[8px] lg:text-xs font-normal mb-0.5 lg:mb-1">
                        Wooden Street
                    </p>

                    {/* Product Name */}
                    <Link to={`/product/${_id}`}>
                        <h3 className="text-gray-800 font-medium text-[8px] lg:text-base mb-1 lg:mb-2 line-clamp-2 hover:text-orange-500 transition-colors leading-snug">
                            {title}
                        </h3>
                    </Link>

                    {/* Pricing */}
                    <div className="flex flex-wrap items-baseline gap-1.5 lg:gap-2">
                        <span className="text-[10px] lg:text-lg font-medium text-gray-900">
                            ₹{discountedPrice.toLocaleString('en-IN')}
                        </span>
                        {discountPercentValue > 0 && (
                            <>
                                <span className="text-[8px] lg:text-xs text-gray-400 line-through">
                                    ₹{originalPrice.toLocaleString('en-IN')}
                                </span>
                                <span className="text-green-600 font-medium text-[8px] lg:text-xs ml-auto">
                                    {discountPercentValue}% OFF
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProductCard;
