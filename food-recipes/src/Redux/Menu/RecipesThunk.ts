import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Utils/axiosInstance/axiosInstance";
import { RecipeResponses } from "./RecipesSlice";
import axios from "axios";

interface scrolling {
  page: number;
  limit: number;
}

interface Filterdata extends scrolling {
  query: string;
}

export const fetchRecipes = createAsyncThunk<RecipeResponses, scrolling, { rejectValue: string }>(
  "recipes/fetchRecipes",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const skip = (page - 1) * limit;
      const res = await api.get(`/product?_start=${skip}&_limit=${limit}`);
      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch recipes");
      }
      return rejectWithValue("Something went wrong");
    }
  },
);

export const filteredData = createAsyncThunk<RecipeResponses, Filterdata, { rejectValue: string }>(
  "recipes/filteredData",
  async ({ page, limit, query }, { rejectWithValue }) => {
    try {
      const skip = (page - 1) * limit;
      const res = await api.get(`/product?${query}&_start=${skip}&_limit=${limit}`);
      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch filteredRecipes");
      }
      return rejectWithValue("Something went wrong");
    }
  },
);
