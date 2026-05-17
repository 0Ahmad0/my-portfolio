import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

try {
  const savedLanguage = (localStorage.getItem("portfolio_lang") as "en" | "ar") || "en";
  document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = savedLanguage;
} catch {
  document.documentElement.dir = "ltr";
  document.documentElement.lang = "en";
}

createRoot(document.getElementById("root")!).render(<App />);
