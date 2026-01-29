import { configureStore } from "@reduxjs/toolkit";
import recipesSlice from "../Menu/RecipesSlice"
import cartSlice from "../Cart/CartSlice"
import authSlice from "../Auth/AuthSlice"
import languageSlice from "../LanguageSlice"
import chatSlice from "../Chats/ChatSlice"



const recipesStore = configureStore({
  reducer: {
    foodrecipes: recipesSlice,
    foodCart: cartSlice,
    foodAuth: authSlice ,
    foodChats: chatSlice ,
    foodLanguage : languageSlice
  },
});

export type RootState = ReturnType<typeof recipesStore.getState>;

export type AppDispatch = typeof recipesStore.dispatch;

export default recipesStore;
