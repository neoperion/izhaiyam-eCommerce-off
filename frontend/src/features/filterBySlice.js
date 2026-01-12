import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSubCategoryForFilter: [], // Changed to array for multiple selections
  selectedCategory: null,
  priceRange: null,
};

export const filterBySlice = createSlice({
  name: "filterBySlice",
  initialState,
  reducers: {
    setSelectedSubCategoryForFilter: (state, { payload }) => {
      state.selectedSubCategoryForFilter = payload;
    },
    toggleSubCategory: (state, { payload }) => {
      // Ensure array exists (handle legacy null state)
      if (!Array.isArray(state.selectedSubCategoryForFilter)) {
        state.selectedSubCategoryForFilter = [];
      }

      // payload: { category, subCategory }
      const index = state.selectedSubCategoryForFilter.findIndex(
        item => item.category === payload.category && item.subCategory === payload.subCategory
      );
      if (index > -1) {
        // Remove if already selected
        state.selectedSubCategoryForFilter.splice(index, 1);
      } else {
        // Add if not selected
        state.selectedSubCategoryForFilter.push(payload);
      }
    },
    removeSubCategory: (state, { payload }) => {
      // Remove specific category by index or value
      state.selectedSubCategoryForFilter = state.selectedSubCategoryForFilter.filter(
        item => !(item.category === payload.category && item.subCategory === payload.subCategory)
      );
    },
    clearAllSubCategories: (state) => {
      state.selectedSubCategoryForFilter = [];
    },
    setSelectedCategory: (state, { payload }) => {
      state.selectedCategory = payload;
    },
    setPriceRange: (state, { payload }) => {
      state.priceRange = payload;
    },
  },
});

export const {
  setPriceRange,
  setSelectedCategory,
  setSelectedSubCategoryForFilter,
  toggleSubCategory,
  removeSubCategory,
  clearAllSubCategories
} = filterBySlice.actions;

export default filterBySlice.reducer;

//FILTER CRITERIA =
//  selectedCategory-VALUE OF THE CHECKED MAIN PRODUCT CATEGORY
// priceRange- VALUE OF SELECTED PRICE RANGE
// selectedSubCategoryForFilter- VALUE OF CHECKED SUB CATEGORY (NOW AN ARRAY)
