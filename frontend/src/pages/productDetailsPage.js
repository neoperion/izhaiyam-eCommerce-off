import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import FooterSection from "../components/footerSection";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { handleCartModification } from "../utils/handleCartModification";
import { handleWishlistModification } from "../utils/handleWishlistModification";
import { isProductInCartFn, isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js";
import { ProductLoader } from "../components/loaders/productLoader";

export const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allProductsData, isLoading } = useSelector((state) => state.productsData);
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection);

  const { productId } = useParams();
  const currentProduct = allProductsData.find((product) => product._id === productId);
  const { _id, title, price, image, description, stock: mainStock, discountPercentValue, categories, isCustomizable, colorVariants } = currentProduct || {
    _id: "",
    title: "",
    price: "",
    image: "",
    discountPercentValue: "",
    categories: "",
    stock: "",
    isCustomizable: false,
    colorVariants: [],
  };

  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isCustomizationActive, setIsCustomizationActive] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isCustomizationActive && isCustomizable && colorVariants && colorVariants.length > 0) {
      setSelectedColor(colorVariants[0]);
    } else {
      setSelectedColor(null);
    }
  }, [isCustomizationActive, isCustomizable, colorVariants]);

  // Reset image index when color changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  const currentImage = isCustomizationActive && selectedColor ? selectedColor.imageUrl : image;
  const currentStock = isCustomizationActive && selectedColor ? selectedColor.stock : mainStock;
  const isOutOfStock = currentStock === 0;

  // Show only selected color's image when customization is active
  const images = isCustomizationActive && selectedColor
    ? [selectedColor.imageUrl]
    : [image];

  let subCategoriesArr = [];
  for (let key in categories) {
    if (categories[key].length > 0) subCategoriesArr.push(...categories[key]);
  }

  const handleAddToCart = () => {
    if (productQuantity < 1) {
      alert("Product quantity can't be less than 1");
      return;
    }
    if (productQuantity > currentStock) {
      alert(`Only ${currentStock} items are available in stock.`);
      return;
    }
    handleCartModification(_id, dispatch, productQuantity, isProductInCart, isCustomizationActive ? selectedColor : null);
    setProductQuantity(1);
  };

  const handleBuyNow = () => {
    if (productQuantity < 1) {
      alert("Product quantity can't be less than 1");
      return;
    }
    if (productQuantity > currentStock) {
      alert(`Only ${currentStock} items are available in stock.`);
      return;
    }
    handleCartModification(_id, dispatch, productQuantity, isProductInCart, isCustomizationActive ? selectedColor : null);
    navigate("/checkout");
  };

  useEffect(() => {
    isProductInWishlistFn(_id, setIsWishlisted, wishlist);
  }, [wishlist, _id]);

  useEffect(() => {
    isProductInCartFn(_id, setIsProductInCart, cart, isCustomizationActive ? selectedColor : null);
  }, [cart, _id, selectedColor, isCustomizationActive]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleColorSelect = (variant) => {
    setSelectedColor(variant);
    setCurrentImageIndex(0); // Reset to first image of selected color
  };

  let discountedPrice = price - (price * discountPercentValue) / 100;

  if (isLoading) {
    return <ProductLoader />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex flex-col gap-4">
            <div className="relative bg-[#FFF7F2] rounded-lg overflow-hidden aspect-square flex items-center justify-center">
              <img src={images[currentImageIndex]} alt={title} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all">
                    <ChevronLeft size={24} className="text-gray-800" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all">
                    <ChevronRight size={24} className="text-gray-800" />
                  </button>
                </>
              )}
              <button className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all duration-300 z-10 ${isWishlisted ? "bg-primary text-primary-foreground" : "bg-white hover:bg-primary/10"}`} onClick={() => handleWishlistModification(_id, dispatch)} aria-label="Add to wishlist">
                <Heart className={`w-5 h-5 transition-all ${isWishlisted ? "fill-current" : "stroke-foreground"}`} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-[#93a267] scale-105' : 'border-gray-200 hover:border-[#93a267]/50'}`}>
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-inter text-3xl md:text-4xl font-bold text-gray-900 mb-3 capitalize">{title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-inter text-gray-600 text-sm">(243 Reviews)</span>
              </div>
                <div className="flex items-baseline gap-3 mb-4">
                  {discountPercentValue > 0 ? (
                    <>
                      <span className="font-inter text-3xl md:text-4xl font-bold text-gray-900">₹{discountedPrice.toLocaleString("en-IN")}</span>
                      <span className="font-inter text-lg md:text-xl text-gray-400 line-through">₹{price.toLocaleString("en-IN")}</span>
                      <span className="font-inter text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{discountPercentValue}% OFF</span>
                    </>
                  ) : (
                    <span className="font-inter text-3xl md:text-4xl font-bold text-gray-900">₹{price.toLocaleString("en-IN")}</span>
                  )}
                </div>
            </div>

            {description && description.trim() !== "" && (
              <p className="font-inter text-gray-600 leading-relaxed">{description}</p>
            )}

            {isCustomizable && (
              <div className="border border-gray-200 rounded-lg p-4 bg-[#FFF7F2]/30">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-inter font-semibold text-gray-900">Customize Colors (Optional)</h3>
                  <button onClick={() => setIsCustomizationActive(!isCustomizationActive)} className="font-inter text-sm text-[#93a267] hover:text-[#7d8c56] font-medium transition-colors">
                    {isCustomizationActive ? "Cancel" : "Customize"}
                  </button>
                </div>
                {isCustomizationActive && colorVariants && colorVariants.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-inter text-sm text-gray-700">Selected: <span className="font-semibold">{selectedColor?.colorName}</span></p>
                    <div className="flex gap-3 flex-wrap">
                      {colorVariants.map((variant, idx) => (
                        <button key={idx} onClick={() => handleColorSelect(variant)} className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor?.colorName === variant.colorName ? 'border-[#93a267] scale-110 shadow-md' : 'border-gray-300 hover:border-[#93a267]/50'}`} style={{ backgroundColor: variant.hexCode }} title={variant.colorName} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              {isOutOfStock ? (
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-inter font-medium">Out of Stock</span>
              ) : (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-inter font-medium">In Stock ({currentStock} available)</span>
              )}
            </div>

            {!isOutOfStock && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div>
                  <label className="font-inter text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden w-fit">
                    <button onClick={() => productQuantity > 1 && setProductQuantity(productQuantity - 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-inter font-semibold transition-colors">−</button>
                    <span className="px-6 py-3 font-inter font-semibold text-gray-900 min-w-[60px] text-center">{productQuantity}</span>
                    <button onClick={() => productQuantity < currentStock && setProductQuantity(productQuantity + 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-inter font-semibold transition-colors">+</button>
                  </div>
                </div>

                {/* Action Buttons - Horizontal */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleAddToCart} className="flex-1 bg-[#93a267] hover:bg-[#7d8c56] text-white font-inter font-bold py-3 px-6 rounded-lg transition-all">
                    {cart.find(item => item._id === _id && (isCustomizationActive && selectedColor ? item.selectedColor?.colorName === selectedColor?.colorName : !item.selectedColor)) ? "Update Cart" : "Add to Cart"}
                  </button>
                  <button onClick={handleBuyNow} className="flex-1 bg-[#93a267] hover:bg-[#7d8c56] text-white font-inter font-bold py-3 px-6 rounded-lg transition-all border-2 border-[#93a267]">Buy Now</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Explore Products Section - Only show if products exist */}
        {(() => {
          const similarProducts = allProductsData
            .filter(p => {
              // Filter products from same category
              if (!categories || p._id === _id) return false;
              const currentCategories = Object.values(categories).flat();
              const productCategories = Object.values(p.categories || {}).flat();
              return currentCategories.some(cat => productCategories.includes(cat));
            })
            .slice(0, 10);

          if (similarProducts.length === 0) return null;

          return (
            <div className="mt-16">
              <h2 className="font-inter text-2xl md:text-3xl font-bold text-gray-900 mb-8">Explore Similar Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {similarProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="bg-[#FFF7F2] rounded-lg overflow-hidden aspect-square mb-3 relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.discountPercentValue > 0 && (
                        <span className="absolute top-2 left-2 bg-[#93a267] text-white px-2 py-1 rounded-full text-xs font-inter font-semibold">
                          {product.discountPercentValue}% off
                        </span>
                      )}
                    </div>
                    <h3 className="font-inter font-semibold text-sm text-gray-900 group-hover:text-[#93a267] transition-colors mb-1 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="font-inter text-gray-600 text-sm">₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      <FooterSection />
    </div>
  );
};
