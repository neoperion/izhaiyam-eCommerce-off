export const isProductInCartFn = (_id, setIsProductInCart, cart, selectedColor = null) => {
  let isProductInCart;
  if (selectedColor) {
      isProductInCart = cart.some((product) => product._id === _id && product.selectedColor?.colorName === selectedColor.colorName);
  } else {
      isProductInCart = cart.some((product) => product._id === _id && !product.selectedColor);
  }
  
  if (isProductInCart) setIsProductInCart(true);
  else setIsProductInCart(false);
};

export const isProductInWishlistFn = (_id, setIsWishlisted, wishlist) => {
  setIsWishlisted(() => {
    if (wishlist.find((wishlistProduct) => wishlistProduct._id === _id)) {
      return true;
    } else {
      return false;
    }
  });
};
