import { useDispatch, useSelector } from "react-redux";
import { setShippingMethod } from "../../features/authSlice";
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon";
import { useState } from "react";
import { FaHome, FaBriefcase } from "react-icons/fa";

const statesOfIndia = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const CheckoutForm = ({ placeOrderFn, checkoutFormData, setCheckoutFormData, savedAddresses }) => {
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Fetch location details by pincode
  const fetchLocationByPincode = async (pincode) => {
    if (pincode.length !== 6) {
      setPincodeError('');
      return;
    }

    setIsLoadingPincode(true);
    setPincodeError('');

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const location = data[0].PostOffice[0];
        setCheckoutFormData(prev => ({
          ...prev,
          city: location.Name || location.District || '',
          state: location.State || ''
        }));
        setPincodeError('');
      } else {
        setPincodeError('Invalid pincode');
        setCheckoutFormData(prev => ({
          ...prev,
          city: '',
          state: ''
        }));
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      setPincodeError('Failed to fetch location');
    } finally {
      setIsLoadingPincode(false);
    }
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    setCheckoutFormData({ ...checkoutFormData, postalCode: pincode });

    if (pincode.length === 6) {
      fetchLocationByPincode(pincode);
    }
  };
  const {
    userData: { isLoading, email },
  } = useSelector((state) => state.userAuth);

  const dispatch = useDispatch();

  return (
    <form
      className="mt-8 w-full max-w-2xl mx-auto px-4"
      onSubmit={placeOrderFn}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-inter text-3xl font-semibold text-gray-900 mb-2">Delivery Address</h1>
        <p className="font-inter text-sm text-gray-500">We'll deliver your order to this address</p>
      </div>

      {/* Contact Information */}
      <div className="bg-[#faf9f7] rounded-2xl p-6 mb-6">
        <h2 className="font-inter text-lg font-semibold text-gray-900 mb-5">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="font-inter block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              required
              className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
              placeholder="Enter your full name"
              value={checkoutFormData.username}
              onChange={(e) => {
                setCheckoutFormData((prevData) => {
                  return { ...prevData, username: e.target.value };
                });
              }}
            />
          </div>

          <div>
            <label htmlFor="mobile" className="font-inter block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              required
              className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
              placeholder="Enter mobile number"
              value={checkoutFormData.phone || ''}
              onChange={(e) => {
                setCheckoutFormData((prevData) => {
                  return { ...prevData, phone: e.target.value };
                });
              }}
            />
          </div>

          <div>
            <label htmlFor="email" className="font-inter block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              readOnly
              required
              defaultValue={email}
              className="font-inter w-full h-12 px-4 bg-gray-50 rounded-lg border border-gray-200 cursor-not-allowed text-gray-600"
              placeholder="user@gmail.com"
            />
          </div>
        </div>
      </div>

      {/* Saved Addresses */}
      {savedAddresses && savedAddresses.length > 0 && (
        <div className="bg-[#faf9f7] rounded-2xl p-6 mb-6">
          <h2 className="font-inter text-lg font-semibold text-gray-900 mb-5">Saved Addresses</h2>
          <div className="grid grid-cols-1 gap-4">
              {savedAddresses.map((addr) => (
                  <div key={addr._id} 
                       className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                           (checkoutFormData.addressLine1 === addr.addressLine1 && checkoutFormData.postalCode === addr.postalCode) 
                           ? 'border-[#93a267] bg-[#93a267]/5' 
                           : 'border-gray-200 hover:border-gray-300'
                       }`}
                       onClick={() => {
                           setCheckoutFormData(prev => ({
                               ...prev,
                               addressType: addr.addressType,
                               addressLine1: addr.addressLine1,
                               addressLine2: addr.addressLine2,
                               city: addr.city,
                               state: addr.state,
                               country: addr.country,
                               postalCode: addr.postalCode
                           }));
                       }}
                  >
                      <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                               (checkoutFormData.addressLine1 === addr.addressLine1 && checkoutFormData.postalCode === addr.postalCode)
                               ? 'border-[#93a267]' : 'border-gray-300'
                          }`}>
                              {(checkoutFormData.addressLine1 === addr.addressLine1 && checkoutFormData.postalCode === addr.postalCode) && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#93a267]" />
                              )}
                          </div>
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="font-inter font-semibold text-gray-900">{addr.addressType}</span>
                                  {addr.isDefault && (
                                      <span className="text-[10px] bg-[#93a267] text-white px-2 py-0.5 rounded-full font-bold">DEFAULT</span>
                                  )}
                              </div>
                              <p className="font-inter text-sm text-gray-600 line-clamp-1">
                                  {addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}
                              </p>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      )}

      {/* Address Information */}
      <div className="bg-[#faf9f7] rounded-2xl p-6 mb-6">
        <h2 className="font-inter text-lg font-semibold text-gray-900 mb-5">Shipping Address</h2>

        {/* Address Type */}
        <div className="mb-5">
          <label className="font-inter block text-sm font-medium text-gray-700 mb-3">Address Type</label>
          <div className="flex gap-3">
            <button
              type="button"
              className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border-2 transition-all ${checkoutFormData.addressType === 'Home'
                ? 'border-[#93a267] bg-[#93a267]/10 text-[#93a267]'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setCheckoutFormData((prev) => ({ ...prev, addressType: 'Home' }))}
            >
              <FaHome className="w-4 h-4" />
              <span className="font-inter font-medium">Home</span>
            </button>
            <button
              type="button"
              className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-lg border-2 transition-all ${checkoutFormData.addressType === 'Office'
                ? 'border-[#93a267] bg-[#93a267]/10 text-[#93a267]'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setCheckoutFormData((prev) => ({ ...prev, addressType: 'Office' }))}
            >
              <FaBriefcase className="w-4 h-4" />
              <span className="font-inter font-medium">Office</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label htmlFor="addressLine1" className="font-inter block text-sm font-medium text-gray-700 mb-2">
              Address Line 1 (House / Flat / Street)
            </label>
            <input
              type="text"
              id="addressLine1"
              required
              className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
              placeholder="Enter house number, street name"
              value={checkoutFormData.addressLine1 || ''}
              onChange={(e) => {
                setCheckoutFormData((prevData) => {
                  return { ...prevData, addressLine1: e.target.value };
                });
              }}
            />
          </div>

          <div>
            <label htmlFor="addressLine2" className="font-inter block text-sm font-medium text-gray-700 mb-2">
              Address Line 2 <span className="text-gray-400">(Optional – Landmark / Area)</span>
            </label>
            <input
              type="text"
              id="addressLine2"
              className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
              placeholder="Landmark or nearby area"
              value={checkoutFormData.addressLine2 || ''}
              onChange={(e) => {
                setCheckoutFormData((prevData) => {
                  return { ...prevData, addressLine2: e.target.value };
                });
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="city" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                required
                className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                placeholder="Enter city name"
                value={checkoutFormData.city}
                onChange={(e) => {
                  setCheckoutFormData((prevData) => {
                    return { ...prevData, city: e.target.value };
                  });
                }}
              />
            </div>

            <div>
              <label htmlFor="state" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                id="state"
                required
                className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                value={checkoutFormData.state || ''}
                onChange={(e) => {
                  setCheckoutFormData((prevData) => {
                    return { ...prevData, state: e.target.value };
                  });
                }}
              >
                <option value="">Select State</option>
                {statesOfIndia.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="pincode" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                Pincode / ZIP Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="pincode"
                  required
                  maxLength={6}
                  className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                  placeholder="6 digit pincode"
                  value={checkoutFormData.postalCode || ''}
                  onChange={handlePincodeChange}
                />
                {isLoadingPincode && (
                  <div className="absolute right-3 top-3">
                    <div className="w-6 h-6 border-2 border-[#93a267] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {pincodeError ? (
                <p className="font-inter text-xs text-red-500 mt-1.5">{pincodeError}</p>
              ) : (
                <p className="font-inter text-xs text-gray-500 mt-1.5">
                  {checkoutFormData.postalCode?.length === 6 && !isLoadingPincode && checkoutFormData.city
                    ? '✓ Location auto-filled'
                    : 'Enter pincode to auto-fill city & state'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="font-inter block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                id="country"
                className="font-inter w-full h-12 px-4 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#93a267] focus:border-transparent transition-all"
                required
                value={checkoutFormData.country}
                onChange={(e) => {
                  setCheckoutFormData((prevData) => {
                    return { ...prevData, country: e.target.value };
                  });
                }}
              >
                <option value="" disabled>Select country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Address Checkbox */}
        <div className="mt-5 pt-5 border-t border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checkoutFormData.saveAddress}
              onChange={(e) => setCheckoutFormData(prev => ({ ...prev, saveAddress: e.target.checked }))}
              className="w-5 h-5 rounded border-gray-300 text-[#93a267] focus:ring-[#93a267] cursor-pointer"
            />
            <span className="font-inter text-sm text-gray-700">Save this address for future orders</span>
          </label>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="bg-[#faf9f7] rounded-2xl p-6 mb-6">
        <h2 className="font-inter text-lg font-semibold text-gray-900 mb-5">Shipping Method</h2>
        <div
          className="flex flex-col gap-3"
          onChange={(e) => {
            if (e.target.type === "radio" && e.target.checked) {
              dispatch(setShippingMethod(e.target.value));
              setCheckoutFormData((prevData) => {
                return { ...prevData, shippingMethod: e.target.value };
              });
            }
          }}
        >
          <label className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#93a267] transition-all">
            <input type="radio" name="shipping-rate" required value="standard" className="w-4 h-4 text-[#93a267] focus:ring-[#93a267]" />
            <div className="flex-1">
              <span className="font-inter font-medium text-gray-900">Standard Rate</span>
              <p className="font-inter text-sm text-gray-500">Delivery in 5-7 business days</p>
            </div>
            <span className="font-inter font-semibold text-gray-900">₹70.00</span>
          </label>

          <label className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#93a267] transition-all">
            <input type="radio" name="shipping-rate" required value="express" className="w-4 h-4 text-[#93a267] focus:ring-[#93a267]" />
            <div className="flex-1">
              <span className="font-inter font-medium text-gray-900">Express Rate</span>
              <p className="font-inter text-sm text-gray-500">Delivery in 2-3 business days</p>
            </div>
            <span className="font-inter font-semibold text-gray-900">₹100.00</span>
          </label>

          <label className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#93a267] transition-all">
            <input type="radio" name="shipping-rate" required value="free shipping" className="w-4 h-4 text-[#93a267] focus:ring-[#93a267]" />
            <div className="flex-1">
              <span className="font-inter font-medium text-gray-900">Free Shipping</span>
              <p className="font-inter text-sm text-gray-500">Delivery in 7-10 business days</p>
            </div>
            <span className="font-inter font-semibold text-[#93a267]">₹0</span>
          </label>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-[#faf9f7] rounded-2xl p-6 mb-8">
        <h2 className="font-inter text-lg font-semibold text-gray-900 mb-3">Payment Method</h2>
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="font-inter text-sm text-blue-800">Payment on delivery. No online payment functionality available yet.</p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 bg-[#93a267] hover:bg-[#7d8c56] text-white font-inter font-semibold text-lg rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Continue to Payment"}
      </button>

      {isLoading && <FullpageSpinnerLoader />}
    </form>
  );
};
