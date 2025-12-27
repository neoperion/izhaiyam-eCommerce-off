import { useSelector } from "react-redux";
import { useState } from "react";

export const PaginationSection = ({ setCurrentPageNo, NoOfProductsPerPage, currentPageNo }) => {
  const { placeholderOfproductsDataCurrentlyRequested } = useSelector((state) => state.productsData);

  let pageNumbers = [];
  for (let i = 1; i <= Math.ceil(placeholderOfproductsDataCurrentlyRequested.length / NoOfProductsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleChangePageNo = (number) => {
    setCurrentPageNo(number);
  };

  return (
    <div className="flex items-center justify-center gap-2 lg:gap-3 mt-12 mb-16">
      <span className="font-inter text-sm lg:text-base font-medium text-gray-700 mr-2">Page:</span>
      {pageNumbers.map((number, index) => {
        return (
          <button
            key={index}
            className={`font-inter w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full font-semibold text-sm lg:text-base transition-all duration-300 cursor-pointer ${currentPageNo === number
              ? "text-white shadow-lg"
              : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            style={currentPageNo === number ? { backgroundColor: '#93a267' } : {}}
            onClick={() => handleChangePageNo(number)}
          >
            {number}
          </button>
        );
      })}
    </div>
  );
};
