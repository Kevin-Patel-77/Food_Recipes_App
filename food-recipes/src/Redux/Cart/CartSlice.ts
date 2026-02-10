import { createSlice } from "@reduxjs/toolkit";
import { Recipe } from "../Menu/RecipesSlice"
import { fetchCartFromServer } from "./CartThunk";

export type CartItem = Recipe & { quantity: number };

type initial = {
  items: CartItem[];
};

const initialState: initial = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCartFromServer.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default cartSlice.reducer;
