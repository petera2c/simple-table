export const DRAG_THROTTLE_LIMIT = 50;
export const ROW_SEPARATOR_WIDTH = 1;

export const PAGE_SIZE = 20;
export const BUFFER_ROW_COUNT = 5;

export const COLUMN_EDIT_WIDTH = 28;
export const TABLE_HEADER_CELL_WIDTH_DEFAULT = 150;
export const PINNED_BORDER_WIDTH = 1;
export const MAX_PINNED_WIDTH_PERCENT = 0.8;

/**
 * Get the maximum allowed width percentage for pinned columns based on viewport width
 * This ensures better mobile compatibility by reducing pinned column space on smaller screens
 * @param viewportWidth - The current viewport width in pixels
 * @returns The maximum percentage (0-1) of container width that pinned columns can occupy
 */
export const getResponsiveMaxPinnedPercent = (viewportWidth: number): number => {
  if (viewportWidth < 480) return 0.3; // 40% on small phones
  if (viewportWidth < 768) return 0.4; // 50% on tablets
  return MAX_PINNED_WIDTH_PERCENT; // 80% on desktop
};
