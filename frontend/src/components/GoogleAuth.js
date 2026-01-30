import React, { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import API from "../config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLoggedIn, getUserData } from "../features/authSlice";
import { useToast } from "../context/ToastContext";

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();

  // Debug API URL to ensure we are hitting the correct backend
  useEffect(() => {
    console.log("GoogleAuth Component Mounted. Using API Base URL:", API);
  }, []);

  const handleSuccess = async (res) => {
    try {
      console.log("Google Sign-In Success. Token received. Authenticating with backend...");
      
      const result = await axios.post(`${API}/api/auth/google-login`, {
        token: res.credential
      });

      const { userData } = result.data;
      console.log("Backend Authentication Successful. User Data:", userData);

      // 1. Save to LocalStorage
      if (userData.loginToken) {
        localStorage.setItem("token", userData.loginToken);
      }
      localStorage.setItem("UserData", JSON.stringify(userData));

      // 2. Update Redux State
      dispatch(setIsLoggedIn(true));
      dispatch(getUserData(userData));

      // 3. User Feedback & Navigation
      toastSuccess("Login Successful! Redirecting...");
      
      // Navigate to home immediately
      navigate("/");
      
    } catch (error) {
      console.error("Google Backend Auth Error:", error);
      const errorMessage = error.response?.data?.message || "Google Login Failed";
      toastError(errorMessage);
    }
  };

  return (
    <div className="w-full flex justify-center mt-2">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={(err) => {
          console.error("Google Login Error:", err);
          toastError("Google Login Failed from Provider");
        }}
        theme="outline"
        // Removed explicit width="100%" to avoid GSI warning. 
        // Handles responsive width via container div.
      />
    </div>
  );
};

export default GoogleAuth;
