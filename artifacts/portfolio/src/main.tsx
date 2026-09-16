import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

try {
  const savedLanguage =
    localStorage.getItem("portfolio_lang") === "ar" ? "ar" : "en";
  document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = savedLanguage;
  if (localStorage.getItem("portfolio_corners") === "rounded")
    document.documentElement.dataset.corners = "rounded";
} catch {
  document.documentElement.dir = "ltr";
  document.documentElement.lang = "en";
}

createRoot(document.getElementById("root")!).render(<App />);
