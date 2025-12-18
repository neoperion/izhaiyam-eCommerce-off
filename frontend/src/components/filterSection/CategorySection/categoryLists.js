import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const CategoryLists = ({ categoryTitle, subCategories, selectedSubCategory, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if any subcategory within this category is selected
  const isCategoryActive = subCategories.includes(selectedSubCategory);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3.5 flex items-center justify-between transition-colors duration-150 hover:bg-gray-50 ${isCategoryActive ? "bg-purple-50" : ""
          }`}
        aria-expanded={isExpanded}
      >
        <span
          className={`text-sm font-semibold transition-colors capitalize ${isCategoryActive ? "text-[#9933aa]" : "text-gray-700"
            }`}
        >
          {categoryTitle}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-gray-50"
          >
            <div className="py-2 px-4 space-y-2">
              {subCategories.map((subCategory, idx) => {
                const isSelected = selectedSubCategory === subCategory;
                return (
                  <motion.label
                    key={subCategory}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelect(categoryTitle, subCategory)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer appearance-none border transition-all checked:bg-[#9933aa] checked:border-[#9933aa] relative"
                      style={{
                        backgroundImage: isSelected
                          ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                          : "none",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100%",
                      }}
                    />
                    <span
                      className={`ml-3 text-sm transition-colors capitalize ${isSelected ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"
                        }`}
                    >
                      {subCategory}
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
