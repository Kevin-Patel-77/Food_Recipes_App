import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import lf from "../Storage/localForage";

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

  if (!navigator.onLine) {
    const offlineData = (await lf.getItem<Recipe[]>("recipes")) || [];

    
    const uniqueOfflineData: Recipe[] = offlineData.filter(
      (recipe, index, self) => index === self.findIndex((r) => r.id === recipe.id)
    );

    console.log("Offline unique", uniqueOfflineData);
    return { recipes: uniqueOfflineData, offline: true };
  }

  
  const res = await axios.get(`/api/recipes?limit=${limit}&skip=${skip}`);
  const recipes = res.data.recipes;

  const existing = (await lf.getItem<Recipe[]>("recipes")) || [];

 
  const newUniqueRecipes = recipes.filter((r: Recipe) => !existing.some((e) => e.id === r.id));

  const merged = [...existing, ...newUniqueRecipes];
  await lf.setItem("recipes", merged);

  return { recipes, offline: false };
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
        const { recipes, offline } = action.payload;

        if (offline) {
          state.recipes = recipes.map((res: Recipe) => ({
            ...res,
            amount: generateAmount(res.id),
          }));
          state.hasMore = false;
          return;
        }

        if (recipes.length === 0) {
          state.hasMore = false;
          return;
        }

        const updateRecipes = recipes.map((res: Recipe) => ({
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
