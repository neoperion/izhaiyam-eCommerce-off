import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleWishlistModification } from "../utils/handleWishlistModification";
import { handleCartModification } from "../utils/handleCartModification";
import { isProductInCartFn, isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js";

export const SingleProductBox = ({ productsData }) => {
  const { _id, title, price, image, discountPercentValue, rating, reviews, isFeatured } = productsData;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);

  const dispatch = useDispatch();
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection);

  useEffect(() => {
    isProductInWishlistFn(_id, setIsWishlisted, wishlist);
  }, [wishlist, _id]);

  useEffect(() => {
    isProductInCartFn(_id, setIsProductInCart, cart);
  }, [cart, _id]);

  // Calculate discounted price
  const discountedPrice = discountPercentValue > 0
    ? price - (price * discountPercentValue) / 100
    : price;

  const originalPrice = price;

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden font-sans group hover:shadow-xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 aspect-square lg:aspect-[4/3] flex items-center justify-center overflow-hidden">
        <Link to={`/product/${_id}`} className="w-full h-full">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Best Seller Badge */}
        {isFeatured && (
          <div className="absolute top-2 left-2 text-white px-2 py-0.5 text-xs lg:text-sm font-bold rounded font-inter" style={{ backgroundColor: '#93a267' }}>
            Best Seller
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentValue > 0 && !isFeatured && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 text-xs lg:text-sm font-bold rounded font-inter">
            -{discountPercentValue}% OFF
          </div>
        )}

        {/* Heart Icon */}
        <div
          onClick={() => handleWishlistModification(_id, dispatch)}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 lg:p-2 cursor-pointer shadow-md hover:shadow-lg transition"
        >
          <Heart className={`w-4 h-4 lg:w-5 lg:h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
        </div>
      </div>

      {/* Content Container */}
      <div className="p-2 lg:p-3">
        {/* Title */}
        <Link to={`/product/${_id}`}>
          <h3 className="font-inter text-xs lg:text-sm font-semibold text-gray-800 leading-tight mb-1 line-clamp-2 hover:text-orange-500 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Brand */}
        <p className="font-inter text-[10px] lg:text-xs text-gray-600 mb-2 lg:mb-3">By Wooden Street</p>

        {/* Rating */}
        <div className="flex items-center gap-1 lg:gap-2 mb-2 lg:mb-3">
          <div className="flex gap-0.5">
            {[...Array(Math.floor(rating || 4))].map((_, i) => (
              <svg key={i} className="w-3 h-3 lg:w-4 lg:h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            {(rating || 4) % 1 !== 0 && (
              <svg className="w-3 h-3 lg:w-4 lg:h-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" opacity="0.5" />
              </svg>
            )}
          </div>
          <span className="font-inter text-[10px] lg:text-xs text-gray-600">({reviews || 0})</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-4">
          <span className="font-inter text-sm lg:text-lg font-bold text-gray-900">₹{discountedPrice.toLocaleString()}</span>
          {discountPercentValue > 0 && (
            <>
              <span className="font-inter text-xs lg:text-sm text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
              <span className="font-inter text-xs lg:text-sm font-semibold text-green-600">{discountPercentValue}% Off</span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className={`font-inter w-full py-2 lg:py-3 rounded-lg font-semibold text-xs lg:text-sm transition-all duration-300 ${isProductInCart
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'text-white hover:opacity-90'
            }`}
          style={!isProductInCart ? { backgroundColor: '#93a267' } : {}}
          onClick={() => handleCartModification(_id, dispatch, null, isProductInCart)}
        >
          {isProductInCart ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};
