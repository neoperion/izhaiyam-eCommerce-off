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
}) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

  const { _id, title, stock, price, discountPercentValue, categories, image, isFeatured, description, isCustomizable: initialIsCustomizable, colorVariants: initialColorVariants } = productDetails;
  
  // Color Variants State
  const [isCustomizable, setIsCustomizable] = useState(initialIsCustomizable || false);
  const [colorVariants, setColorVariants] = useState(initialColorVariants || []);
  const [newColor, setNewColor] = useState({ colorName: "", hexCode: "#000000", stock: 0, image: null, imageUrl: "" });
  const [uploadingVariantImage, setUploadingVariantImage] = useState(false);

  useEffect(() => {
    if (initialColorVariants) {
        setColorVariants(initialColorVariants);
    }
    setIsCustomizable(initialIsCustomizable || false);
  }, [initialColorVariants, initialIsCustomizable]);

  const productCategories = {
    "Featured Categories": ["featured", "first order deal", "discounts"],
    location: ["kitchen", "dining", "bedroom", "living room", "office", "balcony"],
    features: ["chairs", "table", "sets", "cupboards", "lighting", "sofa", "cot", "diwan", "swing"],
    others: ["kids"],
  };

  const imgRef = useRef(null);

  const handleCheckedCategories = (e) => {
    if (e.target.checked) {
      setProductDetails((prevData) => {
        return {
          ...prevData,
          categories: {
            ...prevData.categories,
            [e.target.name]: [...prevData.categories[e.target.name], e.target.value],
          },
        };
      });
    } else {
      if (productDetails.categories[e.target.name].length === 0) {
        setProductDetails((prevData) => {
          delete prevData.categories[e.target.name];
          return prevData;
        });
      }
      setProductDetails((prevData) => {
        let uncheckedCategory = prevData.categories[e.target.name].filter(
          (subCategory) => subCategory !== e.target.value
        );
        return { ...prevData, categories: { ...prevData.categories, [e.target.name]: uncheckedCategory } };
      });
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
      isFeatured,
      isCustomizable,
      colorVariants: isCustomizable ? colorVariants.map(c => ({ 
        colorName: c.colorName, 
        hexCode: c.hexCode, 
        imageUrl: c.imageUrl, 
        stock: parseInt(c.stock) 
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
        isFeatured: false,
        isCustomizable: false,
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
      for (let key of e.target) {
        key.checked = false;
      }

      toast.update(asyncCreateProductToastId, {
        render: "Product data has sucessfully been updated",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setIsFetchingUpdatedDataLoading(false);
      setIsEditAndUpdateModal(false);
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
    if (!newColor.colorName || !newColor.imageUrl) {
        toast.error("Please provide color name and image");
        return;
    }
    setColorVariants([...colorVariants, newColor]);
    setNewColor({ colorName: "", hexCode: "#000000", stock: 0, image: null, imageUrl: "" });
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
        className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 flex items-center justify-center overflow-y-auto  h-[100vh]  z-[3000] translate-y-[100%] ${
          isEditAndUpdateModalOn && "translate-y-0"
        } `}
      >
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-y-auto w-[99%] h-[98%] shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-center">Update existing product</h2>
          <AiOutlineClose
            className="w-9 h-9 fill-primaryColor absolute right-5 cursor-pointer top-5"
            onClick={() => setIsEditAndUpdateModal(false)}
          />
          <form action="" className="pt-8" onSubmit={UpdateProduct}>
            <div className="mb-6">
              <label className="block font-medium mb-2">Title</label>
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
              <label className="block font-medium mb-2">Description</label>
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
                <label htmlFor="price" className="font-bold">
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
                <label htmlFor="stock" className="font-bold">
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
                <label htmlFor="discount" className="font-bold">
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
              <div className="w-[20%] flex items-center justify-center pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={isFeatured || false} 
                        onChange={(e) => {
                            setProductDetails((prevData) => {
                                return { ...prevData, isFeatured: e.target.checked };
                            });
                        }}
                        className="w-5 h-5 accent-[#fca311]"
                    />
                    <span className="font-bold">Featured</span>
                </label>
              </div>
            </div>
            <section>
              <h2 className="text-lg font-bold mb-2">Select product categories</h2>
              <div className="mb-6">
                <div className="flex flex-wrap">
                  {Object.keys(productCategories).map((categoryTitle) => {
                    return (
                      <div className="pb-2 border border-gray-300 p-2">
                        <h2 className="font-medium text-[18px] mb-2">{categoryTitle} :</h2>
                        <div className="flex ml-4 gap-4 flex-wrap items-center">
                          {productCategories[categoryTitle].map((subCategoryTitle) => {
                            return (
                              <label key={subCategoryTitle} htmlFor="">
                                {subCategoryTitle}
                                <input
                                  className="ml-1"
                                  type="checkbox"
                                  name={categoryTitle}
                                  onChange={handleCheckedCategories}
                                  checked={categories[categoryTitle].includes(subCategoryTitle)}
                                  value={subCategoryTitle}
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

             {isFetchingUpdatedDataLoading && <FullpageSpinnerLoader />}
            
            {/* Customization Toggle */}
             <div className="mb-6 flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="editIsCustomizable"
                    checked={isCustomizable} 
                    onChange={(e) => setIsCustomizable(e.target.checked)}
                    className="w-5 h-5 accent-[#fca311] cursor-pointer"
                />
                <label htmlFor="editIsCustomizable" className="font-bold cursor-pointer select-none">Enable Color Customization</label>
             </div>

             {/* Color Variants Section */}
            {isCustomizable && (
                <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Product Color Variants</h2>
                    
                    {/* Add New Variant */}
                    <div className="flex flex-wrap gap-4 items-end mb-4 p-4 bg-gray-50 rounded">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-sm font-medium mb-1">Color Name</label>
                            <input 
                                type="text" 
                                value={newColor.colorName}
                                onChange={(e) => setNewColor({...newColor, colorName: e.target.value})}
                                className="w-full p-2 border rounded"
                                placeholder="e.g. Red, Blue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hex Code</label>
                            <input 
                                type="color" 
                                value={newColor.hexCode}
                                onChange={(e) => setNewColor({...newColor, hexCode: e.target.value})}
                                className="h-[40px] w-[60px] p-1 border rounded cursor-pointer"
                            />
                        </div>
                        <div className="w-[100px]">
                            <label className="block text-sm font-medium mb-1">Stock</label>
                            <input 
                                type="number" 
                                value={newColor.stock}
                                onChange={(e) => setNewColor({...newColor, stock: parseInt(e.target.value)})}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Image</label>
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
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                        >
                            Add Variant
                        </button>
                    </div>

                    {/* List Variants */}
                    {colorVariants.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {colorVariants.map((variant, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 border rounded relative">
                                    <div className="w-12 h-12 rounded border" style={{ backgroundColor: variant.hexCode }}></div>
                                    <img src={variant.imageUrl} alt={variant.colorName} className="w-12 h-12 object-cover rounded" />
                                    <div className="flex-1">
                                        <p className="font-bold">{variant.colorName}</p>
                                        <p className="text-sm">Stock: {variant.stock}</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeColorVariant(index)}
                                        className="text-red-500 hover:text-red-700 font-bold px-2"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mb-10 relative">
              <div>
                <label className="block font-bold mb-2">Image</label>
                <input
                  type="file"
                  ref={imgRef}
                  className="w-full p-4 border border-gray-300 rounded-lg "
                  onChange={handleImageUpload}
                />
                <h1 className="italics absolute left-[45%] sm:left-[55%] top-[38%]  hidden text-[#fca311] bottom-4 font-bold ">
                  {" "}
                </h1>
                <h4 className="text-sm mt-2 break-all font-normal">
                  {" "}
                  <span className="font-medium text-base">Image path</span> -{" "}
                  <a target="_blank" rel="noreferrer" className="underline text-blue-600" href={`${image}`}>
                    {" "}
                    {image}
                  </a>
                </h4>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button type="submit" className="text-[#ffffff] bg-[#fca311] w-[40%] max-w-[150px] p-2 rounded-lg">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
