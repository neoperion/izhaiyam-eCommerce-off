import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../config";

const serverUrl = API;

export const loginUser = createAsyncThunk("users/login", async (userParameter, thunkAPI) => {
  try {
    const { email, password } = userParameter;
    const { data } = await axios.post(serverUrl + "/api/v1/auth/login", { email, password });

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data?.message || error.message);
  }
});
