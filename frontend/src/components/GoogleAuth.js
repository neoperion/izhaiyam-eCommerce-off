import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import API from "../config";

const GoogleAuth = () => {
  // Debug check to verify env var is loaded (security: only log first few chars)
  const debugClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID 
    ? process.env.REACT_APP_GOOGLE_CLIENT_ID.substring(0, 10) + "..." 
    : "MISSING";
  
  console.log("GoogleAuth Initialized. ClientID loaded:", debugClientId);

  const handleSuccess = async (res) => {
    try {
      const result = await axios.post(`${API}/api/auth/google-login`, {
        token: res.credential
      });

      // Backend now returns: { message: "...", userData: { ...user, loginToken: ... } }
      // This matches the format of the standard login response.
      const { userData } = result.data;

      // 1. Set the token as requested by user originally
      if (userData.loginToken) {
        localStorage.setItem("token", userData.loginToken);
      }

      // 2. Set the UserData object as required by the application's redux/store
      localStorage.setItem("UserData", JSON.stringify(userData));

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Google Login Failed");
    }
  };

  return (
    <div className="w-full flex justify-center mt-2">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={(err) => {
          console.error("Google Login Error:", err);
          alert("Google Login Failed. Check console for details."); 
        }}
        theme="outline"
        width="100%"
      />
    </div>
  );
};

export default GoogleAuth;
