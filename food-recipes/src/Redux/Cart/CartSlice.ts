import { createSlice } from "@reduxjs/toolkit";
import { addToCartServer, fetchCartFromServer } from "./CartThunk";

export interface CartData {
  productId: string;
  quantity: number;
  price: number;
  image: string;
  name: string;
  mealType: string[];
}

export interface CartResponses {
  success: boolean;
  message: string;
  data: CartData[];
  meta: {
    limit: number;
    skip: number;
    total: number;
    totalItems: number;
  };
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
        state.items = [...state.items, ...action.payload.data];
      })
      .addCase(addToCartServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default cartSlice.reducer;
