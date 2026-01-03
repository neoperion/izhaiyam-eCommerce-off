import { createSlice } from "@reduxjs/toolkit";
import { RegisterUser } from "./register";
import { loginUser } from "./login";
import { fetchForgotPasswordClick } from "./fetchForgotPasswordClick";
import { fetchIsTokenValid } from "./fetchIsTokenValid";
import { fetchResendEmailVerificationLink } from "./resendEmailVerification";
import { toast } from "react-toastify";

const initialState = {
  isLoggedIn: false,
  isLoading: false,
  isTokenValidLoader: false,
  userData: "",
  shippingMethod: "standard",
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setShippingMethod: (state, { payload }) => {
      state.shippingMethod = payload;
    },
    getUserData: (state, { payload }) => {
      state.userData = payload;
    },
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setIsLoggedIn: (state, { payload }) => {
      state.isLoggedIn = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //register reducers
      .addCase(RegisterUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessageInRegisterPage = "";
        state.successMessageInRegisterPage = "";
      })
      .addCase(RegisterUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        toast(payload, {
          type: "success",
        });
      })
      .addCase(RegisterUser.rejected, (state, { payload }) => {
        state.isLoading = false;

        toast(payload, {
          type: "error",
        });
      })

      // login reducers
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.isLoggedIn = true;

        localStorage.setItem("UserData", JSON.stringify(payload.userData));
        state.userData = payload.userData;
        toast(payload.message, {
          type: "success",
        });
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;

        toast(payload, {
          type: "error",
        });
      })
      // fetch forgotpasssword click controller from server
      .addCase(fetchForgotPasswordClick.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchForgotPasswordClick.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        toast(payload, {
          type: "success",
        });
      })
      .addCase(fetchForgotPasswordClick.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast(payload, {
          type: "error",
        });
      })
      //resend email verification
      .addCase(fetchResendEmailVerificationLink.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchResendEmailVerificationLink.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        toast(payload, {
          type: "success",
        });
      })
      .addCase(fetchResendEmailVerificationLink.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast(payload, {
          type: "error",
        });
      })
      // fetch isTokenValid controller from servers
      .addCase(fetchIsTokenValid.pending, (state) => {
        state.isTokenValidLoader = true;
      })
      .addCase(fetchIsTokenValid.fulfilled, (state, { payload }) => {
        state.isTokenValidLoader = false;
        state.isLoggedIn = true;
        if (payload.user) {
          state.userData = payload.user;
        }
      })
      .addCase(fetchIsTokenValid.rejected, (state, { payload }) => {
        state.isLoggedIn = false;
        state.userData = "";
        state.isTokenValidLoader = false;
      });
  },
});

export const { setIsLoading, setIsLoggedIn, getUserData, setShippingMethod } = authSlice.actions;

export default authSlice.reducer;
