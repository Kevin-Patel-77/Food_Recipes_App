import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginSignupResponse, LoginWithCaptcha, SignupPayload } from "../Auth/AuthSlice";


export const signUpUser = createAsyncThunk< LoginSignupResponse, SignupPayload, { rejectValue: string }>(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:3000/auth/signup`, userData);
      
      return response.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Signup failed");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const loginUser = createAsyncThunk<LoginSignupResponse , LoginWithCaptcha , {rejectValue: string}>(
  "auth/loginUser" , 
  async ( userauthentication  , {rejectWithValue}) =>{
      try {
        const response = await axios.post(`http://localhost:3000/auth/login` , userauthentication)
        console.log(response.data)
        return response.data
      } catch (err) {
         if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Signup failed");
      }
      return rejectWithValue("Something went wrong");
      }
  }
)


