export const THEME_ROTATION_INTERVAL = 60 * 1000;
export const DEFAULT_PRIMARY_COLOR = "#6D28D9";

export const CURATED_THEME_COLORS = [
  { value: "#6D28D9", nameEn: "Violet", nameAr: "بنفسجي" },
  { value: "#4338CA", nameEn: "Indigo", nameAr: "نيلي" },
  { value: "#1D4ED8", nameEn: "Blue", nameAr: "أزرق" },
  { value: "#0E7490", nameEn: "Cyan", nameAr: "سماوي" },
  { value: "#0F766E", nameEn: "Teal", nameAr: "فيروزي" },
  { value: "#15803D", nameEn: "Green", nameAr: "أخضر" },
  { value: "#B45309", nameEn: "Amber", nameAr: "كهرماني" },
  { value: "#C2410C", nameEn: "Orange", nameAr: "برتقالي" },
  { value: "#BE123C", nameEn: "Rose", nameAr: "وردي" },
  { value: "#A21CAF", nameEn: "Fuchsia", nameAr: "فوشيا" },
] as const;

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function normalizeThemeColor(value?: string) {
  return value && HEX_COLOR.test(value) ? value.toUpperCase() : DEFAULT_PRIMARY_COLOR;
}

export function getEffectiveThemeColor(
  selectedColor: string,
  rotationEnabled: boolean,
  timestamp = Date.now(),
) {
  if (!rotationEnabled) return normalizeThemeColor(selectedColor);
  const slot = Math.floor(timestamp / THEME_ROTATION_INTERVAL);
  return CURATED_THEME_COLORS[slot % CURATED_THEME_COLORS.length].value;
}

function readableForeground(hue: number, saturation: number, lightness: number) {
  const channel = (offset: number) => {
    const value = (offset + hue / 30) % 12;
    const chroma = (saturation / 100) * Math.min(lightness / 100, 1 - lightness / 100);
    return lightness / 100 - chroma * Math.max(-1, Math.min(value - 3, 9 - value, 1));
  };
  const linear = (value: number) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  const luminance =
    0.2126 * linear(channel(0)) +
    0.7152 * linear(channel(8)) +
    0.0722 * linear(channel(4));
  const whiteContrast = 1.05 / (luminance + 0.05);
  const darkContrast = (luminance + 0.05) / 0.056;
  return whiteContrast >= darkContrast ? "0 0% 100%" : "224 35% 12%";
}

function hexToHsl(hex: string) {
  const normalized = normalizeThemeColor(hex);
  const red = Number.parseInt(normalized.slice(1, 3), 16) / 255;
  const green = Number.parseInt(normalized.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(normalized.slice(5, 7), 16) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  let hue = 0;
  if (delta) {
    if (maximum === red) hue = ((green - blue) / delta) % 6;
    else if (maximum === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }
  const lightness = (maximum + minimum) / 2;
  const saturation = delta
    ? delta / (1 - Math.abs(2 * lightness - 1))
    : 0;
  return {
    hue,
    saturation: Math.round(saturation * 100),
    lightness: Math.round(lightness * 100),
  };
}

export function themeColorVariables(hex: string) {
  const { hue, saturation, lightness } = hexToHsl(hex);
  const vividSaturation = clamp(saturation, 55, 92);
  const lightPrimary = clamp(lightness, 30, 44);
  const darkPrimary = clamp(lightness + 24, 66, 76);
  return {
    "--brand-primary-light": `${hue} ${vividSaturation}% ${lightPrimary}%`,
    "--brand-primary-dark": `${hue} ${vividSaturation}% ${darkPrimary}%`,
    "--brand-primary-foreground-light": readableForeground(
      hue,
      vividSaturation,
      lightPrimary,
    ),
    "--brand-primary-foreground-dark": readableForeground(
      hue,
      vividSaturation,
      darkPrimary,
    ),
    "--brand-accent-light": `${hue} ${clamp(vividSaturation - 8, 48, 82)}% 92%`,
    "--brand-accent-foreground-light": `${hue} ${vividSaturation}% 28%`,
    "--brand-accent-dark": `${hue} ${clamp(vividSaturation - 10, 45, 82)}% 18%`,
    "--brand-accent-foreground-dark": `${hue} ${vividSaturation}% 88%`,
  } as const;
}

export function applyThemeColor(hex: string) {
  const root = document.documentElement;
  const variables = themeColorVariables(hex);
  for (const [property, value] of Object.entries(variables)) {
    root.style.setProperty(property, value);
  }
  root.style.setProperty("--brand-color", normalizeThemeColor(hex));
}
