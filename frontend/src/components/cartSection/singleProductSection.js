import { IoTrashOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleCartModification } from "../../utils/handleCartModification";
import { setCart } from "../../features/wishlistAndCartSlice";
import { useNavigate } from "react-router-dom";

export const SingleProductSection = ({ cartData, setIsCartSectionActive }) => {
  const { _id, title, price, image, quantity, discountPercentValue, selectedColor } = cartData;
  const currentImage = selectedColor ? selectedColor.imageUrl : image;
  const currentPrice = price;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.wishlistAndCartSection);
  const [productQuantityInCart, setProductQuantityInCart] = useState(1);

  // on load of the app set quantity to persisted quantity
  useEffect(() => {
    for (let key of cart) {
      const isSameProduct = key._id === _id;
      const isSameVariant = selectedColor
        ? key.selectedColor?.primaryColorName === selectedColor.primaryColorName || key.selectedColor?.colorName === selectedColor.colorName
        : !key.selectedColor;

      if (isSameProduct && isSameVariant) {
        setProductQuantityInCart(key.quantity);
      }
    }
  }, [cart, _id, selectedColor]);

  // on quantity change
  useEffect(() => {
    if (productQuantityInCart < 1) return;

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
  }, [productQuantityInCart, _id, selectedColor, dispatch]);

  // get the discount percent value if present
  let discountedPrice = currentPrice - (currentPrice * discountPercentValue) / 100;

  return (
    <div className="flex gap-3 border-b border-gray-100 pb-4 hover:bg-gray-50 transition-colors p-2 rounded-lg">
      <div
        className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 group"
        onClick={() => {
          navigate(`/product/${_id}`);
          setIsCartSectionActive(false);
        }}
      >
        <img
          src={currentImage}
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
              setIsCartSectionActive(false);
            }}
          >
            {title}
          </h3>

          {selectedColor && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs text-gray-500">Color:</span>
              <div
                className="w-4 h-4 rounded-full border-2 border-gray-300"
                style={{
                  background: selectedColor.isDualColor
                    ? `linear-gradient(90deg, ${selectedColor.primaryHexCode || selectedColor.hexCode} 50%, ${selectedColor.secondaryHexCode} 50%)`
                    : (selectedColor.primaryHexCode || selectedColor.hexCode)
                }}
              ></div>
              <span className="text-xs text-gray-600 font-medium">
                {selectedColor.isDualColor 
                  ? `${selectedColor.primaryColorName} + ${selectedColor.secondaryColorName}`
                  : (selectedColor.primaryColorName || selectedColor.colorName)}
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2">
            {discountPercentValue > 0 ? (
              <>
                <p className="font-inter text-base font-semibold text-gray-900">
                  ₹{discountedPrice.toFixed(2)}
                </p>
                <p className="font-inter text-xs text-gray-400 line-through">
                  ₹{currentPrice.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="font-inter text-base font-semibold text-gray-900">
                ₹{currentPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => productQuantityInCart > 1 && setProductQuantityInCart(productQuantityInCart - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              disabled={productQuantityInCart <= 1}
            >
              −
            </button>
            <span className="w-10 h-8 flex items-center justify-center font-inter font-medium text-sm text-gray-900 bg-white">
              {productQuantityInCart}
            </span>
            <button
              onClick={() => setProductQuantityInCart(productQuantityInCart + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors font-medium"
            >
              +
            </button>
          </div>

          {/* Delete Button */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
            onClick={() => handleCartModification(_id, dispatch, null, true, selectedColor)}
            aria-label="Remove from cart"
          >
            <IoTrashOutline className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
