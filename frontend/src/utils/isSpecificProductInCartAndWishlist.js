export const isProductInCartFn = (_id, setIsProductInCart, cart, selectedColor = null, woodType = null) => {
  const isProductInCart = cart.some((product) => {
      if (product._id !== _id) return false;

      const colorMatch = selectedColor 
        ? (product.selectedColor?.primaryColorName === selectedColor.primaryColorName || product.selectedColor?.colorName === selectedColor.colorName)
        : !product.selectedColor; // Match if no color in cart item either

      const woodMatch = woodType
        ? (product.woodType?.name === (woodType.woodType || woodType.name || woodType) || product.woodType === (woodType.woodType || woodType.name || woodType))
        : !product.woodType;

      return colorMatch && woodMatch;
  });
  
  // Directly set boolean
  setIsProductInCart(isProductInCart);
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
