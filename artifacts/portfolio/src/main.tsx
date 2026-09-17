import { createRoot } from "react-dom/client";
import App from "./App";
import { mapPersonalInfo } from "./contexts/portfolio-data";
import { applyLook } from "./lib/theme-colors";
import "./index.css";

try {
  const savedLanguage =
    localStorage.getItem("portfolio_lang") === "ar" ? "ar" : "en";
  document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = savedLanguage;
} catch {
  document.documentElement.dir = "ltr";
  document.documentElement.lang = "en";
}

// Start from the last visit's look, then the saved one index.html began fetching,
// so the first render doesn't flash the default color
try {
  const cachedLook = localStorage.getItem("portfolio_look");
  if (cachedLook) applyLook(JSON.parse(cachedLook));
} catch {}
(window as { savedLook?: Promise<Record<string, unknown> | undefined> }).savedLook
  ?.then((row) => row && applyLook(mapPersonalInfo(row)));

createRoot(document.getElementById("root")!).render(<App />);
