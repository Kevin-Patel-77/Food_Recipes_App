import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

type scrolling = {
  page: number,
  limit: number
}

export type Recipe = {
  id: number;
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
}

export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async ({ page, limit }: scrolling) => {
  let skip = ((page - 1) * limit)
  let res = await axios.get(`/api/recipes?limit=${limit}&skip=${skip}`)
  return res.data.recipes
})

export type initial = {
  loading: boolean,
  recipes: Recipe[],
  page: number,
  error: string | null,
  hasMore: boolean
}

const initialState: initial = {
  loading: false,
  recipes: [],
  page: 1,
  error: null,
  hasMore: true
}


const recipesReducer = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    increasePage(state) {
      state.page += 1
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.length === 0) {
          state.hasMore = false
          return
        }
        state.recipes = [...state.recipes, ...action.payload]
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Something went wrong"
      })
  }
})

export const { increasePage } = recipesReducer.actions

export default recipesReducer.reducer