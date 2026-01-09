import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import FooterSection from "../components/footerSection";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { handleCartModification } from "../utils/handleCartModification";
import { handleWishlistModification } from "../utils/handleWishlistModification";
import { isProductInCartFn, isProductInWishlistFn } from "../utils/isSpecificProductInCartAndWishlist.js";
import { ProductLoader } from "../components/loaders/productLoader";
import ExploreCard from "../components/home/ExploreCard";

export const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allProductsData, isLoading } = useSelector((state) => state.productsData);
  const { wishlist, cart } = useSelector((state) => state.wishlistAndCartSection);

  const { productId } = useParams();
  const currentProduct = allProductsData.find((product) => product._id === productId);
  const { _id, title, price, image, description, stock: mainStock, discountPercentValue, categories, isCustomizable, colorVariants, isWoodCustomizable, woodVariants, abTestConfig } = currentProduct || {
    _id: "",
    title: "",
    price: "",
    image: "",
    discountPercentValue: "",
    categories: "",
    stock: "",
    isCustomizable: false,
    colorVariants: [],
    // Wood & AB Test Fields
    isWoodCustomizable: false,
    woodVariants: [],
    abTestConfig: {}
  };

  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  // Wood State
  const [selectedWood, setSelectedWood] = useState(null);
  const [showWoodInfoPopup, setShowWoodInfoPopup] = useState(false);

  const [isCustomizationActive, setIsCustomizationActive] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // A/B Testing & Default Wood Logic
  useEffect(() => {
    if (isWoodCustomizable && woodVariants && woodVariants.length > 0) {
      let defaultVariant = woodVariants.find(w => w.isDefault) || woodVariants[0];

      // A/B Testing Logic
      if (abTestConfig?.enabled) {
        let userGroup = sessionStorage.getItem("abTestGroup");
        if (!userGroup) {
          const random = Math.random() * 100;
          userGroup = random < (abTestConfig.trafficSplit || 50) ? "A" : "B";
          sessionStorage.setItem("abTestGroup", userGroup);

          // Track assignment (Mock event)
          console.log(`User assigned to Group ${userGroup} for Wood Pricing`);
        }

        const targetVariantName = userGroup === "A" ? abTestConfig.groupAVariant : abTestConfig.groupBVariant;
        const targetVariant = woodVariants.find(w => w.woodType === targetVariantName);
        if (targetVariant) {
          defaultVariant = targetVariant;
        }
      }

      setSelectedWood(defaultVariant);
    }
  }, [isWoodCustomizable, woodVariants, abTestConfig]);

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

  // Dynamic Pricing & Stock (Unified Stock: Variants don't have stock anymore)
  let currentDisplayPrice = price;
  const currentStock = mainStock; // Use Main Product Stock ONLY

  if (isWoodCustomizable && selectedWood) {
    currentDisplayPrice = selectedWood.price;
  }
  // Color variants don't affect price usually, but if they did, handle here. 
  // Stock is ALWAYS mainStock.

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
    handleCartModification(_id, dispatch, productQuantity, isProductInCart, isCustomizationActive ? selectedColor : null, isWoodCustomizable && selectedWood ? selectedWood : null);
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
    handleCartModification(_id, dispatch, productQuantity, isProductInCart, isCustomizationActive ? selectedColor : null, isWoodCustomizable && selectedWood ? selectedWood : null);
    navigate("/checkout");
  };

  useEffect(() => {
    isProductInWishlistFn(_id, setIsWishlisted, wishlist);
  }, [wishlist, _id]);

  useEffect(() => {
    isProductInCartFn(_id, setIsProductInCart, cart, isCustomizationActive ? selectedColor : null, isWoodCustomizable && selectedWood ? selectedWood : null);
  }, [cart, _id, selectedColor, isCustomizationActive, selectedWood, isWoodCustomizable]);

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

  let discountedPrice = currentDisplayPrice - (currentDisplayPrice * discountPercentValue) / 100;

  if (isLoading) {
    return <ProductLoader />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image Section - Left Column */}
          <div className="flex flex-col gap-4 h-full sticky top-24">
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

          {/* Product Details Section - Right Column */}
          <div className="flex flex-col gap-4 md:gap-6 h-full">
            <div>
              <h1 className="font-inter text-xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3 capitalize leading-tight">{title}</h1>

              <div className="flex items-baseline gap-2 md:gap-3 mb-3 md:mb-4">
                {discountPercentValue > 0 ? (
                  <>
                    <span className="font-inter text-xl md:text-4xl font-bold text-gray-900">₹{discountedPrice.toLocaleString("en-IN")}</span>
                    <span className="font-inter text-sm md:text-xl text-gray-400 line-through">₹{currentDisplayPrice.toLocaleString("en-IN")}</span>
                    <span className="font-inter text-xs md:text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 md:py-1 rounded">{discountPercentValue}% OFF</span>
                  </>
                ) : (
                  <span className="font-inter text-xl md:text-4xl font-bold text-gray-900">₹{currentDisplayPrice.toLocaleString("en-IN")}</span>
                )}
              </div>

              {/* Wood Selection UI */}
              {isWoodCustomizable && woodVariants && woodVariants.length > 0 && (
                <div className="mb-4 md:mb-6">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <h3 className="font-inter font-bold text-sm md:text-base text-gray-900">Select Wood Type</h3>
                    <button
                      onClick={() => setShowWoodInfoPopup(!showWoodInfoPopup)}
                      className="text-[#93a267] hover:text-[#7d8c56]"
                      aria-label="Why Teak Costs More?"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </button>

                    {/* "Why Teak Costs More?" Popup */}
                    {showWoodInfoPopup && (
                      <div className="absolute z-50 bg-white border border-[#93a267] p-4 rounded-lg shadow-xl w-[280px] md:w-[350px] mt-8">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-[#5A6E3A] text-sm md:text-base">Why the price difference?</h4>
                          <button onClick={() => setShowWoodInfoPopup(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                          <strong>Teak</strong> is a premium hardwood known for its incredible durability, weather resistance, and natural oils that protect against pests. <strong>Acacia</strong> is a cost-effective alternative that is durable but lighter. We offer both to suit your budget and longevity needs!
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {woodVariants.map((wood) => (
                      <div
                        key={wood.woodType}
                        onClick={() => setSelectedWood(wood)}
                        className={`relative border-2 rounded-lg p-3 md:p-4 cursor-pointer transition-all ${selectedWood?.woodType === wood.woodType
                          ? 'border-[#93a267] bg-[#93a267]/5 shadow-md'
                          : 'border-gray-200 hover:border-[#93a267]/50'
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-400 flex items-center justify-center ${selectedWood?.woodType === wood.woodType ? 'border-[#93a267]' : ''}`}>
                              {selectedWood?.woodType === wood.woodType && <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#93a267]"></div>}
                            </div>
                            <span className="font-bold text-sm md:text-base text-gray-900">{wood.woodType}</span>
                          </div>
                          <span className="font-semibold text-sm md:text-base text-gray-900">₹{wood.price.toLocaleString("en-IN")}</span>
                        </div>
                        {wood.description && (
                          <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2 ml-5 md:ml-6">{wood.description}</p>
                        )}
                        {/* Stock removed from variants */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {description && description.trim() !== "" && (
              <p className="font-inter text-sm md:text-base text-gray-600 leading-relaxed">{description}</p>
            )}

            {isCustomizable && (
              <div className="border border-gray-200 rounded-lg p-3 md:p-4 bg-[#FFF7F2]/30">
                <div className="flex justify-between items-center mb-2 md:mb-3">
                  <h3 className="font-inter font-semibold text-sm md:text-base text-gray-900">Customize Colors (Optional)</h3>
                  <button onClick={() => setIsCustomizationActive(!isCustomizationActive)} className="font-inter text-xs md:text-sm text-[#93a267] hover:text-[#7d8c56] font-medium transition-colors">
                    {isCustomizationActive ? "Cancel" : "Customize"}
                  </button>
                </div>
                {isCustomizationActive && colorVariants && colorVariants.length > 0 && (
                  <div className="space-y-2 md:space-y-3">
                    <p className="font-inter text-xs md:text-sm text-gray-700">Selected: <span className="font-semibold">
                      {selectedColor?.isDualColor
                        ? `${selectedColor.primaryColorName} + ${selectedColor.secondaryColorName}`
                        : (selectedColor?.primaryColorName || selectedColor?.colorName)}
                    </span></p>
                    <div className="flex gap-2 md:gap-3 flex-wrap">
                      {colorVariants.map((variant, idx) => {
                        const isDual = variant.isDualColor || (variant.secondaryColorName && variant.secondaryHexCode);
                        const primaryHex = variant.primaryHexCode || variant.hexCode;
                        const secondaryHex = variant.secondaryHexCode;
                        const variantColorName = variant.primaryColorName || variant.colorName;
                        const displayTitle = isDual
                          ? `${variant.primaryColorName} + ${variant.secondaryColorName}`
                          : variantColorName;

                        return (
                          <button
                            key={idx}
                            onClick={() => handleColorSelect(variant)}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all ${(selectedColor?.primaryColorName || selectedColor?.colorName) === variantColorName
                              ? 'border-[#93a267] scale-110 shadow-md'
                              : 'border-gray-300 hover:border-[#93a267]/50'
                              }`}
                            style={{
                              background: isDual
                                ? `linear-gradient(90deg, ${primaryHex} 50%, ${secondaryHex} 50%)`
                                : primaryHex
                            }}
                            title={displayTitle}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              {isOutOfStock ? (
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs md:text-sm rounded-full font-inter font-medium">Out of Stock</span>
              ) : (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs md:text-sm rounded-full font-inter font-medium">In Stock ({currentStock} available)</span>
              )}
            </div>

            {!isOutOfStock && (
              <div className="space-y-3 md:space-y-4 mt-auto">
                {/* Quantity Selector */}
                <div>
                  <label className="font-inter text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 block">Quantity</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden w-fit">
                    <button onClick={() => productQuantity > 1 && setProductQuantity(productQuantity - 1)} className="px-3 md:px-4 py-2 md:py-3 text-gray-600 hover:bg-gray-100 font-inter font-semibold transition-colors text-sm md:text-base">−</button>
                    <span className="px-4 md:px-6 py-2 md:py-3 font-inter font-semibold text-gray-900 min-w-[40px] md:min-w-[60px] text-center text-sm md:text-base">{productQuantity}</span>
                    <button onClick={() => productQuantity < currentStock && setProductQuantity(productQuantity + 1)} className="px-3 md:px-4 py-2 md:py-3 text-gray-600 hover:bg-gray-100 font-inter font-semibold transition-colors text-sm md:text-base">+</button>
                  </div>
                </div>

                {/* Action Buttons - Horizontal */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <button onClick={handleAddToCart} className="flex-1 bg-[#93a267] hover:bg-[#7d8c56] text-white font-inter font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-all text-sm md:text-base">
                    {cart.find(item => item._id === _id && (isCustomizationActive && selectedColor ? item.selectedColor?.colorName === selectedColor?.colorName : !item.selectedColor) && (isWoodCustomizable && selectedWood ? item.woodType === selectedWood.woodType : !item.woodType)) ? "Update Cart" : "Add to Cart"}
                  </button>
                  <button onClick={handleBuyNow} className="flex-1 bg-[#93a267] hover:bg-[#7d8c56] text-white font-inter font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-lg transition-all border-2 border-[#93a267] text-sm md:text-base">Buy Now</button>
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
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-inter text-2xl md:text-3xl font-bold text-gray-900">Explore Similar Products</h2>
              </div>

              {/* Horizontal Scrolling Container */}
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {similarProducts.map((product) => {
                    const wishlistItem = wishlist.find(item => item._id === product._id);
                    return (
                      <div key={product._id} className="snap-start flex-shrink-0 w-[260px] md:w-[300px]">
                        <ExploreCard
                          title={product.title}
                          description={product.description}
                          image={product.image}
                          link={`/product/${product._id}`}
                          category={product.discountPercentValue > 0 ? `${product.discountPercentValue}% OFF` : null}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <FooterSection />
    </div>
  );
};
