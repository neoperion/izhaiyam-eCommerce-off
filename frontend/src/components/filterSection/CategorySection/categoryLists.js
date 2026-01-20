


import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const CategoryLists = ({ categoryTitle, subCategories, selectedSubCategory, onSelect, allProductsData }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Changed to true - open by default

  // Check if any subcategory within this category is selected
  const isCategoryActive = Array.isArray(selectedSubCategory)
    ? selectedSubCategory.some(item => item.category === categoryTitle)
    : false;

  // Helper to calculate product count
  const getProductCount = (subCategory) => {
    if (!allProductsData) return 0;
    return allProductsData.filter((product) =>
      product.categories &&
      product.categories[categoryTitle] &&
      product.categories[categoryTitle].includes(subCategory)
    ).length;
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3.5 flex items-center justify-between transition-colors duration-150 hover:bg-sage-50 ${isCategoryActive ? "bg-sage-50" : ""
          }`}
        aria-expanded={isExpanded}
      >
        <span
          className={`text-sm font-semibold font-inter transition-colors capitalize ${isCategoryActive ? "text-sage-700" : "text-gray-700"
            }`}
        >
          {categoryTitle}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={18} className={isCategoryActive ? "text-sage-600" : "text-gray-400"} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-white border-l-2 border-sage-200"
          >
            <div className="py-2 px-4 space-y-2.5"
            >
              {subCategories.map((subCategory, idx) => {
                // Check if this subcategory is in the selectedSubCategory array
                const isSelected = Array.isArray(selectedSubCategory)
                  ? selectedSubCategory.some(item => item.subCategory === subCategory)
                  : false;

                const count = getProductCount(subCategory);

                return (
                  <motion.label
                    key={subCategory}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    className="flex items-center justify-between cursor-pointer group py-1"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(categoryTitle, subCategory)}
                        className="w-4 h-4 rounded border-gray-300 text-sage-600 focus:ring-sage-500 cursor-pointer accent-sage-600 transition-all hover:border-sage-400"
                      />
                      <span
                        className={`ml-3 text-sm font-inter transition-colors capitalize ${isSelected ? "text-sage-900 font-semibold" : "text-gray-600 group-hover:text-gray-900"
                          }`}
                      >
                        {subCategory}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </motion.label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
