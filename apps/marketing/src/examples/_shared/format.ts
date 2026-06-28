/** Compact / currency formatting helpers shared by the example dashboards. */

/** 1_234_567 -> "1.23M" (2 sig figures past the magnitude). */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toLocaleString();
}

/** Compact USD, e.g. "$1.23B". */
export function formatCompactUsd(value: number): string {
  return `$${formatCompact(value)}`;
}

/**
 * Price formatting that adapts precision to magnitude so both $68,000 and
 * $0.00004213 render sensibly.
 */
export function formatPrice(value: number): string {
  const abs = Math.abs(value);
  if (abs === 0) return "$0.00";
  if (abs >= 1) {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  if (abs >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(8)}`;
}

/** "+1.23%" / "-1.23%" with sign. */
export function formatSignedPercent(value: number, digits = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}
