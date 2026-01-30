import { store } from "../store";
import { setCart } from "../features/wishlistAndCartSlice";

export const handleCartModification = (_id, dispatch, productQuantity, isObjInCart, selectedColor = null, woodType = null, cartItemId = null, toastSuccess, toastInfo) => {
  const { allProductsData } = store.getState().productsData;
  const { cart } = store.getState().wishlistAndCartSection;

  let newCart;

  // Helper to generate unique ID
  const generateCartItemId = (prodId, woodObj, color) => {
    const colorPart = color ? (color.primaryColorName || color.colorName || 'noColor') : 'noColor';
    const woodPart = woodObj ? woodObj.woodType : 'noWood';
    return `${prodId}_${woodPart}_${colorPart}_${Date.now()}`;
  };

  switch (isObjInCart) {
    case true:
      // --- DELETE OR DECREASE ---
      if (!productQuantity) {
        // REMOVE FROM CART
        if (cartItemId) {
          newCart = cart.filter(item => item.cartItemId !== cartItemId);
        } else {
          newCart = cart.filter((item) => {
            if (item._id !== _id) return true;

            const colorMatch = selectedColor
              ? (item.selectedColor?.primaryColorName === selectedColor.primaryColorName || item.selectedColor?.colorName === selectedColor.colorName)
              : !item.selectedColor;
            // Check wood name match (woodType is now object)
            const woodMatch = woodType
              ? item.woodType?.woodType === woodType.woodType
              : !item.woodType;

            return !(colorMatch && woodMatch);
          });
        }
        if (toastInfo) toastInfo("Product removed from cart");

      } else if (productQuantity) {
        // ON QUANTITY CHANGE (Update)
        newCart = cart.map((item) => {
          const isMatch = cartItemId
            ? item.cartItemId === cartItemId
            : (item._id === _id &&
              (selectedColor ? (item.selectedColor?.primaryColorName === selectedColor.primaryColorName || item.selectedColor?.colorName === selectedColor.colorName) : !item.selectedColor) &&
              (woodType ? item.woodType?.woodType === woodType.woodType : !item.woodType)
            );

          if (isMatch) {
            return { ...item, quantity: item.quantity + parseInt(productQuantity) };
          }
          return item;
        });
        if (toastSuccess) toastSuccess("Cart updated");
      }
      break;

    case false:
      // --- ADD NEW ITEM ---
      {
        let currentCartedProduct = allProductsData.find((productsData) => productsData._id === _id);

        const existingItemIndex = cart.findIndex(item =>
          item._id === _id &&
          (selectedColor ? (item.selectedColor?.primaryColorName === selectedColor.primaryColorName || item.selectedColor?.colorName === selectedColor.colorName) : !item.selectedColor) &&
          (woodType ? item.woodType?.woodType === woodType.woodType : !item.woodType)
        );

        if (existingItemIndex !== -1) {
          newCart = [...cart];
          const existingItem = newCart[existingItemIndex];
          newCart[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + (parseInt(productQuantity) || 1)
          };
          if (toastSuccess) toastSuccess("Cart updated");
        } else {
          // New Item
          const newCartItemId = generateCartItemId(_id, woodType, selectedColor);

          // Determine Price (Base or Wood Variant)
          let finalPrice = currentCartedProduct.price;
          // woodType is now the object passed from ProductDetails e.g. { woodType: "Teak", price: 12000, ... }
          if (woodType && woodType.price) {
            finalPrice = woodType.price;
          } else if (woodType && currentCartedProduct.woodVariants) {
            // Fallback if passed object didn't have price for some reason
            const variant = currentCartedProduct.woodVariants.find(v => v.woodType === woodType.woodType);
            if (variant) finalPrice = variant.price;
          }

          const newItem = {
            ...currentCartedProduct,
            cartItemId: newCartItemId,
            price: finalPrice,
            quantity: parseInt(productQuantity) || 1,

            // DATA CONTRACT MANDATORY FIELDS
            wood: woodType ? {
              type: woodType.woodType, // Ensure this is the string name
              price: finalPrice
            } : {
              type: "Not Selected",
              price: 0
            },

            customization: {
              primaryColor: selectedColor ? (selectedColor.primaryColorName || selectedColor.colorName || "N/A") : "N/A",
              secondaryColor: selectedColor ? (selectedColor.secondaryColorName || "N/A") : "N/A",
              primaryHex: selectedColor ? (selectedColor.primaryHexCode || selectedColor.hexCode) : null,
              secondaryHex: selectedColor ? selectedColor.secondaryHexCode : null
            },

            // Legacy/Redux Compatibility (Optional but good for fallback)
            // We keep these so as not to break other components reading them yet, 
            // but we will mainly rely on `wood` and `customization` above.
            woodType: woodType ? { name: woodType.woodType, price: finalPrice } : null,
            selectedColor: selectedColor || null
          };

          newCart = [...cart, newItem];
          if (toastSuccess) toastSuccess("Product added to cart");
        }

      }
      break;

    default:
      return;
  }

  dispatch(setCart(newCart));
};
