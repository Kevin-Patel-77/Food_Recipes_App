import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./ChatSlice";
import api from "../../Utils/axiosInstance/axiosInstance";
import axios from "axios";

interface GetSignedUrlPayload {
  file: File;
  token: string | null;
}

interface confirmFileUploadPayload {
  fileId: string;
  token: string | null;
}

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

export const getFileId = async ({ file, token }: GetSignedUrlPayload) => {
  try {
    const res = await api.post(
      "/files/upload/signed-url",
      {
        filename: file.name,
        type: file.type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data.data;
  } catch (error) {
    console.log("Error in getting signed URL:", error);
    throw error;
  }
};

export const uploadFileToSignedUrl = async (
  signedUrl: string,
  selectedFile: File,
) => {
  try {
    await api.put(signedUrl, selectedFile, {
      headers: {
        "Content-Type": selectedFile.type,
      },
    });
  } catch (error) {
    console.log("Error in uploading file to signed URL:", error);
    throw error;
  }
};

export const confirmFileUpload = async ({
  fileId,
  token,
}: confirmFileUploadPayload) => {
  try {
    const res = await api.post(
      `/files/${fileId}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log("Error in confirming file upload:", error);
    throw error;
  }
};

export const chatsHistory = createAsyncThunk(
  "/chats/chatsHistory",
  async ({ limit, page, conversationId }: chatsHistoryPayload) => {
    try {
      const skip = (page - 1) * limit;

      const res = await api.get(
        `/websocket/messages/${conversationId}?_start=${skip}&_limit=${limit}`,
      );
      return res.data;
    } catch (error) {
      console.log("Error to fetch chats", error);
      throw error;
    }
  },
);
