import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./ChatSlice";
import api from "../../Utils/axiosInstance/axiosInstance";
import axios from "axios";

interface chatsHistoryPayload {
  limit: number;
  page: number;
  conversationId: string | null;
}

export const fetchUserList = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("chat/fetchUserList", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/user");
    return res.data.data as User[];
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users",
      );
    }
    return rejectWithValue("Something went wrong");
  }
});

export const chatsHistory = createAsyncThunk(
  "/chats/chatsHistory",
  async ({ limit, page, conversationId }: chatsHistoryPayload) => {
    try {
      const skip = (page - 1) * limit;

      const res = await api.get(
        `/websocket/messages/${conversationId}?_start=${skip}&_limit=${limit}`,
      );
      return res.data.data;
    } catch (error) {
      console.log("Error to fetch chats", error);
      throw error;
    }
  },
);
