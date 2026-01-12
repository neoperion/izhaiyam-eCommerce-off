import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../config";

const serverUrl = API;

export const fetchAdminDatas = createAsyncThunk("admin/fetchAdminDatas", async (_, thunkAPI) => {
  try {
    const LoginToken = JSON.parse(localStorage.getItem("UserData")).loginToken || " ";
    const header = { headers: { authorization: `Bearer ${LoginToken}` } };

    const { data } = await axios.get(serverUrl + "/api/v1/admin/fetchAdminDatas", header);

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
