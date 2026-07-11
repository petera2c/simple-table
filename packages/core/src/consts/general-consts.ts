export const DRAG_THROTTLE_LIMIT = 50;
export const ROW_SEPARATOR_WIDTH = 1;

export const PAGE_SIZE = 20;

// CSS variable names
export const CSS_VAR_BORDER_WIDTH = "--st-border-width";
export const DEFAULT_BORDER_WIDTH = 1;

// Virtualization threshold - below this row count, virtualization is disabled
export const VIRTUALIZATION_THRESHOLD = 20;

// Dev-only safeguard: when the table would render at least this many rows with
// no virtualization active (no `height` / `maxHeight` and no bounded
// `scrollParent`), emit a one-time console warning. Rendering this many DOM rows
// at once is almost always a misconfiguration that causes slow paints / high
// memory. Stripped from production builds.
export const UNVIRTUALIZED_ROW_WARNING_THRESHOLD = 500;

// Overscan configuration for virtualization
// Target overscan in pixels (above and below viewport)
export const OVERSCAN_PIXELS = 800;

// Calculate buffer row count based on actual row height
// This ensures consistent overscan regardless of row size
export const calculateBufferRowCount = (rowHeight: number): number => {
  const rowHeightWithSeparator = rowHeight + ROW_SEPARATOR_WIDTH;
  return Math.ceil(OVERSCAN_PIXELS / rowHeightWithSeparator);
};

export const COLUMN_EDIT_WIDTH = 29.5;

/**
 * Horizontal space reserved for the built-in column-editor toggle strip.
 * Returns 0 when editing is off or the strip is hidden via `showToggle: false`.
 */
export const getColumnEditorStripWidth = (
  editColumns: boolean | undefined,
  showToggle: boolean = true,
): number => (editColumns && showToggle ? COLUMN_EDIT_WIDTH : 0);

/**
 * Whether the built-in column-editor toggle strip is visible and takes layout space.
 */
export const isColumnEditorStripVisible = (
  editColumns: boolean | undefined,
  showToggle: boolean = true,
): boolean => Boolean(editColumns && showToggle);

export const TABLE_HEADER_CELL_WIDTH_DEFAULT = 150;
export const PINNED_BORDER_WIDTH = 1;
export const CHART_COLUMN_TYPES = ["lineAreaChart", "barChart"];
export const OPTIMAL_CHART_COLUMN_WIDTH = 150;

// Auto-size (width: "auto") defaults
export const AUTO_SIZE_HEAD_SAMPLE_SIZE = 25; // leading rows always measured
export const AUTO_SIZE_STRIDED_SAMPLE_SIZE = 75; // rows sampled at an even stride across the rest
export const AUTO_SIZE_MAX_WIDTH = 500; // global hard cap when no per-column maxWidth
export const AUTO_SIZE_OUTLIER_PERCENTILE = 95; // percentile used to clip outliers
export const AUTO_SIZE_OUTLIER_THRESHOLD = 0.5; // clip only when max exceeds the percentile by this fraction
export const AUTO_SIZE_MIN_SAMPLE_FOR_CLIP = 20; // below this many samples, never clip (use raw max)
export const AUTO_SIZE_WIDTH_BUFFER = 2; // px buffer added to measured content width
/** Extra padding reserved around header icons (sort / collapse) during auto-size. */
export const AUTO_SIZE_HEADER_ICON_PADDING = 4;
