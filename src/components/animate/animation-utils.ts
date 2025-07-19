/**
 * Animation configs for transform-based animations
 */
export const ANIMATION_CONFIGS = {
  // For row reordering (vertical movement)
  ROW_REORDER: {
    duration: 3000,
    easing: "cubic-bezier(0.2, 0.0, 0.2, 1)",
    delay: 0,
    maxX: 50, // Less horizontal movement for row reorders
    maxY: 150,
  },
} as const;
