import { IoTrashOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { handleWishlistModification } from "../../utils/handleWishlistModification";
import { handleCartModification } from "../../utils/handleCartModification";
import { isProductInCartFn } from "../../utils/isSpecificProductInCartAndWishlist.js";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

export const SingleProductSection = ({ wishlistData, setIsWishlistActive }) => {
  const [isProductInCart, setIsProductInCart] = useState(false);
  const { cart } = useSelector((state) => state.wishlistAndCartSection);
  const { toastSuccess, toastInfo } = useToast();

  const { title, price, image, stock, _id } = wishlistData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    isProductInCartFn(_id, setIsProductInCart, cart);
  }, [cart, _id]);

  return (
    <div className="flex gap-3 border-b border-gray-100 pb-4 hover:bg-gray-50 transition-colors p-2 rounded-lg">
      <div
        className="w-24 h-24 bg-gray-50 rounded-lg cursor-pointer flex-shrink-0 overflow-hidden group"
        onClick={() => {
          navigate(`/product/${_id}`);
          setIsWishlistActive(false);
        }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3
            className="font-inter text-sm font-medium capitalize text-gray-900 line-clamp-2 mb-1 cursor-pointer hover:text-primaryColor transition-colors"
            onClick={() => {
              navigate(`/product/${_id}`);
              setIsWishlistActive(false);
            }}
          >
            {title}
          </h3>
          <p className="font-inter text-base font-semibold text-gray-900">
            ₹{price.toLocaleString("en-IN")}
          </p>
          <p className="font-inter text-xs text-gray-500 mt-1">
            {stock < 0 ? (
              <span className="text-red-500">Out of stock</span>
            ) : (
              <span className="text-green-600">{stock} in stock</span>
            )}
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            className={`flex-1 h-9 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${isProductInCart
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                : "bg-[#93a267] text-white hover:bg-[#7a8856]"
              }`}
            onClick={() => handleCartModification(_id, dispatch, null, isProductInCart)}
          >
            {isProductInCart ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            )}
          </button>

          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors border border-red-200"
            onClick={() => handleWishlistModification(_id, dispatch, toastSuccess, toastInfo)}
            aria-label="Remove from wishlist"
          >
            <IoTrashOutline className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
