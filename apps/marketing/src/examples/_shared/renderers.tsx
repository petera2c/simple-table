import type { CSSProperties, ReactNode } from "react";
import { getThemeColors } from "./theme";
import { formatSignedPercent } from "./format";

type TagColor = "green" | "red" | "blue" | "yellow" | "neutral";

/** Small rounded label/badge. */
export const Pill = ({
  children,
  color = "neutral",
  theme,
  style,
}: {
  children: ReactNode;
  color?: TagColor;
  theme?: string;
  style?: CSSProperties;
}) => {
  const c = getThemeColors(theme);
  const map: Record<TagColor, { bg: string; text: string; border?: string }> = {
    green: { bg: c.successBg, text: c.success },
    red: { bg: c.errorBg, text: c.error },
    blue: { bg: c.primaryBg, text: c.primary },
    yellow: { bg: c.warningBg, text: c.warning },
    neutral: { bg: "transparent", text: c.muted, border: c.border },
  };
  const styles = map[color];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        padding: "1px 7px",
        fontSize: "11px",
        lineHeight: "18px",
        borderRadius: "5px",
        fontWeight: 600,
        backgroundColor: styles.bg,
        color: styles.text,
        ...(styles.border ? { border: `1px solid ${styles.border}` } : {}),
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/**
 * A value with a colored, arrowed percentage-change badge underneath. Used for
 * "metric + growth" cells across the dashboards.
 */
export const GrowthMetric = ({
  value,
  changePercent,
  theme,
  align = "left",
  changeLabel,
}: {
  value: ReactNode;
  changePercent: number;
  theme?: string;
  align?: "left" | "right" | "center";
  /** Optional explicit text for the badge (defaults to the formatted percent). */
  changeLabel?: string;
}) => {
  const c = getThemeColors(theme);
  const isPositive = changePercent >= 0;
  const alignItems =
    align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems }}>
      <div style={{ fontSize: "14px", fontWeight: 600, color: c.text }}>{value}</div>
      <Pill color={isPositive ? "green" : "red"} theme={theme}>
        {isPositive ? "\u25B2" : "\u25BC"} {changeLabel ?? formatSignedPercent(changePercent)}
      </Pill>
    </div>
  );
};

/** Horizontal progress / utilization bar with an optional caption. */
export const ProgressBar = ({
  percent,
  theme,
  color,
  caption,
  height = 6,
}: {
  percent: number;
  theme?: string;
  /** Override fill color; defaults to the theme primary. */
  color?: string;
  caption?: ReactNode;
  height?: number;
}) => {
  const c = getThemeColors(theme);
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
      {caption !== undefined && (
        <span style={{ fontSize: "12px", color: c.muted }}>{caption}</span>
      )}
      <div
        style={{
          width: "100%",
          height,
          borderRadius: height,
          backgroundColor: c.track,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            borderRadius: height,
            backgroundColor: color ?? c.primary,
            transition: "width 240ms ease",
          }}
        />
      </div>
    </div>
  );
};

/** Deterministic HSL color from a string seed. */
export function colorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

/** Circular avatar showing an initial (or an emoji/logo glyph) on a hashed color. */
export const Avatar = ({
  seed,
  label,
  size = 36,
  glyph,
}: {
  /** String used to derive the background color. */
  seed: string;
  /** Text used for the initial when no glyph is given. */
  label?: string;
  size?: number;
  /** Optional explicit glyph (emoji / symbol) to render instead of an initial. */
  glyph?: string;
}) => {
  const initial = glyph ?? (label ?? seed).charAt(0).toUpperCase() ?? "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: colorFromString(seed),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: size * 0.42,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
};

export interface Segment {
  value: number;
  color: string;
  label?: string;
}

/** Stacked horizontal bar made of proportional colored segments. */
export const SegmentedBar = ({
  segments,
  theme,
  caption,
  height = 8,
}: {
  segments: Segment[];
  theme?: string;
  caption?: ReactNode;
  height?: number;
}) => {
  const c = getThemeColors(theme);
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
      {caption !== undefined && (
        <span style={{ fontSize: "12px", color: c.muted }}>{caption}</span>
      )}
      <div
        style={{
          display: "flex",
          width: "100%",
          height,
          borderRadius: height,
          overflow: "hidden",
          backgroundColor: c.track,
        }}
      >
        {segments.map((s, i) => (
          <div
            key={i}
            title={s.label}
            style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
          />
        ))}
      </div>
    </div>
  );
};
