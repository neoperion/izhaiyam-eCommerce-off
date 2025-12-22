import React from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleWishlistModification } from "../utils/handleWishlistModification";
import { handleCartModification } from "../utils/handleCartModification";
import { isProductInCartFn, isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js";
import { motion, useAnimation } from "framer-motion";
import { primaryBtnVariant } from "../utils/animation";
import { cartTextChangeVariant } from "../utils/animation";
import { useInView } from "framer-motion";
import { useRef } from "react";

export const SingleProductBox = ({ productsData }) => {
  const { _id, title, price, image, discountPercentValue } = productsData;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);

  const dispatch = useDispatch();
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection);

  useEffect(() => {
    isProductInWishlistFn(_id, setIsWishlisted, wishlist);
  }, [wishlist]);
  useEffect(() => {
    isProductInCartFn(_id, setIsProductInCart, cart);
  }, [cart]);

  // get the discount percent value if present so as to display it
  let discountedPrice = price - (price * discountPercentValue) / 100;

  // framer animation for when its in view
  const ref = useRef(null);
  const inView = useInView(ref);

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ scale: 1 });
    } else {
      controls.start({ scale: 0.6 });
    }
  }, [controls, inView]);

  return (
    <motion.article
      ref={ref}
      animate={controls}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex flex-col bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-background overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
        />
        
        {/* Badges */}
        {discountPercentValue > 0 && (
          <div className="absolute top-3 left-3 bg-rose-700 text-primary-foreground px-3 py-1 rounded-md text-sm font-bold z-10">
            -{discountPercentValue}% OFF
          </div>
        )}

        {/* Wishlist Heart */}
        <button
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 z-10 ${
            isWishlisted ? "bg-primary text-primary-foreground" : "bg-card hover:bg-primary/10"
          }`}
          onClick={() => handleWishlistModification(_id, dispatch)}
          aria-label="Add to wishlist"
        >
          <FiHeart
            className={`w-5 h-5 transition-all ${
              isWishlisted ? "fill-current" : "stroke-foreground"
            }`}
          />
        </button>

        {/* View Details - Slide up on hover */}
        <Link
          to={`/product/${_id}`}
          className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <motion.button
            initial="initial"
            whileTap="click"
            variants={primaryBtnVariant}
            className="btn-view-details"
          >
            <BsEye className="w-5 h-5" />
            <span>View Details</span>
          </motion.button>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-foreground capitalize truncate mb-1">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-2">
          Handcrafted Furniture
        </p>

        {/* Rating (placeholder - you can integrate real ratings) */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-amber-600" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">(4.5) 89</span>
        </div>

        {/* Price */}
        {/* Price */}
        {discountPercentValue > 0 ? (
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-bold text-xl text-foreground">
              ₹{discountedPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ₹{price.toLocaleString("en-IN")}
            </span>
          </div>
        ) : (
          <span className="font-bold text-xl text-foreground mb-4 block">
            ₹{price.toLocaleString("en-IN")}
          </span>
        )}

        {/* Add to Cart Button */}
        <motion.button
          initial="initial"
          whileTap="click"
          variants={primaryBtnVariant}
          className={`btn-cart mt-auto ${
            isProductInCart ? "!bg-rose-700 !text-white" : ""
          }`}
          onClick={() => handleCartModification(_id, dispatch, null, isProductInCart)}
        >
          <motion.span
            initial="initial"
            whileTap="animate"
            variants={cartTextChangeVariant}
          >
            {isProductInCart ? "Remove from Cart" : "Add to Cart"}
          </motion.span>
        </motion.button>
      </div>
    </motion.article>
  );
};

// <article className="flex rounded-md  w-[100%] mx-auto flex-col gap-6 shadow-[0px_2px_8px_0px_#00000085] bg-[#ffffff]  relative">
// <div className="absolute p-3 bg-[#ffffff] rounded-[50%] top-[5%] right-[5%] z-[100]">
//   <FiHeart className="w-6 h-6 " />
// </div>

// <div className="w-[100%] h-[290px] bg-neutralColor relative cursor-pointer product-img-container">
//   <img
//     src="/images/ruslan-bardash-4kTbAMRAHtQ-unsplash_preview_rev_1.png"
//     alt=""
//     className="rounded-md w-[100%] h-[100%] object-cover"
//   />
//   <div className="product-img-overlay hidden absolute top-0 left-0 z-50 bg-[#0000005d] w-[100%] h-[100%]"></div>
//   <button className="absolute left-[25%] top-[50%] bg-primaryColor text-white hidden cursor-pointer rounded-md h-[44px] w-[50%] gap-1 justify-center z-[100]  items-center product-details-link">
//     <BsEye />
//     <span> view details</span>
//   </button>
// </div>
// <div className="flex justify-between px-[10%]">
//   <h4 className="font-bold text-[18px] tracking-wide">Chair Brekk</h4>
//   <div className="flex gap-[1.5px]">
//     <h5>$15.00</h5>
//     <h5>USD</h5>
//   </div>
// </div>
// <button className="w-[100%] h-[44px] mx-auto rounded-md text-[#ffffff] bg-primaryColor">Add to cart</button>
// </article>
