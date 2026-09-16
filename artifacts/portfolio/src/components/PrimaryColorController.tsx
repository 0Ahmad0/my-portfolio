import { useEffect, useMemo, useState } from "react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import {
  applyThemeColor,
  getEffectiveThemeColor,
  THEME_ROTATION_INTERVAL,
} from "@/lib/theme-colors";

export default function PrimaryColorController() {
  const { personalInfo } = usePortfolio();
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

  useEffect(() => {
    if (!personalInfo.colorRotationEnabled) return;
    const remaining =
      THEME_ROTATION_INTERVAL - (Date.now() % THEME_ROTATION_INTERVAL) + 50;
    const timer = window.setTimeout(() => setRotationTick(Date.now()), remaining);
    return () => window.clearTimeout(timer);
  }, [personalInfo.colorRotationEnabled, rotationTick]);

  return null;
}
