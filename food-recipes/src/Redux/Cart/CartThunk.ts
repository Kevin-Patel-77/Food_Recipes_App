import { createAsyncThunk } from "@reduxjs/toolkit";
import { CartItem } from "./CartSlice";
import axios from "axios";
import { pushToOutbox } from "./outboxService";

export const fetchCartFromServer = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get<CartItem[]>("/api/cart");
  return res.data;
});

export const addToCartServer = createAsyncThunk("cart/add", async (item: CartItem) => {
  if (navigator.onLine) {
    const existing = await axios.get(`/api/cart/${item.id}`).catch(() => null);

    if (existing && existing.data) {
      const res = await axios.patch(`/api/cart/${item.id}`, {
        quantity: existing.data.quantity + 1,
      });
      return res.data;
    } else {
      const res = await axios.post("/api/cart", item);
      return res.data;
    }
  } else {
    await pushToOutbox({ type: "ADD", item});
    return item; 
  }
});

export const deleteFromCartServer = createAsyncThunk("cart/remove", async (item: CartItem) => {
  if (navigator.onLine) {
    if (item.quantity > 1) {
      const res = await axios.patch(`/api/cart/${item.id}`, {
        quantity: item.quantity - 1,
      });
      return res.data;
    } else {
      await axios.delete(`/api/cart/${item.id}`);
    }
  } else {
    await pushToOutbox({ type: "REMOVE", item });
  }
  return item;
});
