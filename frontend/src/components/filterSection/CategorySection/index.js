import { CategoryLists } from "./categoryLists";
import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { toggleSubCategory } from "../../../features/filterBySlice";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

const Index = ({ setCheckedCategoryDOM }) => {
  const [isCategorySectionOpen, setIsCategorySectionOpen] = useState(true);
  const dispatch = useDispatch();

  const { selectedSubCategoryForFilter } = useSelector((state) => state.filterByCategoryAndPrice);
  const { allProductsData } = useSelector((state) => state.productsData);

  // THE MAPPED JSON TO CREATE THE CHECKBOX AND CATEGORY UI
  const productCategories = {
    location: ["kitchen", "dining", "bedroom", "living room", "office", "balcony"],
    "Featured Categories": ["featured", "first order deal", "discounts"],
    features: ["chairs", "tables", "sets", "cupboards", "lighting", "sofa", "cot", "diwan", "swing"],
    others: ["kids"],
  };

  const handleSelectCategory = (categoryTitle, subCategory) => {
    dispatch(toggleSubCategory({ category: categoryTitle, subCategory }));
  };

  return (
    <article className="flex flex-col gap-4 md:gap-5 tablet:gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold font-inter">Categories</h3>
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
                  allProductsData={allProductsData}
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
