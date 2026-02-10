import { createSlice } from "@reduxjs/toolkit";
import { fetchRecipes, filteredData } from "./RecipesThunk";

export type Recipe = {
  id: string;
  price: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  image: string;
  rating: number;
  mealType: string[];
};

export type RecipeResponses = {
  success: boolean;
  message: string;
  items: Recipe[];
  meta: {
    limit: number;
    skip: number;
    total: number;
    totalItems: number;
  };
  expired: false;
  statusCode: 200;
};

export type initial = {
  loading: boolean;
  recipes: Recipe[];
  page: number;
  error: string | null;
  hasMore: boolean;
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
    clearRecipes(state) {
      state.recipes = [];
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
    resetPage: (state) => {
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetching Recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.items.length === 0) {
          state.hasMore = false;
          return;
        }

        state.recipes.push(...action.payload.items);
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      // Fetching Filtered Recipes
      .addCase(filteredData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filteredData.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.items.length === 0) {
          state.hasMore = false;
          return;
        }
        state.recipes.push(...action.payload.items);
      })
      .addCase(filteredData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { increasePage, clearRecipes, resetPage } = recipesSlice.actions;

export default recipesSlice.reducer;
