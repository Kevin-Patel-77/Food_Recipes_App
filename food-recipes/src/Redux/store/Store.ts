import { configureStore } from "@reduxjs/toolkit";
import recipesSlice from "../RecipesSlice";
import cartSlice from "../CartSlice";
import authSlice from "../AuthSlice";
import languageSlice from "../LanguageSlice"



const recipesStore = configureStore({
  reducer: {
    foodrecipes: recipesSlice,
    foodCart: cartSlice,
    foodAuth: authSlice ,
    foodLanguage : languageSlice
  },
});

export type RootState = ReturnType<typeof recipesStore.getState>;

export type AppDispatch = typeof recipesStore.dispatch;

export default recipesStore;
