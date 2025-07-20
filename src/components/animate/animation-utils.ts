import { AnimationConfig, FlipAnimationOptions } from "./types";

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Animation configs for different types of movements
 */
export const ANIMATION_CONFIGS = {
  // For column reordering (horizontal movement)
  COLUMN_REORDER: {
    duration: 500,
    // duration: 180,
    easing: "cubic-bezier(0.2, 0.0, 0.2, 1)",
    delay: 0,
    maxX: 200,
    maxY: 50, // Less vertical movement for column reorders
  },
  // For row reordering (vertical movement)
  ROW_REORDER: {
    duration: 500,
    // duration: 200,
    easing: "cubic-bezier(0.2, 0.0, 0.2, 1)",
    delay: 0,
    maxX: 200,
    maxY: 150,
  },
  // For reduced motion users
  REDUCED_MOTION: {
    duration: 500,
    // duration: 150, // Even faster for reduced motion
    easing: "ease-out",
    delay: 0,
    maxX: 100,
    maxY: 75,
  },
} as const;

/**
 * Create a custom animation config with smart defaults
 */
export const createAnimationConfig = (
  overrides: Partial<AnimationConfig> = {}
): AnimationConfig => {
  const baseConfig = prefersReducedMotion()
    ? ANIMATION_CONFIGS.REDUCED_MOTION
    : ANIMATION_CONFIGS.ROW_REORDER; // Default to row reorder as it's more common in tables

  return { ...baseConfig, ...overrides };
};

/**
 * Calculates the invert values for FLIP animation
 */
export const calculateInvert = (first: DOMRect | { x: number; y: number }, last: DOMRect) => {
  // Handle both DOMRect and plain objects with x/y properties
  const firstX = "x" in first ? first.x : (first as DOMRect).left;
  const firstY = "y" in first ? first.y : (first as DOMRect).top;
  const lastX = last.x;
  const lastY = last.y;

  return {
    x: firstX - lastX,
    y: firstY - lastY,
  };
};

/**
 * Applies max limits to invert values
 */
export const applyMaxLimits = (invert: { x: number; y: number }, maxX?: number, maxY?: number) => {
  const limitedX = maxX ? Math.max(-maxX, Math.min(maxX, invert.x)) : invert.x;
  const limitedY = maxY ? Math.max(-maxY, Math.min(maxY, invert.y)) : invert.y;

  return {
    x: limitedX,
    y: limitedY,
  };
};

/**
 * Applies initial transform to element for FLIP animation
 */
export const applyInitialTransform = (element: HTMLElement, invert: { x: number; y: number }) => {
  element.style.transform = `translate3d(${invert.x}px, ${invert.y}px, 0)`;
  element.style.transition = "none";
  // Performance optimizations for smoother animations
  element.style.willChange = "transform"; // Hint to browser for optimization
  element.style.backfaceVisibility = "hidden"; // Prevent flickering during animation
  // Add animating class to ensure proper z-index during animation
  element.classList.add("st-animating");
};

/**
 * Cleans up animation styles from element
 */
const cleanupAnimation = (element: HTMLElement) => {
  element.style.transition = "";
  element.style.transitionDelay = "";
  element.style.transform = "";
  // Clean up performance optimization styles
  element.style.willChange = "";
  element.style.backfaceVisibility = "";
  // Remove animating class to restore normal z-index
  element.classList.remove("st-animating");
};

/**
 * Animates element to its final position
 */
const animateToFinalPosition = (
  element: HTMLElement,
  config: AnimationConfig,
  options: FlipAnimationOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    // Force a reflow to ensure the initial transform is applied
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element.offsetHeight;

    // Apply transition
    element.style.transition = `transform ${config.duration}ms ${config.easing}`;

    // Apply delay if specified
    if (config.delay) {
      element.style.transitionDelay = `${config.delay}ms`;
    }

    // Animate to final position
    element.style.transform = "translate3d(0, 0, 0)";

    // Clean up after animation
    const cleanup = () => {
      cleanupAnimation(element);
      element.removeEventListener("transitionend", cleanup);

      if (options.onComplete) {
        options.onComplete();
      }
      resolve();
    };

    element.addEventListener("transitionend", cleanup);

    // Fallback timeout in case transitionend doesn't fire
    setTimeout(cleanup, config.duration + (config.delay || 0) + 50);
  });
};

/**
 * Get appropriate animation config based on movement type and user preferences
 */
export const getAnimationConfig = (
  options: FlipAnimationOptions = {},
  movementType?: "column" | "row"
): AnimationConfig => {
  // Check for user's motion preferences first
  if (prefersReducedMotion()) {
    return { ...ANIMATION_CONFIGS.REDUCED_MOTION, ...options };
  }

  // Use specific config based on movement type
  if (movementType === "column") {
    return { ...ANIMATION_CONFIGS.COLUMN_REORDER, ...options };
  }
  if (movementType === "row") {
    return { ...ANIMATION_CONFIGS.ROW_REORDER, ...options };
  }

  // Fall back to default config
  return { ...ANIMATION_CONFIGS.ROW_REORDER, ...options };
};

/**
 * Performs FLIP animation on a single element
 * This function can be called multiple times on the same element - it will automatically
 * interrupt any ongoing animation and start a new one.
 */
export const flipElement = async (
  element: HTMLElement,
  first: DOMRect | { x: number; y: number; width: number; height: number },
  options: FlipAnimationOptions = {}
): Promise<void> => {
  const last = element.getBoundingClientRect();
  const invert = calculateInvert(first, last);

  // Skip animation if element hasn't moved
  if (invert.x === 0 && invert.y === 0) {
    return;
  }

  // Skip animation entirely if user prefers reduced motion and no explicit override
  if (prefersReducedMotion() && options.respectReducedMotion !== false) {
    return;
  }

  // Determine movement type based on the invert values
  const isColumnMovement = Math.abs(invert.x) > Math.abs(invert.y);
  const movementType = isColumnMovement ? "column" : "row";

  // Get appropriate config based on movement type and user preferences
  const config = getAnimationConfig(options, movementType);
  const limitedInvert = applyMaxLimits(invert, config.maxX, config.maxY);

  // Clean up any existing animation before starting a new one
  cleanupAnimation(element);

  // Apply initial transform with limited values
  applyInitialTransform(element, limitedInvert);

  // Animate to final position
  await animateToFinalPosition(element, config, options);
};
