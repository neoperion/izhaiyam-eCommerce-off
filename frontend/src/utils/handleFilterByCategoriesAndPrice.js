// import { store } from "../store"; // Removed direct store access
import { setPlaceholderOfproductsDataCurrentlyRequested } from "../features/productSlice";

// FUNCTIONALITY FOR FILTERING BY PRICE
export const priceRangeFn = (productsDataParams, priceRange) => {
  const priceRangeArr = priceRange.split("-");

  if (priceRangeArr[1] === "") {
    let filteredProductsPrice = productsDataParams.filter(
      (productsData) => productsData.price >= Number(priceRangeArr[0])
    );
    return filteredProductsPrice;
  } else {
    let filteredProductsPrice = productsDataParams.filter(
      (productsData) => Number(priceRangeArr[0]) <= productsData.price && productsData.price <= Number(priceRangeArr[1])
    );

    return filteredProductsPrice;
  }
};

export const handleFilterByCategoriesAndPrice = (
  dispatch,
  NoOfProductsPerPage,
  currentPageNo,
  sortedAllProductsData,
  filterState, // New argument: { priceRange, selectedSubCategoryForFilter }
  doesTheFnCallNotNeedToast 
) => {
  const { priceRange, selectedSubCategoryForFilter } = filterState;

  // Check if we have any category filters
  const hasCategoryFilters = Array.isArray(selectedSubCategoryForFilter) && selectedSubCategoryForFilter.length > 0;

  if (hasCategoryFilters && priceRange) {
    // Filter by multiple categories AND price range
    let filteredProductsCategory = sortedAllProductsData.filter((productsData) => {
      // Check if product matches ANY of the selected categories
      return selectedSubCategoryForFilter.some(({ category, subCategory }) => {
        return productsData.categories[category]?.includes(subCategory);
      });
    });
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(priceRangeFn(filteredProductsCategory, priceRange)));
  } else if (!hasCategoryFilters && !priceRange) {
    // No filters selected - show all products
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(sortedAllProductsData));
  } else if (hasCategoryFilters) {
    // Filter by multiple categories only
    let filteredProductsCategory = sortedAllProductsData.filter((productsData) => {
      // Check if product matches ANY of the selected categories
      return selectedSubCategoryForFilter.some(({ category, subCategory }) => {
        return productsData.categories[category]?.includes(subCategory);
      });
    });
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(filteredProductsCategory));
  } else if (priceRange) {
    // Filter by price range only
    dispatch(setPlaceholderOfproductsDataCurrentlyRequested(priceRangeFn(sortedAllProductsData, priceRange)));
  }
};

//FILTER THE PRODUCTSDATA FROM THE SHALLOW COPY OF THE 'sortedAllProductsData' -THIS IS DONE DUE TO FACT THE 'allProductsData' IS IMMUTABLE WHILE THE FORMER CAN RECEIVE UPDATES FROM THE SORTING FUNCTIONS.IT IS DONE BY CHECKING THE VALUE OF THE 'selectedSubCategoryForFilter && priceRange' AS CRITERIA,FILTERED DATA THEN DISPATCHED INTO THE  'placeholderOfproductsDataCurrentlyRequested' WHICH IN TURN TRIGGERS THE PAGINATION FUNCTION IN THE USEEFFECT IN THE INDEX PAGE
