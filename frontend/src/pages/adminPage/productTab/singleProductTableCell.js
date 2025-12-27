import axios from "axios";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiFillPushpin } from "react-icons/ai";
import { toast } from "react-toastify";
import { DeleteProductModal } from "./deleteProductModal";
import { EditAndupdateProductModal } from "./editAndUpdateProductModal";
import { ProductDetailsModal } from "./productDetailsAdminPage";

export const SingleProductTableCell = ({ products, serialNo, fetchProductData }) => {
  const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);
  const [isEditAndUpdateModalOn, setIsEditAndUpdateModal] = useState(false);
  const [isProductDetailsModalOn, setIsProductDetailsModalOn] = useState(false);
  const [productDetails, setProductDetails] = useState({
    _id: "",
    title: "",
    stock: "",
    price: "",
    discountPercentValue: "",
    categories: {
      "Featured Categories": [],
      location: [],
      features: [],
      others: [],
    },
    image: "",
  });
  const [isFetchingUpdatedDataLoading, setIsFetchingUpdatedDataLoading] = useState(false);

  const { _id, stock, title, price, displayOrder, isPinned } = products;

  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  const fetchSpecificProductData = async (_id, setProductDetails, setLoader) => {
    setLoader(true);
    try {
      const {
        data: { product },
      } = await axios.get(`${serverUrl}/api/v1/products/getProduct/${_id}`);

      setLoader(false);
      setProductDetails(product);
      return true;
    } catch (error) {
      setLoader(false);
      toast(error.response.data?.message || error.message, {
        type: "error",
        autoClose: 3000,
        position: "top-center",
      });
    }
  };

  const handleEditAndUpdateClick = async () => {
    let response = await fetchSpecificProductData(_id, setProductDetails, setIsFetchingUpdatedDataLoading);
    response && setIsEditAndUpdateModal(true);
  };

  const handleShowProductDetails = async () => {
    let response = await fetchSpecificProductData(_id, setProductDetails, setIsFetchingUpdatedDataLoading);
    response && setIsProductDetailsModalOn(true);
  };

  return (
    <>
      <EditAndupdateProductModal
        {...{
          isEditAndUpdateModalOn,
          setIsEditAndUpdateModal,
          productDetails,
          setProductDetails,
          setIsFetchingUpdatedDataLoading,
          isFetchingUpdatedDataLoading,
          fetchProductData,
        }}
      />
      <DeleteProductModal {...{ isDeleteModalOn, setIsDeleteModalOn, _id }} />
      <ProductDetailsModal
        {...{ isProductDetailsModalOn, setIsProductDetailsModalOn, productDetails, isFetchingUpdatedDataLoading }}
      />
      <tr className="hover:bg-lightestSecondaryColor cursor-pointer" onClick={handleShowProductDetails}>
        <td className="p-2 text-black font-inter border border-b-0 border-LightSecondaryColor">{serialNo}</td>
        <td className="p-2 text-black border border-b-0 border-LightSecondaryColor">{_id}</td>
        <td className="p-2 text-black border border-b-0 border-LightSecondaryColor">{title}</td>
        <td className="p-2 text-black border border-b-0 border-LightSecondaryColor">{price}</td>
        <td className="p-2 text-black border border-b-0 border-LightSecondaryColor">{stock}</td>
        <td className="p-2 text-black border border-b-0 border-LightSecondaryColor">
          <div className="flex items-center gap-1">
            {isPinned && <AiFillPushpin className="text-[#fca311]" />}
            <span>{displayOrder}</span>
          </div>
        </td>
        <td className="p-2  border border-b-0 border-LightSecondaryColor  ">
          <div className="flex items-center justify-center gap-2">
            {" "}
            <AiOutlineDelete
              onClick={() => setIsDeleteModalOn(true)}
              className="w-5 h-5 cursor-pointer hover:fill-lightPrimaryColor fill-primaryColor"
            />{" "}
            <AiOutlineEdit
              onClick={handleEditAndUpdateClick}
              className="w-5 h-5 cursor-pointer hover:fill-lightPrimaryColor fill-primaryColor"
            />
          </div>
        </td>
      </tr>
    </>
  );
};
