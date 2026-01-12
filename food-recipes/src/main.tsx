import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import recipesStore from "./Redux/store/Store.ts";
import "./Utils/i18n";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}



createRoot(document.getElementById("root")!).render(
  <Provider store={recipesStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
