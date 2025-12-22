import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleCartModification } from "../../utils/handleCartModification";
import { setCart } from "../../features/wishlistAndCartSlice";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md"; // Added MdDelete import

export const SingleProductSection = ({ cartData, setIsCartSectionActive }) => {
  const { _id, title, price, image, quantity, discountPercentValue, selectedColor } = cartData;
  const currentImage = selectedColor ? selectedColor.imageUrl : image;
  const currentPrice = price; // Assuming price doesn't change with variant for now
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.wishlistAndCartSection);
  const [productQuantityInCart, setProductQuantityInCart] = useState(1);

  // on load of the app set quantity to persisted quantity
  useEffect(() => {
    for (let key of cart) {
      // Check for both _id and selectedColor for uniqueness
      const isSameProduct = key._id === _id;
      const isSameVariant = selectedColor
        ? key.selectedColor?.colorName === selectedColor.colorName
        : !key.selectedColor;

      if (isSameProduct && isSameVariant) {
        setProductQuantityInCart(key.quantity);
      }
    }
  }, [cart, _id, selectedColor]);

  // on quantity change
  // on quantity change
  useEffect(() => {
    // Prevent update if quantity hasn't really changed or is invalid
    if (productQuantityInCart < 1) return;

    // Find if the quantity needs to be updated
    const cartItem = cart.find(item =>
      item._id === _id &&
      (item.selectedColor ? item.selectedColor._id === selectedColor?._id : !selectedColor)
    );

    if (cartItem && cartItem.quantity !== parseInt(productQuantityInCart)) {
      let newCart = [...cart];
      for (let i = 0; i < newCart.length; i++) {
        const key = newCart[i];
        if (key._id === _id && (key.selectedColor ? key.selectedColor._id === selectedColor?._id : !selectedColor)) {
          newCart[i] = { ...key, quantity: parseInt(productQuantityInCart) };
          break;
        }
      }
      dispatch(setCart(newCart));
    }
  }, [productQuantityInCart, _id, selectedColor, dispatch]); // Removed 'cart' from dependency array to prevent infinite loop

  // get the discount percent value if present so as to display it
  let discountedPrice = currentPrice - (currentPrice * discountPercentValue) / 100;

  return (
    <div className="flex gap-2 md:gap-4 border-b-[1px] border-gray-100 pb-3 md:pb-4">
      <div
        className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] bg-[#FFF7F2] rounded-md md:rounded-lg overflow-hidden relative cursor-pointer flex-shrink-0 shadow-sm"
        onClick={() => {
          navigate(`/product/${_id}`);
          setIsCartSectionActive(false);
        }}
      >
        <img src={currentImage} alt={title} className="w-[100%] h-[100%] object-cover hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 flex flex-col justify-between gap-1 md:gap-2 min-w-0">
        <div className="flex justify-between items-start gap-1 md:gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-inter font-normal text-xs md:text-base lg:text-lg leading-tight capitalize line-clamp-2 text-gray-800">{title}</h3>
            {selectedColor && (
              <div className="flex items-center gap-1 mt-0.5 md:mt-1.5">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: selectedColor.hexCode }}></div>
                <span className="font-inter text-[10px] md:text-sm text-gray-500 truncate">{selectedColor.colorName}</span>
              </div>
            )}
          </div>
          <button
            className="ml-1 p-0.5 md:p-1.5 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
            onClick={() => handleCartModification(_id, dispatch, null, true, selectedColor)}
            aria-label="Remove from cart"
          >
            <MdDelete className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>

        <div className="flex flex-col gap-1 md:gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0">
              {discountPercentValue > 0 ? (
                <div className="flex items-center gap-1 md:gap-2">
                  <h3 className="font-inter font-medium text-xs md:text-base lg:text-lg text-gray-900">${discountedPrice.toFixed(2)}</h3>
                  <h3 className="font-inter font-light text-[10px] md:text-sm text-gray-400 line-through">
                    ${currentPrice.toFixed(2)}
                  </h3>
                </div>
              ) : (
                <h3 className="font-inter font-medium text-xs md:text-base lg:text-lg text-gray-900">${currentPrice.toFixed(2)}</h3>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-200 md:border-2 rounded md:rounded-lg overflow-hidden w-fit shadow-sm">
            <button
              onClick={() => productQuantityInCart > 1 && setProductQuantityInCart(productQuantityInCart - 1)}
              className="px-1.5 md:px-3 py-0.5 md:py-1.5 text-gray-600 hover:bg-gray-50 font-inter font-medium transition-colors text-xs md:text-base"
            >
              −
            </button>
            <span className="px-1.5 md:px-3 py-0.5 md:py-1.5 font-inter font-medium text-gray-800 min-w-[28px] md:min-w-[40px] text-center border-x border-gray-200 md:border-x-2 text-xs md:text-base">
              {productQuantityInCart}
            </span>
            <button
              onClick={() => setProductQuantityInCart(productQuantityInCart + 1)}
              className="px-1.5 md:px-3 py-0.5 md:py-1.5 text-gray-600 hover:bg-gray-50 font-inter font-medium transition-colors text-xs md:text-base"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
