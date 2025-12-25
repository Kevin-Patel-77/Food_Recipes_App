import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import recipesStore from "./Components/Redux/store/Store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={recipesStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register("/sw.js");
}
