import { useEffect, useMemo, useState } from "react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import {
  applyThemeColor,
  getEffectiveThemeColor,
  THEME_ROTATION_INTERVAL,
} from "@/lib/theme-colors";

export default function PrimaryColorController() {
  const { personalInfo, isLoading } = usePortfolio();
  const [rotationTick, setRotationTick] = useState(() => Date.now());
  const color = useMemo(
    () =>
      getEffectiveThemeColor(
        personalInfo.primaryColor,
        personalInfo.colorRotationEnabled,
        rotationTick,
      ),
    [personalInfo.primaryColor, personalInfo.colorRotationEnabled, rotationTick],
  );

  useEffect(() => {
    applyThemeColor(color);
  }, [color]);

  // Wait for saved settings so the style main.tsx restored doesn't flash back to the default
  useEffect(() => {
    if (isLoading) return;
    document.documentElement.dataset.corners = personalInfo.cornerStyle;
    try {
      localStorage.setItem("portfolio_corners", personalInfo.cornerStyle);
    } catch {}
  }, [isLoading, personalInfo.cornerStyle]);

  useEffect(() => {
    if (!personalInfo.colorRotationEnabled) return;
    const remaining =
      THEME_ROTATION_INTERVAL - (Date.now() % THEME_ROTATION_INTERVAL) + 50;
    const timer = window.setTimeout(() => setRotationTick(Date.now()), remaining);
    return () => window.clearTimeout(timer);
  }, [personalInfo.colorRotationEnabled, rotationTick]);

  return null;
}
