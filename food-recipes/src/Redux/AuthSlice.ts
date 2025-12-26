import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Users = {
  userName: string;
  email: string;
  password: string;
};

type initial = {
  credentials: Users[];
  isAuthenticated: boolean;
  loginStatus: "idle" | "success" | "error";
};

const storedUsers: Users[] = JSON.parse(localStorage.getItem("users") || "[]");
const storedLogin: boolean = JSON.parse(localStorage.getItem("isLogin") || "false");

const initialState: initial = {
  credentials: storedUsers,
  isAuthenticated: storedLogin,
  loginStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<Users>) {
      state.credentials.push(action.payload);
      localStorage.setItem("users", JSON.stringify(state.credentials));
    },
    login(state, action: PayloadAction<{ email: string; password: string }>) {
      const { email, password } = action.payload;

      const users = state.credentials.find((user) => {
        return user.email === email && user.password === password;
      });

      if (users) {
        state.isAuthenticated = true;
        state.loginStatus = "success";
        localStorage.setItem("isLogin", JSON.stringify(true));
      } else {
        state.isAuthenticated = false;
        state.loginStatus = "error";
        localStorage.setItem("isLogin", JSON.stringify(false));
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.loginStatus = "error";
      localStorage.setItem("isLogin", JSON.stringify(false));
    },
    resetLoginStatus(state) {
      state.loginStatus = "idle";
    },
  },
});

export const { addUser, login, logout, resetLoginStatus } = authSlice.actions;

export default authSlice.reducer;
