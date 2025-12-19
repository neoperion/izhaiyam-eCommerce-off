import { CategoryLists } from "./categoryLists";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { setSelectedCategory, setSelectedSubCategoryForFilter } from "../../../features/filterBySlice";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

const Index = ({ setCheckedCategoryDOM }) => {
  const [isCategorySectionOpen, setIsCategorySectionOpen] = useState(true);
  const dispatch = useDispatch();

  const { selectedSubCategoryForFilter } = useSelector((state) => state.filterByCategoryAndPrice);

  // THE MAPPED JSON TO CREATE THE CHECKBOX AND CATEGORY UI
  const productCategories = {
    "Featured Categories": ["featured", "first order deal", "discounts"],
    location: ["kitchen", "dining", "bedroom", "living room", "office", "balcony"],
    features: ["chairs", "tables", "sets", "cupboards", "lighting", "sofa", "cot", "diwan", "swing"],
    others: ["kids"],
  };

  const handleSelectCategory = (categoryTitle, subCategory) => {
    if (selectedSubCategoryForFilter === subCategory) {
      // Deselect if already selected
      dispatch(setSelectedCategory(null));
      dispatch(setSelectedSubCategoryForFilter(null));
      // We might not need setCheckedCategoryDOM anymore if we move away from DOM manipulation, 
      // but keeping it null for safety if parent uses it.
      setCheckedCategoryDOM(null);
    } else {
      // Select new
      dispatch(setSelectedCategory(categoryTitle));
      dispatch(setSelectedSubCategoryForFilter(subCategory));
      // We can't easily pass the DOM element here without the event, 
      // but the parent 'FilterBySection' uses it for 'resetFilter'.
      // We might need to adapt 'resetFilter' later or pass a ref. 
      // For now, let's assume the new UI handles its own checked state via props.
    }
  };

  return (
    <article className="flex flex-col gap-4 md:gap-5 tablet:gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-inter">Categories</h3>
        {isCategorySectionOpen ? (
          <RiArrowDropUpLine
            className=" w-8 h-6 cursor-pointer"
            onClick={() => setIsCategorySectionOpen(!isCategorySectionOpen)}
          />
        ) : (
          <RiArrowDropDownLine
            className="w-8 h-6 cursor-pointer"
            onClick={() => setIsCategorySectionOpen(!isCategorySectionOpen)}
          />
        )}
      </div>
      <AnimatePresence>
        {isCategorySectionOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ overflowY: "hidden", height: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            className="flex flex-col w-[100%]"
          >
            {Object.keys(productCategories).map((categoryTitle, index) => {
              return (
                <CategoryLists
                  key={index}
                  categoryTitle={categoryTitle}
                  subCategories={productCategories[categoryTitle]}
                  selectedSubCategory={selectedSubCategoryForFilter}
                  onSelect={handleSelectCategory}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};

export default Index;
