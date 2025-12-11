import React from "react";
import { SingleProductBox } from "../../../components/singleProductBox";

export const HomepageCategoryProducts = ({ currentlyRequestedCategories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {currentlyRequestedCategories.map((productData) => (
        <SingleProductBox productsData={productData} key={productData._id} />
      ))}
    </div>
  );
};
