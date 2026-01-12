import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginLogoutSignupResponse, LoginWithCaptcha, SignupPayload } from "../Auth/AuthSlice";
import api from "../../Utils/axiosInstance/axiosInstance";

export const signUpUser = createAsyncThunk<LoginLogoutSignupResponse, SignupPayload, { rejectValue: string }>(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/signup`, userData);

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Signup failed");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const loginUser = createAsyncThunk<LoginLogoutSignupResponse, LoginWithCaptcha, { rejectValue: string }>(
  "auth/loginUser",
  async (userauthentication, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/login`, userauthentication);

      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Login failed");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const logoutUser = createAsyncThunk<LoginLogoutSignupResponse, void ,  { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // const token = localStorage.getItem("accessToken");

      const res = await api.post("/auth/logout")

     return res.data;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Logout failed");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);
