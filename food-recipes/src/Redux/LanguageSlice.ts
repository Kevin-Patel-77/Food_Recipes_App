import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LanguageState = {
  lang: "en" | "fr" | "es";
};

const getInitialLanguage = (): LanguageState["lang"] => {
  const storedLang = localStorage.getItem("AppLanguage");
  if (storedLang === "en" || storedLang === "fr" || storedLang === "es") {
    return storedLang;
  }
  return "en";
};

const initialState: LanguageState = {
  lang: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageState["lang"]>) => {
      state.lang = action.payload;
      localStorage.setItem("AppLanguage", action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
