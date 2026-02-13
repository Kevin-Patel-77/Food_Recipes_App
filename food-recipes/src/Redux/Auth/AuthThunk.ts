import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  LoginLogoutSignupResponse,
  LoginWithCaptcha,
  SignupPayload,
} from "../Auth/AuthSlice";
import api from "../../Utils/axiosInstance/axiosInstance";

export const signUpUser = createAsyncThunk<
  LoginLogoutSignupResponse,
  SignupPayload,
  { rejectValue: string }
>("auth/signupUser", async (userData, { rejectWithValue }) => {
  try {
    const signupData = {
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
    };

    const response = await api.post(`/auth/signup`, signupData);

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
    return rejectWithValue("Something went wrong");
  }
});

export const loginUser = createAsyncThunk<
  LoginLogoutSignupResponse,
  LoginWithCaptcha,
  { rejectValue: string }
>("auth/loginUser", async (userauthentication, { rejectWithValue }) => {
  try {
    const loginData = {
      email: userauthentication.email.toLowerCase().trim(),
      password: userauthentication.password,
      hcaptchaToken: userauthentication.hcaptchaToken,
    };

    const response = await api.post(`/auth/login`, loginData);

    localStorage.setItem("accessToken", response.data.data.access_token);
    localStorage.setItem("refreshToken", response.data.data.refresh_token);

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
    return rejectWithValue("Something went wrong");
  }
});

export const logoutUser = createAsyncThunk<
  LoginLogoutSignupResponse,
  void,
  { rejectValue: string }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const res = await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `${import.meta.env.VITE_SOCKET_TOKEN_PREFIX} ${refreshToken}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
    return rejectWithValue("Something went wrong");
  }
});
