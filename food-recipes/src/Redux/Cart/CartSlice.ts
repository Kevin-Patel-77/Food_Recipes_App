import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "../RecipesSlice";
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
  reducers: {
    addCart(state, action: PayloadAction<Recipe>) {
      const exisitng = state.items.find((i) => i.id == action.payload.id);

      if (exisitng) {
        exisitng.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    deleteCart(state, action: PayloadAction<number>) {
      const deleteItem = state.items.find((i) => i.id == action.payload);

      if (deleteItem) {
        deleteItem.quantity -= 1;

        if (deleteItem.quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== action.payload);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartFromServer.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { addCart, deleteCart } = cartSlice.actions;

export default cartSlice.reducer;
