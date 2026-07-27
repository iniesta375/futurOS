import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@styles/globals.css";

import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import { initAnalytics } from "@utils/analytics";

initAnalytics();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
    />
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        console.info("[FuturOS] Service worker registered:", reg.scope);
      })
      .catch((err) => {
        console.warn("[FuturOS] Service worker registration failed:", err);
      });
  });
}