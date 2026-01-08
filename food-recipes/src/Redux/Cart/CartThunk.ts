import { createAsyncThunk } from "@reduxjs/toolkit";
import { CartItem } from "./CartSlice";
import axios from "axios";

export const fetchCartFromServer = createAsyncThunk("cart/fetchCart", async () => {
  const res = await axios.get<CartItem[]>("/api/cart");
  return res.data;
});

export const addToCartServer = createAsyncThunk("cart/addToServer", async (item: CartItem) => {
  const existing = await axios.get(`/api/cart/${item.id}`).catch(() => null);
  if (existing && existing.data) {
    const newQty = existing.data.quantity + 1;
    const res = await axios.patch(`/api/cart/${item.id}`, { quantity: newQty });
    return res.data;
  } else {
    const res = await axios.post("/api/cart", item);
    return res.data;
  }
});

export const deleteFromCartServer = createAsyncThunk("cart/deleteFromServer", async (item: CartItem) => {
  if (item.quantity > 1) {
    const res = await axios.patch(`/api/cart/${item.id}`, { quantity: item.quantity - 1 });
    return res.data;
  } else {
    await axios.delete(`/api/cart/${item.id}`);
  }
});
