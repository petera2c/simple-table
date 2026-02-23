export const DRAG_THROTTLE_LIMIT = 50;
export const ROW_SEPARATOR_WIDTH = 1;

export const PAGE_SIZE = 20;

// CSS variable names
export const CSS_VAR_BORDER_WIDTH = "--st-border-width";
export const DEFAULT_BORDER_WIDTH = 1;

// Virtualization threshold - below this row count, virtualization is disabled
export const VIRTUALIZATION_THRESHOLD = 20;

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
export const TABLE_HEADER_CELL_WIDTH_DEFAULT = 150;
export const PINNED_BORDER_WIDTH = 1;
export const CHART_COLUMN_TYPES = ["lineAreaChart", "barChart"];
export const OPTIMAL_CHART_COLUMN_WIDTH = 150;
