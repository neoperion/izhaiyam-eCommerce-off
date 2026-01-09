import { DealOfTheMonth } from "./dealOfTheMonth";
import { HomepageCategoryProducts } from "./homepageCategoryProducts";
import { FeaturedCategories } from "./featuredCategories";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ProductLoader } from "../../../components/loaders/productLoader";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [currentlyRequestedCategories, setCurrentlyRequestedCategories] = useState([]);
  const categoryContainerRef = useRef();
  const { allProductsData, isLoading, fetchingError } = useSelector((state) => state.productsData);
  const navigate = useNavigate();

  useEffect(() => {
    shuffleArr(featuredProducts);
  }, [allProductsData]);

  const shuffleArr = (Arr) => {
    let slicedShuffledArr = Arr.sort(() => Math.random() - 0.5).slice(0, 12);
    setCurrentlyRequestedCategories(slicedShuffledArr);
  };

  const featuredProducts = allProductsData.filter((products) =>
    products.categories["Featured Categories"].includes("featured")
  );
  const firstOrderDeals = allProductsData.filter((products) =>
    products.categories["Featured Categories"].includes("first order deal")
  );
  const bestDeals = allProductsData.filter((products) =>
    products.categories["Featured Categories"].includes("discounts")
  );

  const categoriesArr = {
    featuredProducts: featuredProducts,
    firstOrderDeals: firstOrderDeals,
    bestDeals: bestDeals,
  };

  const handleCategoryClick = (e) => {
    for (let key in categoriesArr) {
      if (e.target.dataset.id === key) {
        e.target.parentElement.classList.add("homepage-active-category-tab");
        e.target.parentElement.style.order = 1;
        shuffleArr(categoriesArr[key]);

        let orderNumbering = [0, 2];
        let categoriesDomListArr = Array.from(categoryContainerRef.current.children);
        let theNonTargetedCategoryDomArr = categoriesDomListArr.filter((elem) => elem !== e.target.parentElement);
        theNonTargetedCategoryDomArr.map((elem, i) => {
          elem.classList.remove("homepage-active-category-tab");
          elem.style.order = orderNumbering[i];
          return null;
        });
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          {/* Featured Products Section */}
          <section className="section-padding bg-card">
            <div className="container-page">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                <div className="mb-6 md:mb-0">
                  <p className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase mb-3">
                    Curated Selection
                  </p>
                  <h2 className="font-inter text-3xl md:text-4xl font-semibold text-foreground">
                    Featured Products
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/shop")}
                  className="flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold"
                >
                  View All Products
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Category Tabs */}
              <div
                className="flex justify-center items-center gap-6 md:gap-12 mb-10 overflow-x-auto"
                onClick={(e) => handleCategoryClick(e)}
                ref={categoryContainerRef}
              >
                <div className="cursor-pointer order-1 transition-all duration-300 homepage-active-category-tab">
                  <h3 data-id="featuredProducts" className="text-center text-lg md:text-xl font-semibold text-foreground/80 hover:text-foreground whitespace-nowrap">
                    Featured
                  </h3>
                  <div className="bg-primary h-[3px] w-0 transition-all duration-300"></div>
                </div>
                <div className="cursor-pointer order-2 transition-all duration-300">
                  <h3 data-id="firstOrderDeals" className="text-center text-lg md:text-xl font-semibold text-foreground/80 hover:text-foreground whitespace-nowrap">
                    First Order Deals
                  </h3>
                  <div className="bg-primary h-[3px] w-0 transition-all duration-300"></div>
                </div>
                <div className="cursor-pointer order-0 transition-all duration-300">
                  <h3 data-id="bestDeals" className="text-center text-lg md:text-xl font-semibold text-foreground/80 hover:text-foreground whitespace-nowrap">
                    Best Deals
                  </h3>
                  <div className="bg-primary h-[3px] w-0 transition-all duration-300"></div>
                </div>
              </div>

              {/* Products Grid */}
              <HomepageCategoryProducts currentlyRequestedCategories={currentlyRequestedCategories} />
            </div>
          </section>

          {/* Categories Section */}
          <FeaturedCategories />
        </>
      )}
    </>
  );
};

export default Index;
