import { store } from "../store";
import { setCart } from "../features/wishlistAndCartSlice";
import { toast } from "react-toastify";

export const handleCartModification = (_id, dispatch, productQuantity, isObjInCart, selectedColor = null) => {
  const { allProductsData } = store.getState().productsData;
  const { cart } = store.getState().wishlistAndCartSection;

  let newCart;
  // if the product is in the cart and productQuantity param  is true-it means u wanna add more while if it doesnt u wanna remove all.
  //  if the product is not in the cart  and productQuantity param  is true- it means u wanna add the specified quantity while if it isnt,it means u wanna add 1
  switch (isObjInCart) {
    case true:
      if (!productQuantity) {
        // REMOVE FROM CART
        const filteredCart = cart.filter((item) => {
          // If deleting a specific variant
          if (selectedColor) {
          return !(item._id === _id && (item.selectedColor?.primaryColorName === selectedColor.primaryColorName || item.selectedColor?.colorName === selectedColor.colorName));
          }
          // If deleting non-variant product
          return item._id !== _id;
        });
        newCart = [...filteredCart];
        toast("Product has been removed from cart", {
          type: "success",
          autoClose: 2000,
        });
      } else if (productQuantity) {
        // ON QUANTITY CHANGE
        newCart = [...cart];

        for (let key of newCart) {
          const isSameVariant = selectedColor
            ? key._id === _id && (key.selectedColor?.primaryColorName === selectedColor.primaryColorName || key.selectedColor?.colorName === selectedColor.colorName)
            : key._id === _id;

          if (isSameVariant) {
            const index = newCart.indexOf(key);
            newCart[index] = { ...key, quantity: newCart[index].quantity + parseInt(productQuantity) };
          }
        }
        toast("Product has been added to cart", {
          type: "success",
          autoClose: 2000,
        });
      }
      break;

    case false:
      if (!productQuantity) {
        let currentCartedProduct = allProductsData.find((productsData) => productsData._id === _id);

        // Clone and add selectedColor if exists
        if (selectedColor) {
          currentCartedProduct = { ...currentCartedProduct, selectedColor };
        }

        currentCartedProduct = {
          ...currentCartedProduct,
          quantity: 1,
        };
        newCart = [...cart, currentCartedProduct];

        toast("Product has been added to cart", {
          type: "success",
          autoClose: 2000,
        });
      } else if (productQuantity) {
        let currentCartedProduct = allProductsData.find((productsData) => productsData._id === _id);

        // Clone and add selectedColor if exists
        if (selectedColor) {
          currentCartedProduct = { ...currentCartedProduct, selectedColor };
        }

        currentCartedProduct = {
          ...currentCartedProduct,
          quantity: parseInt(productQuantity),
        };
        newCart = [...cart, currentCartedProduct];

        toast("Product has been added to cart", {
          type: "success",
          autoClose: 2000,
        });
      }

      break;
    default:
      break;
  }

  dispatch(setCart(newCart));
};
