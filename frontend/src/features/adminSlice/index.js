import { createSlice } from "@reduxjs/toolkit";
import { createNewAdmin } from "./createNewAdmin";
import { fetchIsUserAnAdmin } from "./checkIfUserIsAnAdmin";
import { removeAdmin } from "./removeAdmin";
import { fetchAdminDatas } from "./fetchAdminData";

const initialState = {
  isLoading: false,
  checkingAdminStatusLoader: false,
  adminDatas: [],
};

export const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    getAdminDatas: (state, { payload }) => {
      state.adminDatas = payload;
    },
    setIsLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //createNewAdmin
      .addCase(createNewAdmin.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(createNewAdmin.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(createNewAdmin.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.successMessage = "";
      })

      // delete admin
      .addCase(removeAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeAdmin.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(removeAdmin.rejected, (state, { payload }) => {
        state.isLoading = false;
      })

      // fetch admin data
      .addCase(fetchAdminDatas.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminDatas.fulfilled, (state, { payload }) => {
        state.adminDatas = payload;
        state.userData = payload;
      })
      .addCase(fetchAdminDatas.rejected, (state, { payload }) => {
        state.isLoading = false;
      })

      // check if  user is an admin
      .addCase(fetchIsUserAnAdmin.pending, (state) => {
        state.checkingAdminStatusLoader = true;
      })
      .addCase(fetchIsUserAnAdmin.fulfilled, (state) => {
        state.checkingAdminStatusLoader = false;
      })
      .addCase(fetchIsUserAnAdmin.rejected, (state) => {
        state.checkingAdminStatusLoader = false;
      });
  },
});

export const { setIsLoading, getAdminDatas } = adminSlice.actions;

export default adminSlice.reducer;
