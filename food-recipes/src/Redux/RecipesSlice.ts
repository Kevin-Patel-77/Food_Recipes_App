import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type scrolling = {
  page: number;
  limit: number;
};

export type Recipe = {
  id: number;
  amount: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};

export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes", async ({ page, limit }: scrolling) => {
  const skip = (page - 1) * limit;
  const res = await axios.get( `http://localhost:3000/recipes?_start=${skip}&_limit=${limit}`);
  return res.data;
});

export type initial = {
  loading: boolean;
  recipes: Recipe[];
  page: number;
  error: string | null;
  hasMore: boolean; 
};

const generateAmount = (id: number): number => {
  return (id * 73) % 1000;
};

const initialState: initial = {
  loading: false,
  recipes: [],
  page: 1,
  error: null,
  hasMore: true,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    increasePage(state) {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length === 0) {
          state.hasMore = false;
          return;
        }

        const updateRecipes = action.payload.map((res: Recipe) => ({
          ...res,
          amount: generateAmount(res.id),
        }));
        state.recipes = [...state.recipes, ...updateRecipes];
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { increasePage } = recipesSlice.actions;

export default recipesSlice.reducer;
