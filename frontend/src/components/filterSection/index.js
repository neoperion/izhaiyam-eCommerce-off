
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoriesSection from "./CategorySection";
import { PriceRange } from "./priceRange";
import { handleFilterByCategoriesAndPrice } from "../../utils/handleFilterByCategoriesAndPrice";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetFilter } from "../../utils/resetFilter";
import { motion } from "framer-motion";
import { primaryBtnVariant } from "../../utils/animation";

export const FilterBySection = ({
  isFilterBySectionOpen,
  setIsFilterBySectionOpen,
  currentPageNo,
  NoOfProductsPerPage,
  setIsFilterFnApplied,
  variant = "sidebar", // "sidebar" | "left-drawer"
}) => {
  // DOMS OF THE CHECKED ELEM FOR UNCHECKING DURING RESET
  const [checkedCategoryDOM, setCheckedCategoryDOM] = useState(null);
  const [checkedPriceRangeDOM, setCheckedPriceRangeDOM] = useState(null);
  const [isScreenAbove1024, setIsScreenAbove1024] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  const { sortedAllProductsData, sortedSearchedProductData } = useSelector((state) => state.productsData);
  const { priceRange, selectedSubCategoryForFilter } = useSelector((state) => state.filterByCategoryAndPrice);

  //this is to distinguish between when the filter function is to display toast message and when its not to
  let theFnCallDoesNotNeedToast = true;

  // RESET FILTERS WHEN LOCATION URL CHANGES
  useEffect(() => {
    if (!location.state?.fromCategory) {
      resetFilter(checkedCategoryDOM, checkedPriceRangeDOM, location, dispatch, theFnCallDoesNotNeedToast);
    }
  }, [location.pathname]);

  // Filter in the shop page is from the sortedAllProductsData while the one in the searchpage is from sortedSearchedProductsData

  useEffect(() => {
    if (location.pathname === "/shop") {
      handleFilterByCategoriesAndPrice(
        dispatch,
        NoOfProductsPerPage,
        currentPageNo,
        sortedAllProductsData,
        sortedAllProductsData,
        { priceRange, selectedSubCategoryForFilter },
        theFnCallDoesNotNeedToast
      );
    }
  }, [location.pathname, sortedAllProductsData, selectedSubCategoryForFilter, priceRange]);

  useEffect(() => {
    if (location.pathname === "/search") {
      handleFilterByCategoriesAndPrice(
        dispatch,
        NoOfProductsPerPage,
        currentPageNo,
        sortedSearchedProductData,
        sortedSearchedProductData,
        { priceRange, selectedSubCategoryForFilter },
        theFnCallDoesNotNeedToast
      );
    }
  }, [location.pathname, sortedSearchedProductData]);

  // check if screen is larger than 1024px
  // Only for sidebar variant
  useEffect(() => {
    if (variant === "sidebar") {
      if (window.innerWidth >= 1024) {
        setIsScreenAbove1024(true);
      } else if (window.innerWidth < 1024) {
        setIsScreenAbove1024(false);
      }

      const handleResize = (e) => {
        if (e.currentTarget.innerWidth >= 1024) {
          setIsScreenAbove1024(true);
        } else if (e.currentTarget.innerWidth < 1024) {
          setIsScreenAbove1024(false);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [variant]);

  useEffect(() => {
    if (variant === "sidebar") {
      isScreenAbove1024 && setIsFilterBySectionOpen(true);
    }
  }, [isScreenAbove1024, variant]);

  // Scroll Lock for left-drawer
  useEffect(() => {
    if (variant === "left-drawer" && isFilterBySectionOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterBySectionOpen, variant]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isFilterBySectionOpen) {
        setIsFilterBySectionOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFilterBySectionOpen]);

  const isDrawer = variant === "left-drawer";

  return (
    <motion.div
      initial={{ x: isDrawer ? "-100%" : "100%" }}
      animate={{ x: isFilterBySectionOpen ? "0%" : (isDrawer ? "-100%" : "100%") }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed top-0 left-0 w-full h-screen z-[1500] 
        ${isDrawer ? "bg-black/40 backdrop-blur-sm" : "bg-black/60 lg:bg-transparent lg:static lg:h-auto lg:z-0 lg:translate-x-0"}
        ${isFilterBySectionOpen ? "translate-x-0" : (isDrawer ? "-translate-x-full" : "translate-x-full")}
        ${!isFilterBySectionOpen && !isDrawer && "lg:translate-x-0"} 
      `}
      onClick={(e) => {
        // Close if clicking overlay (only for drawer modes)
        if (e.target === e.currentTarget && (isDrawer || !isScreenAbove1024)) {
          setIsFilterBySectionOpen(false);
        }
      }}
    >
      <section
        className={`flex flex-col h-full bg-white overflow-y-auto
          ${isDrawer
            ? "w-[90%] sm:w-[400px] absolute top-0 left-0 border-r border-sage-200 shadow-2xl"
            : "w-[80%] max-w-[360px] sm:w-[60%] sm:max-w-[400px] md:w-[50%] md:max-w-[450px] lg:w-full lg:max-w-none lg:h-auto lg:static lg:shadow-none lg:border-none absolute top-0 right-0 shadow-2xl"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-sage-200 px-6 py-5 flex justify-between items-center shadow-sm">
          <h2 className="font-inter text-2xl font-bold text-sage-900">
            Filters
          </h2>
          <button
            className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-sage-100 transition-all duration-200 ${!isDrawer && "lg:hidden"}`}
            onClick={() => setIsFilterBySectionOpen(false)}
            aria-label="Close filters"
          >
            <IoCloseOutline className="w-6 h-6 text-sage-700" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
          <CategoriesSection {...{ setCheckedCategoryDOM }} />
          <PriceRange {...{ setCheckedPriceRangeDOM }} />
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-sage-200 px-6 py-4 shadow-lg">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-3 rounded-lg font-semibold border-2 border-sage-300 bg-white text-sage-700 hover:bg-sage-50 transition-all duration-200 font-inter text-sm"
              onClick={(e) => {
                resetFilter(checkedCategoryDOM, checkedPriceRangeDOM, location, dispatch);

                setIsFilterFnApplied(false);
                if (variant === "sidebar") {
                  isScreenAbove1024 ? setIsFilterBySectionOpen(true) : setIsFilterBySectionOpen(false);
                } else {
                  setIsFilterBySectionOpen(false);
                }
              }}
            >
              Clear All
            </motion.button>
            <motion.button
              initial="initial"
              whileTap="click"
              whileHover={{ scale: 1.02 }}
              variants={primaryBtnVariant}
              className="flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-xl font-inter text-sm"
              style={{ backgroundColor: '#93A267' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7d8c56'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#93A267'}
              onClick={() => {
                location.pathname === "/shop" &&
                  handleFilterByCategoriesAndPrice(dispatch, NoOfProductsPerPage, currentPageNo, sortedAllProductsData, { priceRange, selectedSubCategoryForFilter });
                location.pathname === "/search" &&
                  handleFilterByCategoriesAndPrice(
                    dispatch,
                    NoOfProductsPerPage,
                    currentPageNo,
                    sortedSearchedProductData,
                    { priceRange, selectedSubCategoryForFilter }
                  );

                setIsFilterFnApplied(true);
                if (variant === "sidebar") {
                  isScreenAbove1024 ? setIsFilterBySectionOpen(true) : setIsFilterBySectionOpen(false);
                } else {
                  setIsFilterBySectionOpen(false);
                }
              }}
            >
              Apply Filters
            </motion.button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
