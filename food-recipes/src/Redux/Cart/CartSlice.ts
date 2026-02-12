import { createSlice } from "@reduxjs/toolkit";
import { addToCartServer, deleteFromCartServer, fetchCartFromServer } from "./CartThunk";

export interface CartData {
  productId: string;
  quantity: number;
  price: number;
  image: string;
  mealType: string[];
  name: string;
}

export interface CartResponses {
  success: boolean;
  message: string;
  data: CartData[];
  expired: false;
  statusCode: number;
}

interface initial {
  loading: boolean;
  items: CartData[];
  error: string | null;
}

const initialState: initial = {
  loading: false,
  items: [],
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch CartData
      .addCase(fetchCartFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchCartFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Add To Cart
      .addCase(addToCartServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartServer.fulfilled, (state, action) => {
        state.loading = false;

        const updatedItem = action.payload;

        const index = state.items.findIndex((item) => item.productId === updatedItem.productId);

        if (index !== -1) {
          state.items[index] = updatedItem;
        } else {
          state.items.push(updatedItem);
        }
      })
      .addCase(addToCartServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Delete From Cart Server
      .addCase(deleteFromCartServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFromCartServer.fulfilled, (state, action) => {
        state.loading = false;

        const updatedItem = action.payload;

        const index = state.items.findIndex((item) => item.productId === updatedItem.productId);

        if (index !== -1) {
          if (updatedItem.quantity > 0) {
            state.items[index] = updatedItem;
          } else {
            state.items.splice(index, 1);
          }
        }
      })
      .addCase(deleteFromCartServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default cartSlice.reducer;
