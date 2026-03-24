/**
 * Column width constraints for the table
 * These values control minimum and maximum widths for columns and sections
 */

/**
 * MIN_COLUMN_WIDTH
 * The minimum width in pixels that any column can have.
 * This is used as:
 * - The default minimum width when header.minWidth is undefined
 * - The absolute minimum in autoExpandColumns mode to prevent columns from becoming too narrow
 */
export const MIN_COLUMN_WIDTH = 40;

/**
 * MAX_SINGLE_PINNED_SECTION_PERCENT
 * Maximum percentage of container width that a single pinned section can occupy.
 * When only one section (left OR right) is pinned, it can take up to 60% of the width.
 * This ensures the main section always has at least 40% of the space.
 */
export const MAX_SINGLE_PINNED_SECTION_PERCENT = 0.6;

/**
 * MAX_DUAL_PINNED_SECTION_PERCENT
 * Maximum percentage of container width that each pinned section can occupy
 * when BOTH left and right sections are pinned.
 * With both sections at 40%, the main section is guaranteed at least 20% of the space.
 */
export const MAX_DUAL_PINNED_SECTION_PERCENT = 0.4;

/**
 * Mobile breakpoints for responsive pinned section constraints
 */
export const MOBILE_BREAKPOINT_SMALL = 480; // Small phones
export const MOBILE_BREAKPOINT_MEDIUM = 768; // Tablets

/**
 * Get the maximum allowed width percentage for a single pinned section based on container width.
 * This is used when only ONE section (left OR right) is pinned.
 *
 * @param containerWidth - The table container width in pixels (st-body-container)
 * @returns The maximum percentage (0-1) of container width that the pinned section can occupy
 */
export const getMaxSinglePinnedPercent = (containerWidth: number): number => {
  if (containerWidth < MOBILE_BREAKPOINT_SMALL) return 0.4; // 40% on small phones
  if (containerWidth < MOBILE_BREAKPOINT_MEDIUM) return 0.5; // 50% on tablets
  return MAX_SINGLE_PINNED_SECTION_PERCENT; // 60% on desktop
};

/**
 * Get the maximum allowed width percentage for pinned sections based on container width
 * and the number of pinned sections.
 *
 * @param containerWidth - The table container width in pixels (st-body-container)
 * @param hasPinnedLeft - Whether there is a pinned left section
 * @param hasPinnedRight - Whether there is a pinned right section
 * @returns The maximum percentage (0-1) of container width that each pinned section can occupy
 */
export const getMaxPinnedSectionPercent = (
  containerWidth: number,
  hasPinnedLeft: boolean,
  hasPinnedRight: boolean,
): number => {
  // If both sections are pinned, use more restrictive limits
  if (hasPinnedLeft && hasPinnedRight) {
    if (containerWidth < MOBILE_BREAKPOINT_SMALL) return 0.25; // 25% each (50% total)
    if (containerWidth < MOBILE_BREAKPOINT_MEDIUM) return 0.3; // 30% each (60% total)
    return MAX_DUAL_PINNED_SECTION_PERCENT; // 40% each (80% total) on desktop
  }

  // If only one section is pinned, use single pinned limits
  return getMaxSinglePinnedPercent(containerWidth);
};

/**
 * Calculate the maximum width in pixels for a pinned section
 *
 * @param containerWidth - The table container width in pixels (st-body-container)
 * @param hasPinnedLeft - Whether there is a pinned left section
 * @param hasPinnedRight - Whether there is a pinned right section
 * @returns The maximum width in pixels for a pinned section
 */
export const getMaxPinnedSectionWidth = (
  containerWidth: number,
  hasPinnedLeft: boolean,
  hasPinnedRight: boolean,
): number => {
  const maxPercent = getMaxPinnedSectionPercent(containerWidth, hasPinnedLeft, hasPinnedRight);
  return containerWidth * maxPercent;
};
