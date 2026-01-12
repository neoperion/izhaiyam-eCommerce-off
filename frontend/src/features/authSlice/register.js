import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API from "../../config";

const serverUrl = API;

export const RegisterUser = createAsyncThunk("users/register", async (userParameter, thunkAPI) => {
  try {
    const { email, password, username, firstName, lastName, phone } = userParameter;
    const { data } = await axios.post(serverUrl + "/api/v1/auth/register", { email, username, password, firstName, lastName, phone });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data?.message || error.message);
  }
});
