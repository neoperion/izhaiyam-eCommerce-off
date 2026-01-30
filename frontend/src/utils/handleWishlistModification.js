import { store } from "../store";
import { setWishlist } from "../features/wishlistAndCartSlice";

export const handleWishlistModification = (_id, dispatch, toastSuccess, toastInfo) => {
  const { allProductsData } = store.getState().productsData;
  const { wishlist } = store.getState().wishlistAndCartSection;

  let newWishlist;
  if (wishlist.find((wishlistProduct) => wishlistProduct._id === _id)) {
    const filteredWishlist = wishlist.filter((productsData) => productsData._id !== _id);
    newWishlist = [...filteredWishlist];
    if (toastInfo) toastInfo("Removed from wishlist");
  } else {
    const currentWishlistedProduct = allProductsData.find((productsData) => productsData._id === _id);
    newWishlist = [...wishlist, currentWishlistedProduct];
    if (toastSuccess) toastSuccess("Added to wishlist");
  }
  dispatch(setWishlist(newWishlist));
};
