import React, { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { SingleProductTableCell } from "./singleProductTableCell";
import axios from "axios";
import { PaginationSectionForProductsAdminPage } from "./paginationForProductsAdmin";
import AdminLayout from '../../../components/admin/AdminLayout';
import { useNavigate } from "react-router-dom";

export const ProductManagement = () => {
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  const [lowStockProductsParams, setLowStockProductsParams] = useState({
    lowStockProducts: [],
    productsLength: 0,
    pageNo: 1,
    perPage: 10,
    isError: false,
  });
  const [getLowStockProductsLoader, setLowStockProductsLoader] = useState(false);

  const [searchParameters, setSearchParameters] = useState({ searchedProductName: "", pageNo: 1, perPage: 10 });
  const [searchedProductDataAdminPage, setSearchedProductDataAdminPage] = useState({
    productsSearchedFor: [],
    productsLength: 0,
  });
  const [closeSearchList, setCloseSearchList] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const { productsSearchedFor, productsLength } = searchedProductDataAdminPage;

  useEffect(() => {
    fetchLowStockProducts(lowStockProductsParams);
  }, []);

  const fetchLowStockProducts = async (lowStockProductsParams) => {
    const { pageNo, perPage } = lowStockProductsParams;
    setLowStockProductsLoader(true);

    try {
      const {
        data: { products, productsLength },
      } = await axios.get(`${serverUrl}/api/v1/products/sortByLowStockProducts`, {
        params: {
          pageNo: pageNo,
          perPage: perPage,
        },
      });

      setLowStockProductsParams((prevData) => {
        return { ...prevData, lowStockProducts: products, productsLength };
      });
      setLowStockProductsLoader(false);
    } catch (error) {
      setLowStockProductsParams((prevData) => {
        return { ...prevData, isError: true };
      });
      setLowStockProductsLoader(false);
    }
  };

  const searchProductFetch = async (searchParameters) => {
    const { searchedProductName, pageNo, perPage } = searchParameters;
    setCloseSearchList(false);
    setIsSearchLoading(true);
    try {
      const {
        data: { product, productsLength },
      } = await axios.get(`${serverUrl}/api/v1/products/searchProducts`, {
        params: {
          title: searchedProductName,
          pageNo: pageNo,
          perPage: perPage,
        },
      });

      setSearchedProductDataAdminPage({ productsSearchedFor: product, productsLength });

      setIsSearchLoading(false);
      return product;
    } catch (error) {
      setSearchedProductDataAdminPage({ productsSearchedFor: [], productsLength: 0 });
      setIsSearchLoading(false);
    }
  };

  return (<AdminLayout>    <section className="w-[100%] xl:px-[4%] tablet:px-[6%] px-[4%] lg:px-[2%] ">
    <div className="container mx-auto mb-4">
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 bg-primaryColor hover:bg-lightPrimaryColor text-white font-medium px-6 py-3 rounded-md transition-colors duration-300"
          onClick={() => navigate('/admin/products/add')}
        >
          <IoAddOutline className="w-5 h-5" />
          Add New Product
        </button>
      </div>
    </div>

    <div className="my-6">
      <div className="flex justify-between items-start">
        {" "}
        <div className="flex gap-4 items-center mb-4">
          <h2 className="text-black text-xl md:text-2xl font-medium">Products</h2>
        </div>
        {!closeSearchList && (
          <span
            className="text-[#fca311] font-medium hover:text-lightPrimaryColor cursor-pointer"
            onClick={() => {
              setCloseSearchList(true);
              setSearchParameters({ ...searchParameters, searchedProductName: "" });
            }}
          >
            close searchlist
          </span>
        )}
      </div>

      <div className="flex items-center mb-4">
        <input
          type="text"
          id="search-input"
          className="shadow appearance-none border rounded rounded-br-none rounded-tr-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Search"
          value={searchParameters.searchedProductName}
          onChange={(e) => setSearchParameters({ ...searchParameters, searchedProductName: e.target.value })}
          required
        />
        <button
          id="search-button"
          className="bg-[#93a267] hover:bg-[#7a8856] text-white rounded-bl-none rounded-tl-none font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          onClick={() => searchProductFetch(searchParameters)}
        >
          Search
        </button>
      </div>
      {!closeSearchList && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto min-w-[800px]">
            <thead>
              <tr className="border-b">
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Si.No</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Id</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Name</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Price</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Stock</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Order</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Modify</th>
              </tr>
            </thead>
            {isSearchLoading ? (
              <tbody>
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              </tbody>
            ) : productsLength > 0 ? (
              <tbody className="divide-y divide-gray-100">
                {productsSearchedFor.map((products, index) => {
                  const serialNo = (searchParameters.pageNo - 1) * searchParameters.perPage + index + 1;
                  return <SingleProductTableCell {...{ products, serialNo, fetchProductData: () => searchProductFetch(searchParameters) }} key={products._id} />;
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Products not found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
          </div>
        </div>
      )}
      
      {productsLength > 0 && !closeSearchList && (
        <div className="mt-4">
            <PaginationSectionForProductsAdminPage
              productsLength={productsLength}
              asyncFnParamState={searchParameters}
              asyncFn={searchProductFetch}
              setAsyncFnParamState={setSearchParameters}
            />
        </div>
      )}
    </div>

    <section>
      <h3 className="text-black text-xl md:text-2xl font-medium mb-6">
        List of products arranged from order of low stocks to the highest
      </h3>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto min-w-[800px]">
            <thead>
              <tr className="border-b">
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Si.No</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Id</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Name</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Price</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Stock</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Order</th>
                <th className="text-sm font-medium text-gray-700 p-4 bg-gray-50">Modify</th>
              </tr>
            </thead>

            {getLowStockProductsLoader ? (
              <tbody>
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              </tbody>
            ) : lowStockProductsParams.productsLength > 0 ? (
              <tbody className="divide-y divide-gray-100">
                {lowStockProductsParams.lowStockProducts.map((products, index) => {
                  const serialNo = (lowStockProductsParams.pageNo - 1) * lowStockProductsParams.perPage + index + 1;
                  return <SingleProductTableCell {...{ products, serialNo, fetchProductData: () => fetchLowStockProducts(lowStockProductsParams) }} key={products._id} />;
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    <h3 className="text-base">
                      {lowStockProductsParams.isError ? (
                        <span>
                          Error loading products{" "}
                          <span
                            className="text-primaryColor cursor-pointer ml-2 hover:text-lightPrimaryColor"
                            onClick={() => fetchLowStockProducts(lowStockProductsParams)}
                          >
                            Retry
                          </span>
                        </span>
                      ) : (
                        "Products not found"
                      )}
                    </h3>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
      <>
        {lowStockProductsParams.productsLength > 0 && (
          <PaginationSectionForProductsAdminPage
            productsLength={lowStockProductsParams.productsLength}
            asyncFnParamState={lowStockProductsParams}
            asyncFn={fetchLowStockProducts}
            setAsyncFnParamState={setLowStockProductsParams}
          />
        )}
      </>
    </section>
  </section>
  </AdminLayout>
  );
};
