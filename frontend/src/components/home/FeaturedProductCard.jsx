import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedProductCard = ({ product, toggleWishlist, isWishlisted }) =>
{
    // Calculate original price if discount exists
    const discount = product.discountPercentValue || 0;
    let originalPrice = null;
    if (discount > 0) {
        originalPrice = Math.round(product.price * (100 / (100 - discount)));
    }

    // Determine Badge
    let badgeLabel = null;
    let badgeColorClass = '';

    if (product.isFeatured) {
        badgeLabel = 'Featured';
        badgeColorClass = 'bg-[#93a267] text-white';
    } else if (discount > 10) {
        badgeLabel = `-${discount}%`;
        badgeColorClass = 'bg-red-500 text-white';
    } else if (product.stock < 5) {
        badgeLabel = 'Limited';
        badgeColorClass = 'bg-amber-500 text-white';
    }

    // Placeholder for ratings if not available in backend yet
    const rating = product.rating || 4.5;
    const reviews = product.numOfReviews || 0;

    return (
        <div className="group relative bg-white rounded-[20px] shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden">
            {/* Image Container */}
            <Link to={`/product/${product._id}`} className="relative block aspect-[4/5] overflow-hidden bg-[#f4f1ea]">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 will-change-transform"
                />

                {/* Overlay Gradient (subtle) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                {badgeLabel && (
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm ${badgeColorClass}`}>
                            {badgeLabel}
                        </span>
                    </div>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={(e) =>
                    {
                        e.preventDefault();
                        toggleWishlist(product._id);
                    }}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
                    aria-label="Add to wishlist"
                >
                    <Heart
                        size={18}
                        className={`transition-colors duration-300 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600 hover:stroke-red-500'}`}
                    />
                </button>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Category */}
                <div className="text-[10px] font-bold tracking-[0.15em] text-[#93a267] uppercase mb-2">
                    {product.categories?.location?.[0] || 'Furniture'}
                </div>

                {/* Title */}
                <Link to={`/product/${product._id}`} className="block mb-2 group-hover:text-[#93a267] transition-colors">
                    <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center text-amber-400">
                        <Star size={14} fill="currentColor" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <span className="text-xs text-gray-400">({reviews} reviews)</span>
                </div>

                {/* Price Section - Push to bottom */}
                <div className="mt-auto flex items-baseline gap-2.5">
                    <span className="text-lg font-bold text-[#2d2d2d]">
                        ₹{product.price?.toLocaleString() || 0}
                    </span>
                    {originalPrice && (
                        <span className="text-sm text-gray-400 line-through decoration-gray-300">
                            ₹{originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeaturedProductCard;
