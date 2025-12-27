import React from "react";

export const PaginationSectionForProductsAdminPage = ({
    productsLength,
    asyncFnParamState,
    asyncFn,
    setAsyncFnParamState,
}) => {
    const { pageNo, perPage } = asyncFnParamState;

    // Calculate total number of pages
    const totalPages = Math.ceil(productsLength / perPage);

    // Generate page numbers array
    let pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleChangePageNo = (number) => {
        const updatedParams = { ...asyncFnParamState, pageNo: number };
        setAsyncFnParamState(updatedParams);
        asyncFn(updatedParams);
    };

    const handlePrevious = () => {
        if (pageNo > 1) {
            handleChangePageNo(pageNo - 1);
        }
    };

    const handleNext = () => {
        if (pageNo < totalPages) {
            handleChangePageNo(pageNo + 1);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 lg:gap-3 mt-8 mb-8">
            <button
                className="font-inter px-4 py-2 rounded-full font-medium text-sm lg:text-base transition-all duration-300 cursor-pointer bg-white text-black border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePrevious}
                disabled={pageNo === 1}
            >
                Previous
            </button>

            <span className="font-inter text-sm lg:text-base font-medium text-black mx-2">
                Page:
            </span>

            {pageNumbers.map((number, index) => {
                return (
                    <button
                        key={index}
                        className={`font-inter w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full font-semibold text-sm lg:text-base transition-all duration-300 cursor-pointer ${pageNo === number
                            ? "text-white shadow-lg"
                            : "bg-white text-black border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                        style={pageNo === number ? { backgroundColor: '#93a267' } : {}}
                        onClick={() => handleChangePageNo(number)}
                    >
                        {number}
                    </button>
                );
            })}

            <button
                className="font-inter px-4 py-2 rounded-full font-medium text-sm lg:text-base transition-all duration-300 cursor-pointer bg-white text-black border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNext}
                disabled={pageNo === totalPages}
            >
                Next
            </button>
        </div>
    );
};
