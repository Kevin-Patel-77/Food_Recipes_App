import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pushToOutbox } from "./outboxService";
import api from "../../Utils/axiosInstance/axiosInstance.ts"
import type { CartData, CartResponses } from "./CartSlice.js";

export const fetchCartFromServer = createAsyncThunk<CartResponses, void, { rejectValue: string }>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/cart");
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
      }
      return rejectWithValue("Something went wrong");
    }
  },
);

export const addToCartServer = createAsyncThunk<CartData, CartData, { rejectValue: string }>(
  "cart/add",
  async (item, { rejectWithValue }) => {
    try {
      if (navigator.onLine) {
        const existing = await api.get(`/cart/${item.productId}`).catch(() => null);

        if (existing && existing.data) {
          const res = await api.patch(`/cart/product/${item.productId}`, {
            quantity: existing.data.data.quantity + 1,
          });

          return res.data.data;
        } else {
          const res = await api.post("/cart/add", {
            productId: item.productId,
            price: item.price,
          });

          return res.data.data;
        }
      } else {
        await pushToOutbox({ type: "ADD", item });
        return item;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to add data");
      }
      return rejectWithValue("Something went wrong");
    }
  },
);

export const deleteFromCartServer = createAsyncThunk<CartData, CartData, { rejectValue: string }>(
  "cart/remove",
  async (item, { rejectWithValue }) => {
    try {
      if (navigator.onLine) {
        if (item.quantity > 1) {
          const res = await api.patch(`/cart/product/${item.productId}`, {
            quantity: item.quantity - 1,
          });
          return res.data.data;
        } else {
          await api.delete(`/cart/${item.productId}`);
          return { ...item, quantity: 0 };
        }
      } else {
        await pushToOutbox({ type: "REMOVE", item });
      }
      return item;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to add data");
      }
      return rejectWithValue("Something went wrong");
    }
  },
);
