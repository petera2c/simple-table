/**
 * Theme-aware color tokens shared across the marketing example dashboards.
 *
 * Each Simple Table theme maps to a palette so custom cell renderers can stay
 * legible on light and dark surfaces alike. Mirrors the ad-hoc palette that the
 * Music example defines inline, generalized for reuse by the Crypto and Soccer
 * flagship dashboards (and the lighter touch-ups).
 */
export interface ThemeColors {
  /** Primary text color for values. */
  text: string;
  /** Secondary / label text color. */
  muted: string;
  success: string;
  successBg: string;
  error: string;
  errorBg: string;
  primary: string;
  primaryBg: string;
  warning: string;
  warningBg: string;
  /** Subtle border / divider color. */
  border: string;
  /** Neutral track color for progress / segmented bars. */
  track: string;
  /** Positive trend (chart line, up arrow). */
  up: string;
  /** Negative trend (chart line, down arrow). */
  down: string;
}

const LIGHT: ThemeColors = {
  text: "#374151",
  muted: "#9ca3af",
  success: "#16a34a",
  successBg: "#f0fdf4",
  error: "#dc2626",
  errorBg: "#fef2f2",
  primary: "#2563eb",
  primaryBg: "#eff6ff",
  warning: "#d97706",
  warningBg: "#fffbeb",
  border: "#e5e7eb",
  track: "#e5e7eb",
  up: "#16a34a",
  down: "#dc2626",
};

const DARK: ThemeColors = {
  text: "#e5e7eb",
  muted: "#9ca3af",
  success: "#22c55e",
  successBg: "rgba(21, 128, 61, 0.25)",
  error: "#f87171",
  errorBg: "rgba(127, 29, 29, 0.3)",
  primary: "#60a5fa",
  primaryBg: "rgba(30, 64, 175, 0.3)",
  warning: "#fbbf24",
  warningBg: "rgba(146, 64, 14, 0.3)",
  border: "#374151",
  track: "#374151",
  up: "#22c55e",
  down: "#f87171",
};

const THEME_COLORS: Record<string, ThemeColors> = {
  light: LIGHT,
  "modern-light": LIGHT,
  "custom-light": LIGHT,
  custom: LIGHT,
  dark: DARK,
  "modern-dark": DARK,
  "custom-dark": DARK,
  neutral: {
    ...LIGHT,
    text: "#171717",
    muted: "#737373",
    primary: "#525252",
    primaryBg: "#fafafa",
    border: "#d4d4d4",
    track: "#e5e5e5",
  },
};

export const getThemeColors = (theme?: string): ThemeColors =>
  THEME_COLORS[theme ?? "modern-light"] ?? LIGHT;
