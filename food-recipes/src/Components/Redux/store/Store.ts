import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "../RecipesReducer";
import cartReducer from "../CartReducers";
import authReducer from "../AuthReducer";

const recipesStore = configureStore({
  reducer: {
    foodrecipes: recipesReducer,
    foodCart: cartReducer,
    foodAuth: authReducer,
  },
});

export type RootState = ReturnType<typeof recipesStore.getState>;

export type AppDispatch = typeof recipesStore.dispatch;

export default recipesStore;
