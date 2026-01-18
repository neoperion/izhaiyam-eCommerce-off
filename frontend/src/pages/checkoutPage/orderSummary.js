import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { handleSetShippingMethodValue } from "../../utils/handleSetShippingMethodValueFn";
import { settingTotalProductPriceAndTotalQuantityValue } from "../../utils/settingTotalProductPriceAndquantityValue";
import { Package } from 'lucide-react';
import { withWatermark } from "../../utils/withWatermark";

export const OrderSummary = ({ setTotalAmountToBePaid }) => {
  const [shippingMethodValue, setShippingMethodValue] = useState(0);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [productTotalQuantity, setProductTotalQuantity] = useState(0);

  const { cart } = useSelector((state) => state.wishlistAndCartSection);
  const { shippingMethod } = useSelector((state) => state.userAuth);

  // cart with quantity lesser than zero shouldnt be allowed for checkout
  const filteredCart = cart.filter((product) => product.quantity > 0);

  useEffect(() => {
    handleSetShippingMethodValue(shippingMethod, setShippingMethodValue);
  }, [shippingMethod]);

  useEffect(() => {
    setTotalAmountToBePaid(totalProductPrice + productTotalQuantity * shippingMethodValue);
  }, [totalProductPrice, shippingMethodValue, productTotalQuantity, setTotalAmountToBePaid]);

  useEffect(() => {
    settingTotalProductPriceAndTotalQuantityValue(setProductTotalQuantity, setTotalProductPrice);
  }, [cart]);

  return (
    <section className="mt-20 mb-20 lg:mb-0 w-[92%] tablet:w-[88%] mx-auto lg:mx-0 bg-white rounded-xl shadow-lg border border-gray-100 lg:order-2 lg:basis-[40%] xl:basis-[35%] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-6 border-b border-gray-100">
        <h2 className="font-inter text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Package className="w-6 h-6 text-primary" style={{ color: '#93a267' }} />
          Order Summary
        </h2>
        <p className="font-inter text-sm text-gray-500 mt-1">{filteredCart.length} {filteredCart.length === 1 ? 'item' : 'items'} in cart</p>
      </div>

      {/* Products List */}
      <div className="px-6 py-6 max-h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {filteredCart.map((cartItem) => {
            return (
              <article
                className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                key={cartItem._id + (cartItem.selectedColor ? cartItem.selectedColor.name : "")}
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    src={withWatermark(cartItem.selectedColor ? cartItem.selectedColor.imageUrl : cartItem.image)}
                    alt={cartItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-inter text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                      {cartItem.title}
                    </h3>
                    {cartItem.selectedColor && (
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: cartItem.selectedColor.hexCode }}
                        ></div>
                        <span className="font-inter text-xs text-gray-600">{cartItem.selectedColor.name}</span>
                      </div>
                    )}
                    {cartItem.woodType && (
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs font-semibold text-gray-500">Wood:</span>
                            <span className="text-xs text-gray-600">
                                {typeof cartItem.woodType === 'object' ? (cartItem.woodType.name || cartItem.woodType.woodType || '') : cartItem.woodType}
                            </span>
                        </div>
                    )}
                    <p className="font-inter text-xs text-gray-500">Qty: {cartItem.quantity}</p>
                  </div>
                  <p className="font-inter text-base font-bold text-gray-900 mt-2">
                    ₹{(cartItem.price * cartItem.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
        <div className="space-y-4">
          {/* Subtotal */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <span className="font-inter text-sm text-gray-600">Subtotal</span>
            <span className="font-inter text-base font-semibold text-gray-900">
              ₹{totalProductPrice.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex flex-col">
              <span className="font-inter text-sm text-gray-600">Shipping</span>
              <span className="font-inter text-xs text-gray-500 mt-0.5">{shippingMethod} rate</span>
            </div>
            <span className="font-inter text-base font-semibold text-gray-900">
              ₹{(shippingMethodValue * productTotalQuantity).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-2">
            <span className="font-inter text-lg font-bold text-gray-900">Total</span>
            <span className="font-inter text-2xl font-bold" style={{ color: '#93a267' }}>
              ₹{(totalProductPrice + productTotalQuantity * shippingMethodValue).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
