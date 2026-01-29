import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CheckoutForm } from "./checkoutForm";
import { OrderSummary } from "./orderSummary";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { isTokenValidBeforeHeadingToRoute } from "../../utils/isTokenValidBeforeHeadingToARoute";
import { getAllProductsData } from "../../features/productSlice";
import axios from "axios";
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon";
import API from "../../config";
import Swal from 'sweetalert2';
import OrderSuccessModal from "../../components/modals/OrderSuccessModal";

export const CheckoutPage = ({ setIsCartSectionActive }) => {
  const { cart } = useSelector((state) => state.wishlistAndCartSection);

  const {
    isTokenValidLoader,
    userData: { email, username, country, city, address, postalCode, shippingMethod },
  } = useSelector((state) => state.userAuth);

  const [totalAmountToBePaid, setTotalAmountToBePaid] = useState(0);

  const [checkoutFormData, setCheckoutFormData] = useState({
    username: username || "",
    email: email,
    phone: "",
    addressType: "Home",
    addressLine1: "",
    addressLine2: "",
    city: city || "",
    state: "",
    country: country || "India",
    postalCode: postalCode || "",
    address: address || "",
    shippingMethod: shippingMethod || "",
    saveAddress: false
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // on reload, set the data after it has gotten userData from localstorage
  useEffect(() => {
    setCheckoutFormData((prevData) => {
      return { ...prevData, username: username };
    });
    setCheckoutFormData((prevData) => {
      return { ...prevData, email: email };
    });
  }, [email, username]);

  // Fetch saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  useEffect(() => {
    const fetchAddresses = async () => {
      const userData = localStorage.getItem("UserData");
      if (!userData) return;

      const parsed = JSON.parse(userData);
      const token = parsed.loginToken;
      const serverUrl = API;

      try {
        const response = await axios.get(`${serverUrl}/api/v1/address`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setSavedAddresses(response.data.addresses);

          // Preselect default
          const defaultAddr = response.data.addresses.find(a => a.isDefault);
          if (defaultAddr) {
            setCheckoutFormData(prev => ({
              ...prev,
              addressType: defaultAddr.addressType,
              addressLine1: defaultAddr.addressLine1,
              addressLine2: defaultAddr.addressLine2,
              city: defaultAddr.city,
              state: defaultAddr.state,
              country: defaultAddr.country,
              postalCode: defaultAddr.postalCode,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch addresses", error);
      }
    };
    fetchAddresses();
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cart.length <= 0) {
      navigate("/");
      setIsCartSectionActive(true);
    }
  }, [cart.length, navigate, setIsCartSectionActive]);

  useEffect(() => {
    isTokenValidBeforeHeadingToRoute(dispatch, navigate);
  }, [dispatch, navigate]);

  const orderDetails = {
    products: cart.map((products) => {
      return {
        productId: products._id,
        quantity: products.quantity,

        // Pass full object for Backend to extract Details + Stock Check
        selectedColor: products.selectedColor || null,

        // Flatten Wood Data for Order Schema (String + Number)
        woodType: products.wood?.type || (products.woodType?.name || products.woodType) || "Not Selected",
        woodPrice: products.wood?.price || products.woodType?.price || 0,

        unitPrice: products.price,
        totalPrice: products.price * products.quantity
      };
    }),
    username: checkoutFormData.username,
    email: checkoutFormData.email,
    phone: checkoutFormData.phone,
    addressType: checkoutFormData.addressType,
    addressLine1: checkoutFormData.addressLine1,
    addressLine2: checkoutFormData.addressLine2,
    address: checkoutFormData.address || `${checkoutFormData.addressLine1}, ${checkoutFormData.addressLine2}`,
    city: checkoutFormData.city,
    state: checkoutFormData.state,
    country: checkoutFormData.country,
    postalCode: checkoutFormData.postalCode,
    shippingMethod: checkoutFormData.shippingMethod,
    deliveryStatus: "pending",
    paymentStatus: "pending",
    totalAmount: totalAmountToBePaid,
    saveAddress: checkoutFormData.saveAddress
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrderFn = async (e) => {
    e.preventDefault();
    const serverUrl = API;

    // 1. Load Razorpay Script
    const isScriptLoaded = await loadRazorpay();
    if (!isScriptLoaded) {
      console.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // 2. Create Order on Backend (Validates Stock)
      const { data: { key, id: order_id, currency, amount } } = await axios.post(`${serverUrl}/orders/create-razorpay-order`, {
        amount: totalAmountToBePaid,
        products: orderDetails.products // Send products for stock check
      });

      // 3. Open Razorpay Option
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || key, // Enter the Key ID generated from the Dashboard
        amount: amount,
        currency: currency,
        name: "Izhaiyam Handloom Furniture",
        description: "Order Payment",
        // image: "https://your-logo-url.com/logo.png", // Removed or replace with valid logo if available
        order_id: order_id,
        handler: async function (response) {
          // 4. Verify Payment
          try {
            const verifyRes = await axios.post(`${serverUrl}/orders/verify-payment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: { ...orderDetails, paymentStatus: 'paid' } // Pass full order details to create order after verification
            });

              if (verifyRes.data.success) {
                // Success Popup
                setShowSuccessModal(true);

                // Clear Form
                setCheckoutFormData((prevData) => {
                  return { 
                    ...prevData,
                    username: "",
                    email: email,
                    phone: "",
                    addressType: "Home",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    country: "India",
                    postalCode: "",
                    shippingMethod: shippingMethod || "",
                    saveAddress: false
                  };
                });
                
                // Navigate to My Orders logic moved to modal
              }


          } catch (err) {
            console.error("Payment Verification Failed: " + (err.response?.data?.message || err.message));
          }
        },
        prefill: {
          name: checkoutFormData.username,
          email: checkoutFormData.email,
          contact: checkoutFormData.phone,
        },
        notes: {
          address: checkoutFormData.addressLine1 + ", " + checkoutFormData.city,
        },
        theme: {
          color: "#93a267",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.error("Payment Failed: " + response.error.description);
      });
      rzp1.open();

    } catch (error) {
      console.error(error);
    }
  };

  if (isTokenValidLoader) {
    return <FullpageSpinnerLoader />;
  } else {
    return (
      <>
        <div className="flex flex-col-reverse lg:flex-row lg:flex lg:w-[96%] xl:w-[92%] lg:mx-auto lg:justify-between mb-20 lg:items-start pt-0 lg:pt-20">
          <CheckoutForm {...{ placeOrderFn, checkoutFormData, setCheckoutFormData, savedAddresses }} />
          <OrderSummary {...{ setTotalAmountToBePaid }} />
          <OrderSuccessModal 
            isOpen={showSuccessModal} 
            onClose={() => navigate('/')} 
            onViewOrder={() => navigate('/profilePage/accountInformation')} 
          />
        </div>
      </>
    );
  }
};
