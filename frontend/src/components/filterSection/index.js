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
}) => {
  // DOMS OF THE CHECKED ELEM FOR UNCHECKING DURING RESET
  const [checkedCategoryDOM, setCheckedCategoryDOM] = useState(null);
  const [checkedPriceRangeDOM, setCheckedPriceRangeDOM] = useState(null);
  const [isScreenAbove1024, setIsScreenAbove1024] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  const { sortedAllProductsData, sortedSearchedProductData } = useSelector((state) => state.productsData);

  //this is to distinguish between when the filter function is to display toast message and when its not to
  let theFnCallDoesNotNeedToast = true;

  // RESET FILTERS WHEN LOCATION URL CHANGES
  useEffect(() => {
    resetFilter(checkedCategoryDOM, checkedPriceRangeDOM, location, dispatch, theFnCallDoesNotNeedToast);
  }, [location.pathname]);

  // Filter in the shop page is from the sortedAllProductsData while the one in the searchpage is from sortedSearchedProductsData

  useEffect(() => {
    if (location.pathname === "/shop") {
      handleFilterByCategoriesAndPrice(
        dispatch,
        NoOfProductsPerPage,
        currentPageNo,
        sortedAllProductsData,
        theFnCallDoesNotNeedToast
      );
    }
  }, [location.pathname, sortedAllProductsData]);

  useEffect(() => {
    if (location.pathname === "/search") {
      handleFilterByCategoriesAndPrice(
        dispatch,
        NoOfProductsPerPage,
        currentPageNo,
        sortedSearchedProductData,
        theFnCallDoesNotNeedToast
      );
    }
  }, [location.pathname, sortedSearchedProductData]);

  // check if screen is larger than 1024px
  // the reasons for the two methods is because the first if/else checks on first render while the resize listener checks on every resize
  // REMAINDER: i need to change this to custom useState later

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsScreenAbove1024(true);
    } else if (window.innerWidth < 1024) {
      setIsScreenAbove1024(false);
    }

    window.addEventListener("resize", (e) => {
      if (e.currentTarget.innerWidth >= 1024) {
        setIsScreenAbove1024(true);
      } else if (e.currentTarget.innerWidth < 1024) {
        setIsScreenAbove1024(false);
      }
    });
  }, [isScreenAbove1024]);

  useEffect(() => {
    isScreenAbove1024 && setIsFilterBySectionOpen(true);
  }, [isScreenAbove1024]);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isFilterBySectionOpen ? "0%" : "100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed lg:static lg:translate-x-0 top-0 left-0 w-full h-screen lg:h-auto z-[1500] lg:z-0 bg-black/60 lg:bg-transparent ${
        isFilterBySectionOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <section className="flex flex-col w-[80%] max-w-[360px] sm:w-[60%] sm:max-w-[400px] md:w-[50%] md:max-w-[450px] lg:w-full lg:max-w-none h-full lg:h-auto overflow-y-auto absolute lg:static top-0 right-0 bg-white px-6 lg:px-0 pt-4 pb-12 lg:pb-0 gap-6">
        {/* Header */}
        <div className="border-b-2 border-sage-200 pb-4">
          <h2 className="font-playfair text-2xl font-bold text-sage-900 text-center lg:text-left">
            Filter Products
          </h2>
          <button
            className="absolute top-5 right-4 lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-sage-100 transition-colors"
            onClick={() => setIsFilterBySectionOpen(false)}
          >
            <IoCloseOutline className="w-6 h-6 text-sage-700" />
          </button>
        </div>
        {/* Filter Options */}
        <div className="w-full space-y-6">
          <CategoriesSection {...{ setCheckedCategoryDOM }} />
          <PriceRange {...{ setCheckedPriceRangeDOM }} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 lg:pt-4">
          <motion.button
            initial="initial"
            whileTap="click"
            variants={primaryBtnVariant}
            className="btn-primary w-full sm:w-auto sm:flex-1"
            onClick={() => {
              location.pathname === "/shop" &&
                handleFilterByCategoriesAndPrice(dispatch, NoOfProductsPerPage, currentPageNo, sortedAllProductsData);
              location.pathname === "/search" &&
                handleFilterByCategoriesAndPrice(
                  dispatch,
                  NoOfProductsPerPage,
                  currentPageNo,
                  sortedSearchedProductData
                );

              setIsFilterFnApplied(true);
              isScreenAbove1024 ? setIsFilterBySectionOpen(true) : setIsFilterBySectionOpen(false);
            }}
          >
            Apply Filters
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-outline w-full sm:w-auto sm:flex-1"
            onClick={(e) => {
              resetFilter(checkedCategoryDOM, checkedPriceRangeDOM, location, dispatch);

              setIsFilterFnApplied(false);
              isScreenAbove1024 ? setIsFilterBySectionOpen(true) : setIsFilterBySectionOpen(false);
            }}
          >
            Reset All
          </motion.button>
        </div>
      </section>
    </motion.div>
  );
};
