

import { RiArrowDropDownLine } from "react-icons/ri";
import { BiFilter } from "react-icons/bi";
import { SingleProductBox } from "../../components/singleProductBox";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import FooterSection from "../../components/footerSection";
import { ProductLoader } from "../../components/loaders/productLoader";
import { LoadingIndicator } from "../../components/application/loading-indicator/loading-indicator";
import { PaginationSection } from "../../components/paginationSection";
import { handlePaginationProductsPage } from "../../utils/handlePaginationProductsPage";
import { FilterBySection } from "../../components/filterSection";
import CategoriesSection from "../../components/filterSection/CategorySection";
import { PriceRange } from "../../components/filterSection/priceRange";
import { handleFilterByCategoriesAndPrice } from "../../utils/handleFilterByCategoriesAndPrice";
import { toggleSubCategory, setPriceRange } from "../../features/filterBySlice";
import { resetFilter } from "../../utils/resetFilter";
import { handleSorting } from "../../utils/handleSorting";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { Filter, ChevronDown, X } from "lucide-react";
import { motion } from "framer-motion";
import { FilterTriggerIcon } from "../../components/icons/FilterTriggerIcon";

const Index = () => {
  const [sortingCriteria, setSortingCriteria] = useState("Default: Latest");
  const [isFilterBySectionOpen, setIsFilterBySectionOpen] = useState(false);
  const [isFilterFnApplied, setIsFilterFnApplied] = useState(false);
  const [checkedCategoryDOM, setCheckedCategoryDOM] = useState(null);
  const [checkedPriceRangeDOM, setCheckedPriceRangeDOM] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    allProductsData,
    isLoading,
    placeholderOfproductsDataCurrentlyRequested,
    productsDataForCurrentPage,
    fetchingError,
    sortedAllProductsData,
  } = useSelector((state) => state.productsData);
  const { priceRange, selectedSubCategoryForFilter, selectedCategory } = useSelector(
    (state) => state.filterByCategoryAndPrice
  );

  let NoOfProductsPerPage = 12;
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // HANDLE SORTING WHEN THE APP STARTS AND ALSO WHEN SORTING CRITERIA CHANGES
  useEffect(() => {
    handleSorting(dispatch, sortingCriteria, allProductsData, NoOfProductsPerPage, currentPageNo, location.pathname);
  }, [dispatch, sortingCriteria, allProductsData]);

  // AUTO-APPLY FILTERS WHEN CATEGORY OR PRICE RANGE CHANGES (Desktop auto-filter)
  useEffect(() => {
    if (selectedSubCategoryForFilter || priceRange) {
      setIsFilterLoading(true);
      handleFilterByCategoriesAndPrice(dispatch, NoOfProductsPerPage, currentPageNo, sortedAllProductsData, { priceRange, selectedSubCategoryForFilter });
      setIsFilterFnApplied(true);
      // Brief loading state
      setTimeout(() => setIsFilterLoading(false), 300);
    } else if (!selectedSubCategoryForFilter && !priceRange && isFilterFnApplied) {
      // Reset when no filters selected
      setIsFilterLoading(true);
      handleFilterByCategoriesAndPrice(dispatch, NoOfProductsPerPage, currentPageNo, sortedAllProductsData, { priceRange, selectedSubCategoryForFilter });
      setIsFilterFnApplied(false);
      setTimeout(() => setIsFilterLoading(false), 300);
    }
  }, [selectedSubCategoryForFilter, priceRange, sortedAllProductsData]);

  // PAGINATES THE DATA WHEN VALUE  placeholderOfproductsDataCurrentlyRequested CHANGES IN THE FILTER FN
  useEffect(() => {
    handlePaginationProductsPage(
      dispatch,
      NoOfProductsPerPage,
      currentPageNo,
      placeholderOfproductsDataCurrentlyRequested
    );
  }, [currentPageNo, NoOfProductsPerPage, placeholderOfproductsDataCurrentlyRequested, dispatch]);

  // Scroll to top when page changes or component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPageNo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSortingCriteriaSelection = (e) => {
    if (e.target.dataset.list) {
      setSortingCriteria(e.target.textContent);
      e.currentTarget.classList.remove("active-sorting-lists");
    }
  };

  return (
    <>
      {/* Mobile Filter Drawer */}
      <div className="lg:hidden">
        <FilterBySection
          {...{
            isFilterBySectionOpen,
            setIsFilterBySectionOpen,
            currentPageNo,
            NoOfProductsPerPage,
            setIsFilterFnApplied,
            variant: "left-drawer",
          }}
        />
      </div>

      {/* Mobile Floating Filter Button */}
      <div className="fixed left-4 bottom-6 lg:hidden z-40">
        <button
          className="text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
          style={{ backgroundColor: '#93A267' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#7d8c56'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#93A267'; }}
          onClick={() => setIsFilterBySectionOpen(true)}
        >
          <FilterTriggerIcon className="w-5 h-5 fill-white text-white" />
        </button>
      </div>

      {/* Main Container */}
      <div className="min-h-screen bg-gray-50">
        <div className="container-page py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-sage-900 mb-3 text-center lg:text-left">
              Shop Our Collection
            </h1>
            <p className="text-sage-600 text-base md:text-lg text-center lg:text-left">
              Discover handcrafted furniture pieces for your dream space
            </p>
          </div>

          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
            <div className="hidden lg:block">
              <p className="text-sm text-sage-600 font-inter">
                <span className="font-semibold text-sage-900">
                  {placeholderOfproductsDataCurrentlyRequested.length}
                </span> Products Found
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full lg:w-auto lg:min-w-[260px] ml-auto">
              <div className="relative">
                <div
                  className={`flex items-center justify-between h-12 px-5 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${sortingCriteria !== "Default: Latest"
                    ? "bg-sage-50 text-sage-900 border-sage-400"
                    : "bg-white text-sage-900 border-sage-300 hover:border-sage-400"
                    }`}
                  onClick={(e) => {
                    e.currentTarget.nextElementSibling.classList.toggle("active-sorting-lists");
                  }}
                >
                  <span className="text-sm font-semibold font-inter">{sortingCriteria}</span>
                  <ChevronDown className="w-5 h-5 text-sage-600" />
                </div>
                <div
                  className={`hidden flex-col bg-white rounded-xl shadow-2xl border-2 border-sage-200 py-2 absolute top-full mt-2 left-0 right-0 z-50 sorting-lists overflow-hidden`}
                  onClick={(e) => handleSortingCriteriaSelection(e)}
                >
                  <li data-list="sorting-criteria" className="px-5 py-2.5 hover:bg-sage-50 cursor-pointer text-sm font-inter text-sage-900 transition-colors font-medium">
                    Default: Latest
                  </li>
                  <li data-list="sorting-criteria" className="px-5 py-2.5 hover:bg-sage-50 cursor-pointer text-sm font-inter text-sage-900 transition-colors font-medium">
                    Name: A-Z
                  </li>
                  <li data-list="sorting-criteria" className="px-5 py-2.5 hover:bg-sage-50 cursor-pointer text-sm font-inter text-sage-900 transition-colors font-medium">
                    Name: Z-A
                  </li>
                  <li data-list="sorting-criteria" className="px-5 py-2.5 hover:bg-sage-50 cursor-pointer text-sm font-inter text-sage-900 transition-colors font-medium">
                    Price: low to high
                  </li>
                  <li data-list="sorting-criteria" className="px-5 py-2.5 hover:bg-sage-50 cursor-pointer text-sm font-inter text-sage-900 transition-colors font-medium">
                    Price: high to low
                  </li>
                  <li data-list="sorting-criteria" className="px-5 py-2.5 hover:bg-sage-50 cursor-pointer text-sm font-inter text-sage-900 transition-colors font-medium">
                    Oldest
                  </li>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout: Sidebar + Products */}
          <div className="flex gap-6 items-start">
            {/* Left Sidebar Filter - Desktop Only */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white shadow-sm border border-sage-200 sticky top-0">
                {/* Filter Header */}
                <div className="bg-white border-b border-sage-200 px-6 py-4">
                  <h2 className="font-inter text-base font-bold text-sage-900 uppercase tracking-wide">
                    Filters
                  </h2>
                </div>

                {/* Filter Content */}
                <div className="px-6 py-6 space-y-6">
                  <CategoriesSection {...{ setCheckedCategoryDOM }} />
                  <PriceRange {...{ setCheckedPriceRangeDOM }} />
                </div>
              </div>
            </aside>

            {/* Products Section */}
            <div className="flex-1 w-full">
              {/* Active Filters */}
              {isFilterFnApplied && ((Array.isArray(selectedSubCategoryForFilter) && selectedSubCategoryForFilter.length > 0) || priceRange) && (
                <div className="mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-2 border-sage-200 rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-sage-900 font-inter uppercase tracking-wide">Active Filters</h3>
                      <span className="text-xs text-sage-600 font-inter">
                        {(Array.isArray(selectedSubCategoryForFilter) ? selectedSubCategoryForFilter.length : 0) + (priceRange ? 1 : 0)} filter{((Array.isArray(selectedSubCategoryForFilter) ? selectedSubCategoryForFilter.length : 0) + (priceRange ? 1 : 0)) > 1 ? 's' : ''} applied
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedSubCategoryForFilter) && selectedSubCategoryForFilter.map((item, index) => (
                        <span
                          key={index}
                          onClick={() => dispatch(toggleSubCategory(item))}
                          className="px-3 py-1 bg-sage-600 text-black rounded-full text-xs font-inter font-semibold capitalize shadow-sm flex items-center gap-1 cursor-pointer transition-colors group"
                        >
                          {item.subCategory}
                          <X size={12} className="text-black" />
                        </span>
                      ))}
                      {priceRange && (
                        <span
                          onClick={() => dispatch(setPriceRange(null))}
                          className="px-3 py-1 bg-sage-600 text-black rounded-full text-xs font-inter font-semibold shadow-sm flex items-center gap-1 cursor-pointer transition-colors group"
                        >
                          ₹{priceRange}
                          <X size={12} className="text-black" />
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Loading or Products */}
              {isLoading || isFilterLoading ? (
                <LoadingIndicator type="line-simple" size="md" label="Loading products..." />
              ) : placeholderOfproductsDataCurrentlyRequested.length > 0 ? (
                <>
                  {/* Products Grid - 3 columns on desktop */}
                  <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
                    {productsDataForCurrentPage.map((productsData, index) => {
                      return <SingleProductBox key={index} productsData={productsData} />;
                    })}
                  </section>

                  {/* Pagination */}
                  <PaginationSection {...{ setCurrentPageNo, NoOfProductsPerPage, currentPageNo }} />
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center">
                    <Filter className="w-12 h-12 text-sage-400" />
                  </div>
                  <h2 className="font-inter text-2xl md:text-3xl font-bold text-sage-900 mb-2">
                    No Products Found
                  </h2>
                  <p className="text-sage-600">Try adjusting your filters or search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </>
  );
};

export default Index;
