import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
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
        <div className="w-80 bg-white rounded-lg shadow-lg overflow-hidden font-sans flex-shrink-0">
            {/* Image Container */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-80 flex items-center justify-center overflow-hidden">
                <Link to={`/product/${_id}`} className="w-full h-full">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </Link>

                {/* Best Seller Badge */}
                {isFeatured && (
                    <div className="absolute top-3 left-3 text-white px-3 py-1 text-sm font-bold rounded font-inter" style={{ backgroundColor: '#93a267' }}>
                        Best Seller
                    </div>
                )}

                {/* Heart Icon */}
                <button
                    onClick={() => handleWishlistModification(_id, dispatch)}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${isWishlisted ? "bg-primary text-primary-foreground" : "bg-white hover:bg-primary/10"}`}
                    aria-label="Add to wishlist"
                >
                    <Heart className={`w-5 h-5 transition-all ${isWishlisted ? "fill-current" : "stroke-foreground"}`} />
                </button>
            </div>

            {/* Content Container */}
            <div className="p-4">
                {/* Title */}
                <Link to={`/product/${_id}`}>
                    <h3 className="font-inter text-sm font-semibold text-gray-800 leading-tight mb-1 line-clamp-3 hover:text-orange-500 transition-colors">
                        {title}
                    </h3>
                </Link>

                {/* Brand */}
                <p className="font-inter text-xs text-gray-600 mb-3">By Wooden Street</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                        {[...Array(Math.floor(rating || 4))].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                        ))}
                        {(rating || 4) % 1 !== 0 && (
                            <svg className="w-4 h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" opacity="0.5" />
                            </svg>
                        )}
                    </div>
                    <span className="font-inter text-xs text-gray-600">({reviews || 0})</span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-3">
                    <span className="font-inter text-lg font-bold text-gray-900">₹{discountedPrice.toLocaleString()}</span>
                    {discountPercentValue > 0 && (
                        <>
                            <span className="font-inter text-sm text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                            <span className="font-inter text-sm font-semibold text-green-600">{discountPercentValue}% Off</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedProductCard;
