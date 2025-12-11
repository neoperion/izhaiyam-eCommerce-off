import { RiArrowDropDownLine } from "react-icons/ri";
import { BiFilter } from "react-icons/bi";
import { SingleProductBox } from "../../components/singleProductBox";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import FooterSection from "../../components/footerSection";
import { ProductLoader } from "../../components/loaders/productLoader";
import { PaginationSection } from "../../components/paginationSection";
import { handlePaginationProductsPage } from "../../utils/handlePaginationProductsPage";
import { FilterBySection } from "../../components/filterSection";
import { handleSorting } from "../../utils/handleSorting";
import { IoIosArrowBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowRight, Filter, ChevronDown } from "lucide-react";

const Index = () => {
  const [sortingCriteria, setSortingCriteria] = useState("Default: Latest");
  const [isFilterBySectionOpen, setIsFilterBySectionOpen] = useState(false);
  const [isFilterFnApplied, setIsFilterFnApplied] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    allProductsData,
    isLoading,
    placeholderOfproductsDataCurrentlyRequested,
    productsDataForCurrentPage,
    fetchingError,
  } = useSelector((state) => state.productsData);
  const { priceRange, selectedSubCategoryForFilter, selectedCategory } = useSelector(
    (state) => state.filterByCategoryAndPrice
  );

  let NoOfProductsPerPage = 10;
  const [currentPageNo, setCurrentPageNo] = useState(1);

 

  // HANDLE SORTING WHEN THE APP STARTS AND ALSO WHEN SORTING CRITERIA CHANGES
  useEffect(() => {
    handleSorting(dispatch, sortingCriteria, allProductsData, NoOfProductsPerPage, currentPageNo, location.pathname);
  }, [dispatch, sortingCriteria, allProductsData]);

  // PAGINATES THE DATA WHEN VALUE  placeholderOfproductsDataCurrentlyRequested CHANGES IN THE FILTER FN
  useEffect(() => {
    handlePaginationProductsPage(
      dispatch,
      NoOfProductsPerPage,
      currentPageNo,
      placeholderOfproductsDataCurrentlyRequested
    );
  }, [currentPageNo, NoOfProductsPerPage, placeholderOfproductsDataCurrentlyRequested, dispatch]);

  const handleSortingCriteriaSelection = (e) => {
    if (e.target.dataset.list) {
      setSortingCriteria(e.target.textContent);
      e.currentTarget.classList.remove("active-sorting-lists");
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="mt-12 w-full bg-sage-50 border-b border-sage-200">
        <div className="container-page py-4">
          <div className="flex items-center gap-2 text-sm text-sage-700">
            <button onClick={() => navigate("/")} className="hover:text-sage-900 transition-colors">
              Home
            </button>
            <ArrowRight className="w-4 h-4" />
            <span className="text-sage-900 font-medium">Shop</span>
            {selectedSubCategoryForFilter && (
              <>
                <ArrowRight className="w-4 h-4" />
                <span className="text-sage-700">{selectedCategory}</span>
                <ArrowRight className="w-4 h-4" />
                <span className="text-sage-900 font-medium">{selectedSubCategoryForFilter}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex items-start min-h-screen">
        {/* Left Filter Sidebar - Fixed & Scrollable */}
        <aside className="hidden lg:block w-[280px] sticky top-0 h-screen overflow-y-auto border-r border-sage-200 bg-white">
          <div className="p-6">
            <FilterBySection
              {...{
                isFilterBySectionOpen,
                setIsFilterBySectionOpen,
                currentPageNo,
                NoOfProductsPerPage,
                setIsFilterFnApplied,
              }}
            />
          </div>
        </aside>

        {/* Right Product Section - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="container-page py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-sage-900 mb-4 text-center lg:text-left">
                Shop Our Collection
              </h1>
              <p className="text-sage-600 text-center lg:text-left">
                Discover handcrafted furniture pieces for your dream space
              </p>
            </div>

            {/* Active Filters & Sort Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              {/* Active Filters */}
              {isFilterFnApplied && (selectedSubCategoryForFilter || priceRange) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-sage-50 border border-sage-200 rounded-xl p-4"
                >
                  <h3 className="text-sm font-semibold text-sage-900 mb-2">Active Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubCategoryForFilter && (
                      <span className="px-3 py-1 bg-sage-600 text-white rounded-full text-sm">
                        {selectedSubCategoryForFilter}
                      </span>
                    )}
                    {priceRange && (
                      <span className="px-3 py-1 bg-sage-600 text-white rounded-full text-sm">
                        ${priceRange}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Sort Dropdown */}
              <div className="w-full lg:w-auto lg:min-w-[280px] mx-4 lg:mx-0">
                <div className="relative">
                  <div
                    className={`flex items-center justify-between h-12 px-4 rounded-lg border-2 cursor-pointer transition-all ${
                      sortingCriteria !== "Default: Latest"
                        ? "bg-sage-600 text-white border-sage-600"
                        : "bg-white text-sage-900 border-sage-300 hover:border-sage-500"
                    }`}
                    onClick={(e) => {
                      e.currentTarget.nextElementSibling.classList.toggle("active-sorting-lists");
                    }}
                  >
                    <span className="text-sm font-medium">{sortingCriteria}</span>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                  <div
                    className={`hidden flex-col bg-white rounded-lg shadow-xl border border-sage-200 py-2 absolute top-full mt-2 left-0 right-0 z-50 sorting-lists overflow-hidden`}
                    onClick={(e) => handleSortingCriteriaSelection(e)}
                  >
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm transition-colors">
                      Default: Latest
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm transition-colors">
                      Name: A-Z
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm transition-colors">
                      Name: Z-A
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm transition-colors">
                      Price: low to high
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm transition-colors">
                      Price: high to low
                    </li>
                    <li data-list="sorting-criteria" className="px-4 py-2 hover:bg-sage-50 cursor-pointer text-sm transition-colors">
                      Oldest
                    </li>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading or Products */}
            {isLoading ? (
              <ProductLoader />
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

                {/* Mobile Filter Button */}
                <button
                  className="fixed right-6 bottom-6 lg:hidden z-50 w-14 h-14 bg-sage-600 hover:bg-sage-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  onClick={() => setIsFilterBySectionOpen(true)}
                >
                  <Filter className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center">
                  <Filter className="w-12 h-12 text-sage-400" />
                </div>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-sage-900 mb-2">
                  No Products Found
                </h2>
                <p className="text-sage-600">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <FooterSection />
    </>
  );
};

export default Index;
