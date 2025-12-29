import { React, useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { FullpageSpinnerLoader } from "../../../components/loaders/spinnerIcon";

export const EditAndupdateProductModal = ({
  isEditAndUpdateModalOn,
  setIsEditAndUpdateModal,
  productDetails,
  setProductDetails,
  setIsFetchingUpdatedDataLoading,
  isFetchingUpdatedDataLoading,
  fetchProductData,
}) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  const { _id, title, stock, price, discountPercentValue, categories, image, isFeatured, description, isCustomizable: initialIsCustomizable, colorVariants: initialColorVariants, displayOrder, isPinned } = productDetails;

  // Color Variants State
  const [isCustomizable, setIsCustomizable] = useState(initialIsCustomizable ? "yes" : "no");
  const [colorVariants, setColorVariants] = useState(initialColorVariants || []);
  const [newColor, setNewColor] = useState({ 
    primaryColorName: "", 
    primaryHexCode: "#000000", 
    secondaryColorName: "", 
    secondaryHexCode: "#000000",
    isDualColor: false,
    stock: 0, 
    imageUrl: "" 
  });
  const [uploadingVariantImage, setUploadingVariantImage] = useState(false);

  useEffect(() => {
    if (initialColorVariants) {
      setColorVariants(initialColorVariants);
    }
    setIsCustomizable(initialIsCustomizable ? "yes" : "no");
  }, [initialColorVariants, initialIsCustomizable]);

  const productCategories = {
    "Featured Categories": ["featured", "first order deal", "discounts"],
    location: ["kitchen", "dining", "bedroom", "living room", "office", "balcony"],
    features: ["chairs", "table", "sets", "cupboards", "lighting", "sofa", "cot", "diwan", "swing"],
    others: ["kids"],
  };

  const imgRef = useRef(null);

  const handleCategoryChange = (categoryName, selectedValue) => {
    if (selectedValue === "") {
      // If empty option selected, remove the category
      setProductDetails((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [categoryName]: [],
        },
      }));
    } else {
      // Set single selected value for that category
      setProductDetails((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [categoryName]: [selectedValue],
        },
      }));
    }
  };

  const UpdateProduct = async (e) => {
    e.preventDefault();

    setIsFetchingUpdatedDataLoading(true);

    const formData = {
      title,
      description,
      image,
      categories,
      price: parseFloat(price),
      stock: parseInt(stock),
      discountPercentValue,
      isFeatured: productDetails.isFeatured === "yes",

      isCustomizable: isCustomizable === "yes",
      displayOrder: parseInt(productDetails.displayOrder),
      isPinned: productDetails.isPinned === "yes",
      colorVariants: isCustomizable === "yes" ? colorVariants.map(c => ({
        variantName: c.variantName,
        primaryColorName: c.primaryColorName || c.colorName, // Support legacy
        primaryHexCode: c.primaryHexCode || c.hexCode, // Support legacy
        secondaryColorName: c.secondaryColorName || "",
        secondaryHexCode: c.secondaryHexCode || "",
        isDualColor: c.isDualColor || false,
        imageUrl: c.imageUrl,
        stock: parseInt(c.stock) || 0
      })) : [],
    };
    console.log("Frontend Update Payload:", formData);

    const asyncCreateProductToastId = toast.loading("product data upload in progress");

    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " ";

      const data = await axios.patch(`${serverUrl}/api/v1/products/editAndupdateProduct/${_id}`, formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          "Content-Type": "application/json",
        },
      });

      //resetting  form datas to default after submits
      imgRef.current.value = null;
      setProductDetails({
        title: "",
        stock: "",
        price: "",
        discountPercentValue: "",
        isFeatured: "no",

        isCustomizable: "no",
        displayOrder: "",
        isPinned: "no",
        description: "",
        categories: {
          "Featured Categories": [],
          location: [],
          features: [],
          others: [],
        },
        image: "",
      });

      imgRef.current.nextElementSibling.style.display = "none";

      toast.update(asyncCreateProductToastId, {
        render: "Product data has sucessfully been updated",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setIsFetchingUpdatedDataLoading(false);
      setIsEditAndUpdateModal(false);
      fetchProductData && fetchProductData();
    } catch (error) {
      let errMessage;

      if (!error?.response?.data) errMessage = error?.message;
      else {
        errMessage = error?.response?.data?.message;
      }

      toast.update(asyncCreateProductToastId, {
        render: `${errMessage} : Product data update failed`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      setIsFetchingUpdatedDataLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    let imageFile = e.currentTarget.files[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    imgRef.current.nextElementSibling.style.display = "block";
    imgRef.current.nextElementSibling.textContent = "uploading image ...";
    const asyncImgUploadToastId = toast.loading("Pls wait, product image is currently being uploaded");

    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " ";
      const { data } = await axios.post(`${serverUrl}/api/v1/products/upload`, formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const { image } = data;
      setProductDetails((prevData) => {
        return { ...prevData, image: image.src };
      });
      toast.update(asyncImgUploadToastId, {
        render: "Product image has been successfully updated",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      imgRef.current.nextElementSibling.textContent = "uploaded";
    } catch (error) {
      setProductDetails((prevData) => {
        return { ...prevData, image: "" };
      });
      let errMessage;
      if (!imageFile) errMessage = "No image selected";
      else if (!error.response.data) errMessage = error.message;
      else {
        errMessage = error.response.data.message;
      }
      toast.update(asyncImgUploadToastId, {
        render: `${errMessage} : Product image upload has failed`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      imgRef.current.nextElementSibling.textContent = "image upload failed";
    }
  };

  const handleVariantImageUpload = async (e) => {
    let imageFile = e.currentTarget.files[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    setUploadingVariantImage(true);
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData"))?.loginToken || " ";
      const { data } = await axios.post(`${serverUrl}/api/v1/products/upload`, formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const { image } = data;
      setNewColor({ ...newColor, imageUrl: image.src });
      setUploadingVariantImage(false);
      toast.success("Variant image uploaded");
    } catch (error) {
      setUploadingVariantImage(false);
      toast.error("Variant image upload failed");
    }
  };

  const addColorVariant = () => {
    if (!newColor.primaryColorName || !newColor.imageUrl) {
      toast.error("Please provide primary color name and image");
      return;
    }
    
    const isDual = !!(newColor.secondaryColorName && newColor.secondaryHexCode);
    const variantName = isDual 
      ? `${newColor.primaryColorName} + ${newColor.secondaryColorName}`
      : newColor.primaryColorName;
    
    setColorVariants([...colorVariants, { 
      ...newColor, 
      isDualColor: isDual,
      variantName 
    }]);
    
    setNewColor({ 
      primaryColorName: "", 
      primaryHexCode: "#000000", 
      secondaryColorName: "", 
      secondaryHexCode: "#000000",
      isDualColor: false,
      stock: 0, 
      imageUrl: "" 
    });
  };

  const removeColorVariant = (index) => {
    const updatedVariants = [...colorVariants];
    updatedVariants.splice(index, 1);
    setColorVariants(updatedVariants);
  };

  return (
    <>
      {" "}
      {isFetchingUpdatedDataLoading && <FullpageSpinnerLoader />}
      <div
        className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 flex items-center justify-center overflow-y-auto  h-[100vh]  z-[3000] translate-y-[100%] ${isEditAndUpdateModalOn && "translate-y-0"
          } `}
      >
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-y-auto w-[99%] h-[98%] shadow-xl transform transition-all sm:max-w-3xl sm:w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-black">Update existing product</h2>
          <AiOutlineClose
            className="w-9 h-9 fill-primaryColor absolute right-5 cursor-pointer top-5"
            onClick={() => setIsEditAndUpdateModal(false)}
          />
          <form action="" className="pt-8" onSubmit={UpdateProduct}>
            <div className="mb-6">
              <label className="block font-medium mb-2 text-black">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={title}
                onChange={(e) => {
                  setProductDetails((prevData) => {
                    return { ...prevData, title: e.target.value };
                  });
                }}
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-2 text-black">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={description}
                onChange={(e) => {
                  setProductDetails((prevData) => {
                    return { ...prevData, description: e.target.value };
                  });
                }}
                rows="4"
              />
            </div>
            <div className="mb-6 flex gap-[2%] items-end justify-between">
              <div className="w-[30%]">
                <label htmlFor="price" className="font-bold text-black">
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  value={price}
                  onChange={(e) => {
                    setProductDetails((prevData) => {
                      return { ...prevData, price: e.target.value };
                    });
                  }}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-[20%]">
                <label htmlFor="stock" className="font-bold text-black">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  value={stock}
                  onChange={(e) => {
                    setProductDetails((prevData) => {
                      return { ...prevData, stock: e.target.value };
                    });
                  }}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-[20%]">
                <label htmlFor="discount" className="font-bold text-black">
                  Discount(%)
                </label>
                <input
                  type="number"
                  id="discount"
                  value={discountPercentValue}
                  onChange={(e) => {
                    setProductDetails((prevData) => {
                      return { ...prevData, discountPercentValue: e.target.value };
                    });
                  }}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-[20%]">
                <label htmlFor="featured" className="font-bold block mb-2 text-black">Featured</label>
                <select
                  id="featured"
                  value={productDetails.isFeatured === true ? "yes" : "no"}
                  onChange={(e) => {
                    setProductDetails((prevData) => ({
                      ...prevData,
                      isFeatured: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="mb-6 flex gap-[2%] items-end justify-between">
              <div className="w-[30%]">
                <label htmlFor="displayOrder" className="font-bold text-black">
                  Display Order
                </label>
                <input
                  type="number"
                  id="displayOrder"
                  value={productDetails.displayOrder || ""}
                  onChange={(e) => {
                    setProductDetails((prevData) => {
                      return { ...prevData, displayOrder: e.target.value };
                    });
                  }}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-[30%]">
                <label htmlFor="pinned" className="font-bold block mb-2 text-black">Pin to Top</label>
                <select
                  id="pinned"
                  value={productDetails.isPinned === true ? "yes" : "no"}
                  onChange={(e) => {
                    setProductDetails((prevData) => ({
                      ...prevData,
                      isPinned: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="w-[35%]">
                <label htmlFor="customizable" className="font-bold block mb-2 text-black">Color Customization</label>
                <select
                  id="customizable"
                  value={isCustomizable}
                  onChange={(e) => setIsCustomizable(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="no">Disabled</option>
                  <option value="yes">Enabled</option>
                </select>
              </div>
            </div>

            <section>
              <h2 className="text-lg font-bold mb-2 text-black">Select product categories</h2>
              <div className="mb-6">
                <div className="grid grid-cols-1 gap-4">
                  {Object.keys(productCategories).map((categoryTitle) => {
                    return (
                      <div key={categoryTitle} className="border border-gray-300 p-3 rounded-lg">
                        <label htmlFor={categoryTitle} className="font-medium text-base mb-2 block text-black">
                          {categoryTitle}
                        </label>
                        <select
                          id={categoryTitle}
                          value={categories[categoryTitle]?.[0] || ""}
                          onChange={(e) => handleCategoryChange(categoryTitle, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">-- Select {categoryTitle} --</option>
                          {productCategories[categoryTitle].map((subCategoryTitle) => {
                            return (
                              <option key={subCategoryTitle} value={subCategoryTitle}>
                                {subCategoryTitle}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Color Variants Section */}
            {isCustomizable === "yes" && (
              <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                <h2 className="text-lg font-bold mb-4 text-black">Product Color Variants</h2>

                {/* Add New Variant */}
                <div className="flex flex-wrap gap-4 items-end mb-4 p-4 bg-gray-50 rounded">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium mb-1 text-black">Primary Color Name *</label>
                    <input
                      type="text"
                      value={newColor.primaryColorName}
                      onChange={(e) => setNewColor({ ...newColor, primaryColorName: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="e.g. Red"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">Primary Color</label>
                    <input
                      type="color"
                      value={newColor.primaryHexCode}
                      onChange={(e) => setNewColor({ ...newColor, primaryHexCode: e.target.value })}
                      className="h-[40px] w-[60px] p-1 border rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium mb-1 text-black">Secondary Color (Optional)</label>
                    <input
                      type="text"
                      value={newColor.secondaryColorName}
                      onChange={(e) => setNewColor({ ...newColor, secondaryColorName: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="e.g. Yellow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">Secondary Color</label>
                    <input
                      type="color"
                      value={newColor.secondaryHexCode}
                      onChange={(e) => setNewColor({ ...newColor, secondaryHexCode: e.target.value })}
                      className="h-[40px] w-[60px] p-1 border rounded cursor-pointer"
                    />
                  </div>
                  <div className="w-[100px]">
                    <label className="block text-sm font-medium mb-1 text-black">Stock</label>
                    <input
                      type="number"
                      value={newColor.stock}
                      onChange={(e) => setNewColor({ ...newColor, stock: e.target.value === '' ? '' : parseInt(e.target.value) })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-black">Image</label>
                    <input
                      type="file"
                      onChange={handleVariantImageUpload}
                      className="w-full text-sm"
                    />
                    {uploadingVariantImage && <span className="text-xs text-blue-500">Uploading...</span>}
                    {newColor.imageUrl && <span className="text-xs text-green-500">Image Ready</span>}
                  </div>
                  <button
                    type="button"
                    onClick={addColorVariant}
                    className="bg-[#93a267] text-white px-4 py-2 rounded hover:bg-[#7a8856] transition-colors"
                  >
                    Add Variant
                  </button>
                </div>

                {/* List Variants */}
                {colorVariants.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {colorVariants.map((variant, index) => {
                      const displayName = variant.variantName || variant.primaryColorName || variant.colorName;
                      const isDual = variant.isDualColor || (variant.secondaryColorName && variant.secondaryHexCode);
                      const primaryHex = variant.primaryHexCode || variant.hexCode;
                      const secondaryHex = variant.secondaryHexCode;
                      
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 border rounded relative">
                          <div 
                            className="w-12 h-12 rounded-full border-2 border-gray-300" 
                            style={{ 
                              background: isDual 
                                ? `linear-gradient(90deg, ${primaryHex} 50%, ${secondaryHex} 50%)`
                                : primaryHex
                            }}
                          ></div>
                          <img src={variant.imageUrl} alt={displayName} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-bold text-black">{displayName}</p>
                            <p className="text-sm text-black">Stock: {variant.stock}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeColorVariant(index)}
                            className="text-red-500 hover:text-red-700 font-bold px-2"
                          >
                            X
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="mb-10 relative">
              <div>
                <label className="block font-bold mb-2 text-black">Image</label>
                <input
                  type="file"
                  ref={imgRef}
                  className="w-full p-4 border border-gray-300 rounded-lg "
                  onChange={handleImageUpload}
                />
                <h1 className="italics absolute left-[45%] sm:left-[55%] top-[38%]  hidden text-[#93a267] bottom-4 font-bold ">
                  {" "}
                </h1>
                <h4 className="text-sm mt-2 break-all font-normal text-black">
                  {" "}
                  <span className="font-medium text-base text-black">Image path</span> -{" "}
                  <a target="_blank" rel="noreferrer" className="underline text-blue-600" href={`${image}`}>
                    {" "}
                    {image}
                  </a>
                </h4>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button type="submit" className="text-white bg-[#93a267] hover:bg-[#7a8856] px-6 py-2 rounded-lg transition-colors font-medium">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
