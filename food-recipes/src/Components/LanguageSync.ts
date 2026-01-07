import { useEffect } from "react";
import { useAppSelector } from "./hooks";
import i18n from "i18next";

const LanguageSync = () => {
  const lang = useAppSelector(state => state.foodLanguage.lang);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return null;
};

export default LanguageSync;
