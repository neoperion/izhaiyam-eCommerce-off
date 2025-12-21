import React from 'react';
import { Heart, Star, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedProductCard = ({ product, toggleWishlist, isWishlisted }) => {
    const { _id, title, price, image, discountPercentValue, rating, reviews, description, material, seatingCapacity, finish } = product;

    // Calculate discounted price
    const discountedPrice = discountPercentValue > 0
        ? price - (price * discountPercentValue) / 100
        : price;

    // Generate full description
    const fullDescription = description ||
        `${material || 'Premium Quality'} • ${seatingCapacity || 'Comfortable Seating'} • ${finish || 'Elegant Finish'}`;

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
            {/* Image Container - Square with Framed Effect */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
                <Link to={`/product/${_id}`} className="block h-full">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                {/* Discount Badge - Sage Green with Arrow */}
                {discountPercentValue > 0 && (
                    <div className="absolute top-6 left-6 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md" style={{ backgroundColor: '#93a267' }}>
                        <ArrowDown size={14} className="stroke-2 text-white" />
                        <span className="font-inter text-xs font-bold text-white">-{discountPercentValue}%</span>
                    </div>
                )}

                {/* Wishlist Heart */}
                <button
                    onClick={() => toggleWishlist(_id)}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                    aria-label="Add to wishlist"
                >
                    <Heart
                        size={20}
                        className={`transition-colors ${isWishlisted
                            ? 'fill-red-500 stroke-red-500'
                            : 'stroke-gray-600 hover:stroke-red-500'
                            }`}
                    />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Product Name */}
                <Link to={`/product/${_id}`}>
                    <h3 className="font-inter text-xl font-semibold text-gray-900 mb-2 hover:text-[#93a267] transition-colors">
                        {title}
                    </h3>
                </Link>

                {/* Full Description */}
                <p className="font-inter text-sm text-gray-600 mb-4 line-clamp-2">
                    {fullDescription}
                </p>

                {/* Star Rating with Review Count */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <Star size={16} className="fill-amber-400 stroke-amber-400" />
                        <span className="font-inter text-sm font-semibold text-gray-900">
                            {rating || 4.5}
                        </span>
                    </div>
                    <span className="font-inter text-xs text-gray-500">
                        ({reviews || 0} reviews)
                    </span>
                </div>

                {/* Price Section */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-3">
                        {/* Final Price - Bold and Large */}
                        <span className="font-inter text-2xl font-bold text-gray-900">
                            ₹{discountedPrice.toLocaleString('en-IN')}
                        </span>

                        {/* Original Price - Grey Strikethrough */}
                        {discountPercentValue > 0 && (
                            <span className="font-inter text-base text-gray-400 line-through">
                                ₹{price.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProductCard;
