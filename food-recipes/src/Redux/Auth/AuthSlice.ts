import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signUpUser } from "./AuthThunk";


export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginSignupResponse = {
  success:boolean;
  message:string
};

export type LoginPayload = {
  email:string;
  password:string;
}

export type LoginWithCaptcha = LoginPayload & {
  hcaptchaToken: string;
};


export type AuthState = {
  user: LoginSignupResponse  | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Something went wrong";
      })
      
    // Login 
      .addCase(loginUser.pending,(state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(loginUser.fulfilled , (state , action)=>{
        state.loading = false;
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected , (state , action)=>{
        state.loading = false;
        state.error = action.payload as string || "Something went wrong"
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
