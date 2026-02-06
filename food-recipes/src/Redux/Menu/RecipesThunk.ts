import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Utils/axiosInstance/axiosInstance";

type scrolling = {
  page: number;
  limit: number;
};

export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes", async ({ page, limit }: scrolling) => {
  const skip = (page - 1) * limit;
  const res = await api.get( `http://localhost:3000/product?_start=${skip}&_limit=${limit}`);
  return res.data;
});
