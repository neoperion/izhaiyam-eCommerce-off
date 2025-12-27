import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleWishlistModification } from "../utils/handleWishlistModification";
import { isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js";

export const SingleProductBox = ({ productsData }) => {
  const { _id, title, price, image, discountPercentValue, rating, reviews, isFeatured } = productsData;

  const [isWishlisted, setIsWishlisted] = useState(false);

  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlistAndCartSection);

  useEffect(() => {
    isProductInWishlistFn(_id, setIsWishlisted, wishlist);
  }, [wishlist, _id]);

  // Calculate discounted price
  const discountedPrice = discountPercentValue > 0
    ? price - (price * discountPercentValue) / 100
    : price;

  const originalPrice = price;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden font-sans group hover:shadow-xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-80 flex items-center justify-center overflow-hidden">
        <Link to={`/product/${_id}`} className="w-full h-full">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Best Seller Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 text-white px-3 py-1 text-sm font-bold rounded font-inter" style={{ backgroundColor: '#93a267' }}>
            Best Seller
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentValue > 0 && !isFeatured && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded font-inter">
            -{discountPercentValue}% OFF
          </div>
        )}

        {/* Heart Icon */}
        <div
          onClick={() => handleWishlistModification(_id, dispatch)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 cursor-pointer shadow-md hover:shadow-lg transition"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
        </div>
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
