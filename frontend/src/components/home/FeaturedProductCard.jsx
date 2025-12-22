import React, { useState } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleWishlistModification } from '../../utils/handleWishlistModification';

const FeaturedProductCard = ({ product, isWishlisted }) => {
    const { _id, title, price, image, discountPercentValue, rating, reviews, description, material, seatingCapacity, finish } = product;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const dispatch = useDispatch();

    // Calculate discounted price
    const discountedPrice = discountPercentValue > 0
        ? price - (price * discountPercentValue) / 100
        : price;

    // For now, using single image, but structure supports multiple images
    const images = [image];

    const handlePrevImage = (e) => {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = (e) => {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Generate full description
    const fullDescription = description ||
        `${material || 'Premium Quality'} • ${seatingCapacity || 'Comfortable Seating'} • ${finish || 'Elegant Finish'}`;

    return (
        <div className="w-full bg-white rounded-lg p-4">
            {/* Image Section with Navigation */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square">
                <Link to={`/product/${_id}`}>
                    <img
                        src={images[currentImageIndex]}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </Link>

                {/* Navigation Arrows - Only show if multiple images */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 transition-all"
                        >
                            <ChevronLeft size={20} className="text-gray-800" />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 transition-all"
                        >
                            <ChevronRight size={20} className="text-gray-800" />
                        </button>
                    </>
                )}

                {/* Wishlist Heart */}
                <button
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 z-10 ${isWishlisted ? "bg-primary text-primary-foreground" : "bg-card hover:bg-primary/10"
                        }`}
                    onClick={() => handleWishlistModification(_id, dispatch)}
                    aria-label="Add to wishlist"
                >
                    <Heart
                        className={`w-5 h-5 transition-all ${isWishlisted ? "fill-current" : "stroke-foreground"
                            }`}
                    />
                </button>
            </div>

            {/* Product Title */}
            <Link to={`/product/${_id}`}>
                <h3 className="text-gray-800 text-sm font-medium mb-3 leading-tight hover:text-[#93a267] transition-colors line-clamp-2">
                    {title}
                </h3>
            </Link>

            {/* Rating Section */}
            <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            className={
                                i < Math.floor(rating || 4.5)
                                    ? 'fill-orange-400 text-orange-400'
                                    : 'fill-orange-300 text-orange-300'
                            }
                        />
                    ))}
                </div>
                <span className="text-gray-600 text-sm">({reviews || 0})</span>
            </div>

            {/* Discount and Price Section */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    {discountPercentValue > 0 && (
                        <span className="text-green-600 text-sm font-semibold">↓ {discountPercentValue}%</span>
                    )}
                    <span className="text-gray-800 text-xl font-bold">
                        ₹{discountedPrice.toLocaleString('en-IN')}
                    </span>
                </div>
                {discountPercentValue > 0 && (
                    <span className="text-gray-400 text-sm line-through">
                        ₹{price.toLocaleString('en-IN')}
                    </span>
                )}
            </div>
        </div>
    );
};

export default FeaturedProductCard;
