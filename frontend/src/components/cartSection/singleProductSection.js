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
      if (key._id === _id && (key.selectedColor ? key.selectedColor._id === selectedColor?._id : !selectedColor)) {
        setProductQuantityInCart(key.quantity);
      }
    }
  }, [cart, _id, selectedColor]);

  // on quantity change
  // on quantity change
  useEffect(() => {
    // Prevent update if quantity hasn't really changed or is invalid
    if(productQuantityInCart < 1) return;
    
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
    <div className="flex gap-4 border-b-[1px] border-LightSecondaryColor pb-4">
      <div
        className="w-[30%] h-[100%] bg-neutralColor relative cursor-pointer"
        onClick={() => {
          navigate(`/product/${_id}`);
          setIsCartSectionActive(false);
        }}
      >
        <img src={currentImage} alt={title} className="w-[100%] h-[100%] object-cover" />
      </div>
      <div className="w-[70%] flex flex-col justify-between gap-2 text-base">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-[18px] leading-[1.2] font-RobotoSlab capitalize">{title}</h3>
            {selectedColor && (
                 <div className="flex items-center gap-1 mt-1">
                    <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: selectedColor.hexCode }}></div>
                    <span className="text-sm text-gray-500">{selectedColor.colorName}</span>
                 </div>
            )}
          </div>
          <MdDelete
            className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => handleCartModification(_id, dispatch, null, true, selectedColor)}
          />
        </div>
        {discountPercentValue > 0 ? (
          <div className="flex gap-3">
            <h3 className="font-bold   md:text-[18px] tracking-wide">${discountedPrice.toFixed(2)}</h3>
            <h3 className="font-medium text-[14px] md:text-[16px]  tracking-wide text-lightBlack line-through">
              ${currentPrice.toFixed(2)}
            </h3>
          </div>
        ) : (
          <h3 className="font-bold   md:text-[18px] tracking-wide ">${currentPrice.toFixed(2)}</h3>
        )}
      </div>
        <input
            className="w-[20%] h-[40px] focus:outline-secondaryColor border-[2px] border-secondaryColor mx-auto rounded-sm text-secondaryColor pl-3"
            type="number"
            value={productQuantityInCart}
            onChange={(e) => setProductQuantityInCart(e.target.value)}
        />
    </div>
  );
};
