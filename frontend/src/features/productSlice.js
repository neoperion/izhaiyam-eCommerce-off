import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../config";

const getCachedProducts = () => {
  try {
    const cached = localStorage.getItem("allProductsData");
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    return [];
  }
};

const cachedData = getCachedProducts();

const initialState = {
  allProductsData: cachedData,
  isLoading: cachedData.length === 0,
  placeholderOfproductsDataCurrentlyRequested: [],
  productsDataForCurrentPage: [],
  sortedAllProductsData: [],
  searchedProductData: [],
  sortedSearchedProductData: [],
  loadingOrErrorMessage: "Loading",
  fetchingError: null,
};

const serverUrl = API;

export const getAllProductsData = createAsyncThunk("products/getAllProductsData", async (_, thunkAPI) => {
  try {
    const { data } = await axios.get(serverUrl + "/api/v1/products");
    return data.products;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data?.message || error.message);
  }
});

export const productSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setPlaceholderOfproductsDataCurrentlyRequested: (state, { payload }) => {
      payload = payload ? payload : [];
      state.placeholderOfproductsDataCurrentlyRequested = payload;
    },
    setProductsDataForCurrentPage: (state, { payload }) => {
      payload = payload ? payload : [];
      state.productsDataForCurrentPage = payload;
    },
    setSortedSearchedProductData: (state, { payload }) => {
      payload = payload ? payload : [];
      state.sortedSearchedProductData = payload;
    },
    setSearchedProductData: (state, { payload }) => {
      payload = payload ? payload : [];
      state.searchedProductData = payload;
    },
    setSortedAllProductsData: (state, { payload }) => {
      payload = payload ? payload : [];
      state.sortedAllProductsData = payload;
    },
    setLoadingOrErrorMessage: (state, { payload }) => {
      payload = payload ? payload : [];
      state.loadingOrErrorMessage = payload;
    },
    // Real-time Reducers
    addProduct: (state, { payload }) => {
        state.allProductsData.unshift(payload);
        state.sortedAllProductsData.unshift(payload);
        // Also update search result if matches? Logic can be complex, keeping simple for now.
    },
    updateProduct: (state, { payload }) => {
        state.allProductsData = state.allProductsData.map(p => p._id === payload._id ? payload : p);
        state.sortedAllProductsData = state.sortedAllProductsData.map(p => p._id === payload._id ? payload : p);
        // Update current page data as well to reflect instantly
        state.productsDataForCurrentPage = state.productsDataForCurrentPage.map(p => p._id === payload._id ? payload : p);
    },
    removeProduct: (state, { payload }) => {
        state.allProductsData = state.allProductsData.filter(p => p._id !== payload);
        state.sortedAllProductsData = state.sortedAllProductsData.filter(p => p._id !== payload);
        state.productsDataForCurrentPage = state.productsDataForCurrentPage.filter(p => p._id !== payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductsData.pending, (state) => {
        // Only set loading true if we don't have data
        if (state.allProductsData.length === 0) {
          state.isLoading = true;
        }
      })
      .addCase(getAllProductsData.fulfilled, (state, { payload }) => {
        // setting the objects to empty array before fetched data is received,instead of undefined, to prevent error in Array methods in the frontend
        payload = payload ? payload : [];
        state.isLoading = false;
        state.allProductsData = payload;
        
        // Cache the new data
        try {
          localStorage.setItem("allProductsData", JSON.stringify(payload));
        } catch (e) {
          console.warn("Failed to cache products data");
        }
      })
      .addCase(getAllProductsData.rejected, (state, { payload }) => {
        state.isLoading = true;
        state.allProductsData = [];
        state.fetchingError = true;
        state.loadingOrErrorMessage = payload;
      });
  },
});

export const {
  setIsLoading,
  setPlaceholderOfproductsDataCurrentlyRequested,
  setProductsDataForCurrentPage,
  setSortedAllProductsData,
  setSearchedProductData,
  setSortedSearchedProductData,
  setLoadingOrErrorMessage,
  addProduct,
  updateProduct,
  removeProduct
} = productSlice.actions;

export default productSlice.reducer;

//  placeholderOfproductsDataCurrentlyRequested- REPRESENT THE TYPE OF PRODUCTS DATA CURRENTLY BEING REQUESTED WHICH COULD BE SORTED,SEARCHED OR FILTERED PRODUCTS DATA.
//  allProductsData-ENTIRE PRODUCTS DATA FETCHED FROM THE SERVER
// productsDataForCurrentPage=CURRENT PAGE PRODUCTS DATA OUT OF THE PAGINATED DATA
//sortedAllProductsData & sortedSearchedProductData -THIS IS THE SORTED DATA WHICH THE FILTERING AND PAGINATION FUNCTION TAKES DATA

//HOW THE SEARCH AND SHOP PAGE FNs WORKS
// AT THE START OF THE APP ALL IS FETCH
// IN THE SHOP AND SEARCH PAGE, THE SORTING FUNCTION KICKS OFF FIRSTLY AND SET THE 'sortedAllProductsData & sortedSearchedProductData' WHICH TRIGGERS THE FILTER FUNCTION AND IN THE FILTER FUNCTION  'placeholderOfproductsDataCurrentlyRequested' IS SET WHICH TRIGGERS PAGINATION
