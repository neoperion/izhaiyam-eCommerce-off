import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleWishlistModification } from "../utils/handleWishlistModification";
import { handleCartModification } from "../utils/handleCartModification";
import { isProductInCartFn, isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js";
import { withWatermark } from "../utils/withWatermark";

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
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-none shadow-md overflow-hidden hover:shadow-lg transition-shadow">

        {/* Image Container */}
        <div className="relative bg-gradient-to-b from-orange-50 to-orange-100 aspect-square overflow-hidden group">
          <Link to={`/product/${_id}`} className="block w-full h-full">
            {/* Desktop: Hover Swap */}
            <div className="hidden lg:block w-full h-full relative">
               <img
                 src={withWatermark(productsData.images?.[0] || image)}
                 alt={title}
                 className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${productsData.images?.length > 1 ? 'group-hover:opacity-0' : ''}`}
               />
               {productsData.images?.length > 1 && (
                  <img
                    src={withWatermark(productsData.images[1])}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
               )}
            </div>

            {/* Mobile: Horizontal Scroll with Arrows */}
            <div className="lg:hidden w-full h-full relative group/mobile">
                <div 
                  className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                  id={`slider-${_id}`}
                >
                    {(productsData.images && productsData.images.length > 0 ? productsData.images : [image]).map((img, idx) => (
                        <img key={idx} src={withWatermark(img)} alt={title} className="w-full h-full flex-shrink-0 snap-center object-cover" />
                    ))}
                </div>
                {(productsData.images && productsData.images.length > 1) && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(`slider-${_id}`).scrollBy({ left: -200, behavior: 'smooth' });
                      }}
                      className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md z-10"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button 
                      onClick={(e) => {
                         e.preventDefault();
                         document.getElementById(`slider-${_id}`).scrollBy({ left: 200, behavior: 'smooth' });
                      }}
                       className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow-md z-10"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </>
                )}
            </div>
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
            Izhaiyam
          </p>

          {/* Product Name */}
          <Link to={`/product/${_id}`}>
            <h3 className="text-gray-800 font-medium text-[8px] lg:text-base mb-1 lg:mb-1 line-clamp-1 hover:text-orange-500 transition-colors leading-snug">
              {title}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex flex-wrap items-baseline gap-1.5 lg:gap-2">
            <span className="text-[12px] lg:text-lg font-medium text-gray-900">
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

