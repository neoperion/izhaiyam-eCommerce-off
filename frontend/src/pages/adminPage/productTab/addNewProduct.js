import { React, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/admin/AdminLayout";

export const AddNewProduct = () => {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productDiscountPercentValue, setProductDiscountPercentValue] = useState(0);
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState(0);

  const [isFeatured, setIsFeatured] = useState("no");
  const [displayOrder, setDisplayOrder] = useState("");
  const [isPinned, setIsPinned] = useState("no");
  const [categories, setCategories] = useState({
    "Featured Categories": [],
    location: [],
    features: [],
    others: [],
  });
  // Color Variants State
  const [isCustomizable, setIsCustomizable] = useState("no");
  const [colorVariants, setColorVariants] = useState([]);
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

  // Wood Variants State
  const [isWoodCustomizable, setIsWoodCustomizable] = useState("no");
  const [woodVariants, setWoodVariants] = useState([]);
  const [newWood, setNewWood] = useState({
    woodType: "",
    price: "",
    stock: "",
    description: "",
    isDefault: false
  });
  const [abTestConfig, setAbTestConfig] = useState({
    enabled: false,
    groupAVariant: "Acacia",
    groupBVariant: "Teak",
    trafficSplit: 50
  });

  const productCategories = {
    "Featured Categories": ["featured", "first order deal", "discounts"],
    location: ["kitchen", "dining", "bedroom", "living room", "office", "balcony"],
    features: ["chairs", "tables", "sets", "cupboards", "lighting", "sofa", "cot", "diwan", "swing"],
    others: ["kids"],
  };

  const imgRef = useRef(null);

  const handleCategoryChange = (categoryName, selectedValue) => {
    if (selectedValue === "") {
      // If empty option selected, remove the category
      setCategories((prev) => ({
        ...prev,
        [categoryName]: [],
      }));
    } else {
      // Set single selected value for that category
      setCategories((prev) => ({
        ...prev,
        [categoryName]: [selectedValue],
      }));
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();

    const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

    const formData = {
      title: productTitle,
      description: productDescription,
      image: imgUrl,
      categories: categories,
      price: productPrice,
      stock: productStock,
      discountPercentValue: productDiscountPercentValue,
      isFeatured: isFeatured === "yes",

      isCustomizable: isCustomizable === "yes",
      displayOrder: displayOrder ? parseInt(displayOrder) : undefined,
      isPinned: isPinned === "yes",
      colorVariants: isCustomizable === "yes" ? colorVariants.map(c => ({
        variantName: c.variantName,
        primaryColorName: c.primaryColorName || c.colorName,
        primaryHexCode: c.primaryHexCode || c.hexCode,
        secondaryColorName: c.secondaryColorName || "",
        secondaryHexCode: c.secondaryHexCode || "",
        isDualColor: c.isDualColor || false,
        imageUrl: c.imageUrl,
        stock: parseInt(c.stock) || 0
      })) : [],
      // Wood Variants Data
      isWoodCustomizable: isWoodCustomizable === "yes",
      woodVariants: isWoodCustomizable === "yes" ? woodVariants.map(w => ({
        woodType: w.woodType,
        price: parseFloat(w.price) || 0,
        stock: parseInt(w.stock) || 0,
        description: w.description,
        isDefault: w.isDefault
      })) : [],
      abTestConfig: isWoodCustomizable === "yes" ? abTestConfig : { enabled: false },
    };
    console.log("Frontend Create Payload:", formData);
    const asyncCreateProductToastId = toast.loading("product data upload in progress");
    try {
      const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
      await axios.post(`${serverUrl}/api/v1/products`, formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          "Content-Type": "application/json",
        },
      });

      toast.update(asyncCreateProductToastId, {
        render: "Product data has sucessfully been uploaded",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      
      // Navigate back to products list
      navigate('/admin/products');
      
    } catch (error) {
      let errMessage;
      if (!error.response.data) errMessage = error.message;
      else {
        errMessage = error.response.data.message;
      }

      toast.update(asyncCreateProductToastId, {
        render: `${errMessage} : Product data upload failed`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
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
      const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
      const { data } = await axios.post("http://localhost:5000/api/v1/products/upload", formData, {
        headers: {
          authorization: `Bearer ${LoginToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const { image } = data;
      setImgUrl(image.src);
      toast.update(asyncImgUploadToastId, {
        render: "Product image has been successfully uploaded",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      imgRef.current.nextElementSibling.textContent = "uploaded";
    } catch (error) {
      setImgUrl("");

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
      const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
      const { data } = await axios.post("http://localhost:5000/api/v1/products/upload", formData, {
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

  // Wood Variant Handlers
  const addWoodVariant = () => {
    if (!newWood.woodType || !newWood.price) {
      toast.error("Please provide Wood Type and Price");
      return;
    }
    setWoodVariants([...woodVariants, { ...newWood }]);
    setNewWood({ woodType: "", price: "", stock: "", description: "", isDefault: false });
  };

  const removeWoodVariant = (index) => {
    const updated = [...woodVariants];
    updated.splice(index, 1);
    setWoodVariants(updated);
  };

  return (
    <AdminLayout>
      <div className="w-[100%] xl:px-[4%] tablet:px-[6%] px-[4%] lg:px-[2%] my-6">
        <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-y-auto w-full shadow-md sm:max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black">Create a new product</h2>
            <AiOutlineClose
              className="w-8 h-8 fill-primaryColor cursor-pointer hover:fill-red-600 transition-colors"
              onClick={() => navigate('/admin/products')}
            />
          </div>
          <form action="" className="" onSubmit={createProduct}>
            <div className="mb-6">
              <label className="block font-medium mb-2 text-black">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={productTitle}
                onChange={(e) => setProductTitle(e.currentTarget.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-2 text-black">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={productDescription}
                onChange={(e) => setProductDescription(e.currentTarget.value)}
                rows="4"
              />
            </div>
            <div className="mb-6 flex flex-wrap lg:flex-nowrap gap-[2%] items-end justify-between">
              <div className="w-full lg:w-[30%] mb-4 lg:mb-0">
                <label htmlFor="price" className="font-bold text-black">
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.currentTarget.value)}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-full lg:w-[20%] mb-4 lg:mb-0">
                <label htmlFor="stock" className="font-bold text-black">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  value={productStock}
                  onChange={(e) => setProductStock(e.currentTarget.value)}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-full lg:w-[20%] mb-4 lg:mb-0">
                <label htmlFor="discount" className="font-bold text-black">
                  Discount(%)
                </label>
                <input
                  type="number"
                  id="discount"
                  value={productDiscountPercentValue}
                  onChange={(e) => setProductDiscountPercentValue(e.currentTarget.value)}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="w-full lg:w-[20%]">
                <label htmlFor="featured" className="font-bold block mb-2 text-black">Featured</label>
                <select
                  id="featured"
                  value={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap lg:flex-nowrap gap-[2%] items-end justify-between">
              <div className="w-full lg:w-[30%] mb-4 lg:mb-0">
                <label htmlFor="displayOrder" className="font-bold">
                  Display order
                </label>
                <input
                  type="number"
                  id="displayOrder"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.currentTarget.value)}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg"
                  placeholder="Auto-assigned if empty"
                />
              </div>
              <div className="w-full lg:w-[30%] mb-4 lg:mb-0">
                <label htmlFor="pinned" className="font-bold block mb-2 text-black">Pin to Top</label>
                <select
                  id="pinned"
                  value={isPinned}
                  onChange={(e) => setIsPinned(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="w-full lg:w-[35%]">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(productCategories).map((categoryTitle) => {
                    return (
                      <div key={categoryTitle} className="border border-gray-300 p-3 rounded-lg">
                        <label htmlFor={categoryTitle} className="font-medium text-base mb-2 block text-black">
                          {categoryTitle}
                        </label>
                        <select
                          id={categoryTitle}
                          value={categories[categoryTitle][0] || ""}
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

            {/* Color Variants Section - Conditionally Rendered */}
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

            {/* Wood Variants Section */}
            <div className="mb-4">
               <div className="w-full lg:w-[35%] mb-4">
                <label htmlFor="woodCustomizable" className="font-bold block mb-2 text-black">Wood Type Selection</label>
                <select
                  id="woodCustomizable"
                  value={isWoodCustomizable}
                  onChange={(e) => setIsWoodCustomizable(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="no">Disabled</option>
                  <option value="yes">Enabled</option>
                </select>
              </div>
            </div>

            {isWoodCustomizable === "yes" && (
              <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-yellow-50/20">
                <h2 className="text-lg font-bold mb-4 text-black">Wood Type Pricing</h2>
                
                {/* A/B Test Config Toggle */}
                 <div className="mb-4 flex items-center gap-4">
                    <label className="font-medium text-black">Enable A/B Testing?</label>
                     <input 
                      type="checkbox" 
                      checked={abTestConfig.enabled} 
                      onChange={(e) => setAbTestConfig({...abTestConfig, enabled: e.target.checked})}
                      className="w-5 h-5 accent-[#93a267]"
                     />
                     {abTestConfig.enabled && <span className="text-sm text-gray-500">(Acacia vs Teak Split)</span>}
                 </div>

                {/* Add Wood Input */}
                <div className="flex flex-wrap gap-4 items-end mb-4 p-4 bg-white border border-gray-200 rounded">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium mb-1 text-black">Wood Type *</label>
                    <input
                      type="text"
                      value={newWood.woodType}
                      onChange={(e) => setNewWood({ ...newWood, woodType: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="e.g. Teak"
                    />
                  </div>
                  <div className="w-[120px]">
                    <label className="block text-sm font-medium mb-1 text-black">Price *</label>
                    <input
                      type="number"
                      value={newWood.price}
                      onChange={(e) => setNewWood({ ...newWood, price: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="₹"
                    />
                  </div>
                  <div className="w-[100px]">
                    <label className="block text-sm font-medium mb-1 text-black">Stock</label>
                    <input
                      type="number"
                      value={newWood.stock}
                      onChange={(e) => setNewWood({ ...newWood, stock: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium mb-1 text-black">Description (Optional)</label>
                    <input
                      type="text"
                      value={newWood.description}
                      onChange={(e) => setNewWood({ ...newWood, description: e.target.value })}
                      className="w-full p-2 border rounded"
                      placeholder="e.g. Premium durability"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                     <label className="text-sm font-medium text-black">Default?</label>
                     <input 
                      type="checkbox" 
                      checked={newWood.isDefault} 
                      onChange={(e) => setNewWood({...newWood, isDefault: e.target.checked})}
                      className="w-5 h-5 accent-[#93a267]"
                     />
                  </div>
                  <button
                    type="button"
                    onClick={addWoodVariant}
                    className="bg-[#93a267] text-white px-4 py-2 rounded hover:bg-[#7a8856] transition-colors"
                  >
                    Add Wood
                  </button>
                </div>

                {/* List Wood Variants */}
                {woodVariants.length > 0 && (
                   <div className="space-y-3">
                      <div className="grid grid-cols-5 font-bold border-b pb-2 mb-2 bg-gray-100 p-2 rounded">
                         <div className="col-span-1">Type</div>
                         <div className="col-span-1">Price</div>
                         <div className="col-span-1">Stock</div>
                         <div className="col-span-1">Default</div>
                         <div className="col-span-1">Action</div>
                      </div>
                      {woodVariants.map((wood, idx) => (
                        <div key={idx} className="grid grid-cols-5 items-center p-2 border-b">
                           <div className="font-medium text-black">{wood.woodType}</div>
                           <div className="text-black">₹{wood.price}</div>
                           <div className="text-black">{wood.stock}</div>
                           <div className="text-black">{wood.isDefault ? "Yes" : "-"}</div>
                           <div>
                              <button
                                type="button"
                                onClick={() => removeWoodVariant(idx)}
                                className="text-red-500 hover:text-red-700 font-bold"
                              >
                                Remove
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                )}
              </div>
            )}
            <div className="mb-6 relative">
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
            </div>
            <div className="flex items-center justify-end">
              <button type="submit" className="text-white bg-[#93a267] hover:bg-[#7a8856] px-6 py-2 rounded-lg transition-colors font-medium">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
