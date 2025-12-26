import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import recipesStore from "./Redux/store/Store.ts";
import { I18nProvider } from "@lingui/react";
import {i18n} from "./LanguageSetup/i18n.ts"

createRoot(document.getElementById("root")!).render(
  <Provider store={recipesStore}>
    <I18nProvider i18n={i18n}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </I18nProvider>
  </Provider>
);
