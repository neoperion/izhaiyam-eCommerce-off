import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CheckoutForm } from "./checkoutForm";
import { OrderSummary } from "./orderSummary";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { isTokenValidBeforeHeadingToRoute } from "../../utils/isTokenValidBeforeHeadingToARoute";
import { getAllProductsData } from "../../features/productSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon";

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
  });

  // on reload, set the data after it has gotten userData from localstorage
  useEffect(() => {
    setCheckoutFormData((prevData) => {
      return { ...prevData, username: username };
    });
    setCheckoutFormData((prevData) => {
      return { ...prevData, email: email };
    });
  }, [email, username]);

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
        selectedColor: products.selectedColor || null
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
  };

  const placeOrderFn = async (e) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000/";
    e.preventDefault();

    console.log('🛒 Placing order with details:', JSON.stringify(orderDetails, null, 2));

    try {
      const { data } = await axios.post(`${serverUrl}orders/placeOrders`, { orderDetails });

      // Update Redux state with new user data (containing the new order)
      if (data.user) {
        dispatch({ type: "authSlice/getUserData", payload: data.user });

        // Update local storage to persist the new order data
        const currentData = JSON.parse(localStorage.getItem("UserData")) || {};
        const updatedData = { ...currentData, ...data.user }; // Merge existing token etc with new user data
        localStorage.setItem("UserData", JSON.stringify(updatedData));

        // Refetch products to show updated stock immediately
        dispatch(getAllProductsData());
      }

      toast("Order has successfully been placed, you can check profile page > orders to track order", {
        type: "success",
        autoClose: 4000,
        position: "top-center",
      });

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
          address: "",
          postalCode: "",
          shippingMethod: shippingMethod || "",
        };
      });
    } catch (error) {
      toast(error.response?.data?.message || error.message, {
        type: "error",
        autoClose: false,
        position: "top-center",
      });
    }
  };

  if (isTokenValidLoader) {
    return <FullpageSpinnerLoader />;
  } else {
    return (
      <>
        <div className="flex flex-col-reverse lg:flex-row lg:flex lg:w-[96%] xl:w-[92%] lg:mx-auto lg:justify-between mb-20 lg:items-start pt-20">
          <CheckoutForm {...{ placeOrderFn, checkoutFormData, setCheckoutFormData }} />
          <OrderSummary {...{ setTotalAmountToBePaid }} />
        </div>
      </>
    );
  }
};
