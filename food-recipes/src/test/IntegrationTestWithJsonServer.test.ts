import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import recipesReducer, { initial as RecipesState } from "../Redux/RecipesSlice";
import { fetchRecipes } from "../Redux/RecipesSlice";

const createStore = () =>
  configureStore({
    reducer: {
      recipes: recipesReducer,
    },
  });

describe("recipes integration test (json-server)", () => {
  it("fetches recipes and updates store correctly", async () => {
    const store = createStore();

    const result = await store.dispatch(fetchRecipes({ page: 1, limit: 5 }));

    const state: RecipesState = store.getState().recipes;

    expect(result.type).toBe("recipes/fetchRecipes/fulfilled");

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.recipes.length).toBeGreaterThan(0);
    expect(state.recipes[0]).toHaveProperty("amount");
    expect(state.hasMore).toBe(true);
  });
});
