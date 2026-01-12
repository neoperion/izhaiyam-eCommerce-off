import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const PaginationSection = ({ setCurrentPageNo, NoOfProductsPerPage, currentPageNo }) => {
  const { placeholderOfproductsDataCurrentlyRequested } = useSelector((state) => state.productsData);

  // Calculate total pages
  const totalPages = Math.ceil(placeholderOfproductsDataCurrentlyRequested.length / NoOfProductsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPageNo(newPage);

      // Scroll to top of product grid
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Don't show pagination if only 1 page
  if (totalPages <= 1) return null;

  const isPrevDisabled = currentPageNo === 1;
  const isNextDisabled = currentPageNo === totalPages;

  return (
    <div className="w-full flex justify-center my-12">
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-11 md:h-12 max-w-md w-full">
        {/* Previous Button */}
        <motion.button
          whileTap={!isPrevDisabled ? { scale: 0.95 } : {}}
          onClick={() => handlePageChange(currentPageNo - 1)}
          disabled={isPrevDisabled}
          className={`flex items-center gap-1.5 md:gap-2 font-inter text-sm md:text-base font-semibold transition-all duration-200 min-w-[80px] md:min-w-[90px] justify-center rounded-lg border-2 h-11 md:h-12 px-4
            ${isPrevDisabled
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-sage-600 border-sage-600 hover:bg-sage-50 cursor-pointer shadow-sm hover:shadow-md'
            }`}
          aria-label="Previous page"
          aria-disabled={isPrevDisabled}
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span>Prev</span>
        </motion.button>

        {/* Page Indicator */}
        <div className="flex-1 text-center">
          <span className="font-inter text-sm md:text-base font-medium text-gray-600">
            Page <span className="font-bold text-sage-900">{currentPageNo}</span> of <span className="font-bold text-sage-900">{totalPages}</span>
          </span>
        </div>

        {/* Next Button */}
        <motion.button
          whileTap={!isNextDisabled ? { scale: 0.95 } : {}}
          onClick={() => handlePageChange(currentPageNo + 1)}
          disabled={isNextDisabled}
          className={`flex items-center gap-1.5 md:gap-2 font-inter text-sm md:text-base font-semibold transition-all duration-200 min-w-[80px] md:min-w-[90px] justify-center rounded-lg border-2 h-11 md:h-12 px-4
            ${isNextDisabled
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-sage-600 border-sage-600 hover:bg-sage-50 cursor-pointer shadow-sm hover:shadow-md'
            }`}
          aria-label="Next page"
          aria-disabled={isNextDisabled}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </motion.button>
      </div>
    </div>
  );
};
