import { useEffect, useState } from "react";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { defaultPersonalInfo } from "@/contexts/portfolio-data";
import { applyLook, THEME_ROTATION_INTERVAL } from "@/lib/theme-colors";

export default function PrimaryColorController() {
  const { personalInfo } = usePortfolio();
  const [rotationTick, setRotationTick] = useState(() => Date.now());

  // The default object means saved settings haven't loaded yet: keep the look
  // main.tsx restored instead of flashing the default violet
  useEffect(() => {
    if (personalInfo !== defaultPersonalInfo) applyLook(personalInfo);
  }, [personalInfo, rotationTick]);

  useEffect(() => {
    if (!personalInfo.colorRotationEnabled) return;
    const remaining =
      THEME_ROTATION_INTERVAL - (Date.now() % THEME_ROTATION_INTERVAL) + 50;
    const timer = window.setTimeout(() => setRotationTick(Date.now()), remaining);
    return () => window.clearTimeout(timer);
  }, [personalInfo.colorRotationEnabled, rotationTick]);

  return null;
}
