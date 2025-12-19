import { RiArrowDropDownLine } from "react-icons/ri";
import { BiFilter } from "react-icons/bi";
import { SingleProductBox } from "../../components/singleProductBox";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSearchedProductData } from "../../features/productSlice";
import { ProductsNotFound } from "./productsNotFound";
import FooterSection from "../../components/footerSection";
import { PaginationSection } from "../../components/paginationSection";
import { handlePaginationProductsPage } from "../../utils/handlePaginationProductsPage";
import { FilterBySection } from "../../components/filterSection";
import { handleSorting } from "../../utils/handleSorting";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import { Filter, ChevronDown } from "lucide-react";
import { FilterTriggerIcon } from "../../components/icons/FilterTriggerIcon";

export const SearchPage = () => {
  const [isFilterBySectionOpen, setIsFilterBySectionOpen] = useState(false);
  const [sortingCriteria, setSortingCriteria] = useState("Default: Latest");
  const [isFilterFnApplied, setIsFilterFnApplied] = useState(false);

  const dispatch = useDispatch();
  const {
    allProductsData,
    placeholderOfproductsDataCurrentlyRequested,
    productsDataForCurrentPage,
    searchedProductData,
  } = useSelector((state) => state.productsData);
  const { priceRange, selectedSubCategoryForFilter, selectedCategory } = useSelector(
    (state) => state.filterByCategoryAndPrice
  );

  const navigate = useNavigate();
  let location = useLocation();

  const locationArr = location.search.split("=");
  const prevPage = location.state === "/" || location.state === "/search" ? "home" : location.state?.replace("/", "");
  const searchValue = locationArr[1]?.toUpperCase()?.trim();

  let NoOfProductsPerPage = 10;
  const [currentPageNo, setCurrentPageNo] = useState(1);

  // DIRECTLY ACCESSING THE SEARCH PAGE TRIGGERS REDIRECTION TO HOMEPAGE
  useEffect(() => {
    !prevPage && navigate("/");
  }, []);

  // HANDLE SORTING WHEN THE APP STARTS AND ALSO WHEN SORTING CRITERIA CHANGES
  useEffect(() => {
    let SearchedProductData = allProductsData.filter((product) => {
      return product.title.toUpperCase().trim().includes(searchValue);
    });
    dispatch(setSearchedProductData(SearchedProductData));
    handleSorting(
      dispatch,
      sortingCriteria,
      SearchedProductData,
      NoOfProductsPerPage,
      currentPageNo,
      location.pathname
    );
  }, [dispatch, sortingCriteria, allProductsData, searchValue]);

  useEffect(() => {
    handlePaginationProductsPage(
      dispatch,
      NoOfProductsPerPage,
      currentPageNo,
      placeholderOfproductsDataCurrentlyRequested
    );
  }, [dispatch, NoOfProductsPerPage, currentPageNo, placeholderOfproductsDataCurrentlyRequested]);

  const handleSortingCriteriaSelection = (e) => {
    if (e.target.dataset.list) {
      setSortingCriteria(e.target.textContent);
      e.currentTarget.classList.remove("active-sorting-lists");
    }
  };

  // FOR THE 'back' BTN NAVIGATION
  const navigateToPrevPage = () => {
    if (prevPage === "home") {
      navigate("/");
    }
    if (prevPage === "shop") {
      navigate("/shop");
    }
  };

  return (
    <>
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

      {/* Mobile Trigger (Floating) */}
      <div className="fixed left-4 bottom-6 md:hidden z-40">
        <button
          className="text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 animate-pulse"
          style={{ backgroundColor: '#93A267' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#7d8c56'; e.currentTarget.classList.remove('animate-pulse'); }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#93A267'; e.currentTarget.classList.add('animate-pulse'); }}
          onClick={() => setIsFilterBySectionOpen(true)}
        >
          <FilterTriggerIcon className="w-8 h-8 fill-white text-white" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex items-start min-h-screen">
        {/* Main Product Section - Full Width */}
        <main className="flex-1 w-full">
          <div className="container-page py-8">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-sage-600 mb-6 font-inter">
              <button onClick={() => navigateToPrevPage()} className="hover:text-sage-900 transition-colors flex items-center gap-1">
                <IoIosArrowBack />
                <span className="capitalize">{prevPage}</span>
              </button>
              <IoIosArrowBack />
              <span className="text-sage-900 font-medium">Search results</span>
              {selectedSubCategoryForFilter && (
                <>
                  <IoIosArrowBack />
                  <span className="capitalize">{selectedCategory}</span>
                  <IoIosArrowBack />
                  <span className="capitalize">{selectedSubCategoryForFilter}</span>
                </>
              )}
            </div>

            {/* Page Header & Sort */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
              <div className="text-center lg:text-left">
                <h1 className="font-inter text-3xl md:text-4xl lg:text-5xl font-bold text-sage-900 mb-4">
                  Search Results
                </h1>
                <p className="text-sage-600 font-inter">
                  Showing results for: <span className="font-semibold text-sage-900">"{locationArr[1]}"</span>
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="w-full lg:w-auto lg:min-w-[280px]">
                <div className="relative">
                  <div
                    className={`flex items-center justify-between h-12 px-4 rounded-lg border-2 cursor-pointer transition-all ${sortingCriteria !== "Default: Latest"
                      ? "bg-sage-100 text-sage-900 border-sage-200"
                      : "bg-white text-sage-900 border-sage-300 hover:border-sage-500"
                      }`}
                    onClick={(e) => {
                      e.currentTarget.nextElementSibling.classList.toggle("active-sorting-lists");
                    }}
                  >
                    <span className="text-sm font-medium font-inter">{sortingCriteria}</span>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                  <div
                    className={`hidden flex-col bg-white rounded-lg shadow-xl border border-sage-200 py-2 absolute top-full mt-2 left-0 right-0 z-50 sorting-lists overflow-hidden`}
                    onClick={(e) => handleSortingCriteriaSelection(e)}
                  >
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm text-sage-900 transition-colors font-inter">
                      Default: Latest
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm text-sage-900 transition-colors font-inter">
                      Name: A-Z
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm text-sage-900 transition-colors font-inter">
                      Name: Z-A
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm text-sage-900 transition-colors font-inter">
                      Price: low to high
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm text-sage-900 transition-colors font-inter">
                      Price: high to low
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm text-sage-900 transition-colors font-inter">
                      Oldest
                    </li>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              {/* Sticky Filter Trigger (Desktop) */}
              <aside className="hidden lg:block sticky top-32 z-30">
                <div
                  className="cursor-pointer hover:scale-110 transition-transform p-2 -ml-2"
                  onClick={() => setIsFilterBySectionOpen(true)}
                  title="Open Filters"
                >
                  <FilterTriggerIcon className="w-8 h-8 text-sage-900" />
                </div>
              </aside>

              <div className="flex-1 w-full">
                {/* Active Filters */}
                {isFilterFnApplied && (selectedSubCategoryForFilter || priceRange) && (
                  <div className="mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-sage-50 border border-sage-200 rounded-xl p-4 inline-block"
                    >
                      <h3 className="text-sm font-semibold text-sage-900 mb-2 font-inter">Active Filters</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubCategoryForFilter && (
                          <span className="px-3 py-1 bg-sage-600 text-white rounded-full text-sm font-inter">
                            {selectedSubCategoryForFilter}
                          </span>
                        )}
                        {priceRange && (
                          <span className="px-3 py-1 bg-sage-600 text-white rounded-full text-sm font-inter">
                            ₹{priceRange}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Search Results or No Results */}
                {searchedProductData.length < 1 ? (
                  <ProductsNotFound searchTerm={searchValue} />
                ) : placeholderOfproductsDataCurrentlyRequested.length > 0 ? (
                  <>
                    {/* Products Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                      {productsDataForCurrentPage.map((productsData, index) => {
                        return <SingleProductBox key={index} productsData={productsData} />;
                      })}
                    </section>

                    {/* Pagination */}
                    <PaginationSection {...{ setCurrentPageNo, NoOfProductsPerPage, currentPageNo }} />
                  </>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center">
                      <Filter className="w-12 h-12 text-sage-400" />
                    </div>
                    <h2 className="font-inter text-2xl md:text-3xl font-bold text-sage-900 mb-2">
                      No Products Found
                    </h2>
                    <p className="text-sage-600 font-inter">Try adjusting your filters or search criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <FooterSection />
    </>
  );
};
