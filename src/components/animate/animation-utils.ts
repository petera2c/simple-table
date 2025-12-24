import CellValue from "../../types/CellValue";
import { AnimationConfig, FlipAnimationOptions, CustomAnimationOptions } from "./types";

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
  // For row reordering (vertical movement)
  ROW_REORDER: {
    duration: 3000,
    easing: "cubic-bezier(0.2, 0.0, 0.2, 1)",
    delay: 0,
  },
  // For reduced motion users
  REDUCED_MOTION: {
    duration: 150, // Even faster for reduced motion
    easing: "ease-out",
    delay: 0,
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
export const calculateInvert = (
  fromBounds: DOMRect | { x: number; y: number },
  toBounds: DOMRect
) => {
  // Handle both DOMRect and plain objects with x/y properties
  const fromX = "x" in fromBounds ? fromBounds.x : (fromBounds as DOMRect).left;
  const fromY = "y" in fromBounds ? fromBounds.y : (fromBounds as DOMRect).top;
  const toX = toBounds.x;
  const toY = toBounds.y;

  return {
    x: fromX - toX,
    y: fromY - toY,
  };
};

/**
 * Applies initial transform to element for FLIP animation
 * Handles interrupting in-progress animations by adjusting the transform calculation
 */
export const applyInitialTransform = (element: HTMLElement, invert: { x: number; y: number }) => {
  const currentVisualY = element.getBoundingClientRect().y;
  const hasExistingTransform = element.style.transform && element.style.transform !== "none";

  // If element has a frozen transform from an interrupted animation,
  // we need to recalculate invert from pure DOM position
  let adjustedInvertX = invert.x;
  let adjustedInvertY = invert.y;

  if (hasExistingTransform) {
    // Temporarily remove transform to get pure DOM position
    element.style.transform = "none";
    const pureDOMY = element.getBoundingClientRect().y;
    const pureDOMX = element.getBoundingClientRect().x;

    // Recalculate invert from pure DOM position
    // fromBounds represents where we want to visually appear to come from
    const fromBoundsY = currentVisualY + invert.y;
    const fromBoundsX = element.getBoundingClientRect().x + invert.x;

    adjustedInvertY = fromBoundsY - pureDOMY;
    adjustedInvertX = fromBoundsX - pureDOMX;
  }

  element.style.transform = `translate3d(${adjustedInvertX}px, ${adjustedInvertY}px, 0)`;
  element.style.transition = "none";
  element.style.willChange = "transform";
  element.style.backfaceVisibility = "hidden";
  element.classList.add("st-animating");
};

/**
 * Cleans up animation styles from element
 */
const cleanupAnimation = (element: HTMLElement) => {
  element.style.transition = "";
  element.style.transitionDelay = "";
  element.style.transform = "";
  element.style.top = "";
  // Clean up performance optimization styles
  element.style.willChange = "";
  element.style.backfaceVisibility = "";
  // Remove animating class to restore normal z-index
  element.classList.remove("st-animating");
};

/**
 * Animates element to its final position
 * Returns a Promise that resolves to a cleanup function that can cancel the animation
 */
const animateToFinalPosition = (
  element: HTMLElement,
  config: AnimationConfig,
  options: FlipAnimationOptions = {},
  id?: CellValue
): Promise<() => void> => {
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

    let isCleanedUp = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Clean up after animation
    const doCleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;

      cleanupAnimation(element);
      element.removeEventListener("transitionend", doCleanup);

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (options.onComplete) {
        options.onComplete();
      }
    };

    element.addEventListener("transitionend", doCleanup);

    // Fallback timeout in case transitionend doesn't fire
    timeoutId = setTimeout(doCleanup, config.duration + (config.delay || 0) + 50);

    // Return cleanup function that can cancel the animation
    const cancelCleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;

      element.removeEventListener("transitionend", doCleanup);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    resolve(cancelCleanup);
  });
};

/**
 * Get appropriate animation config based on user preferences
 */
export const getAnimationConfig = (options: FlipAnimationOptions = {}): AnimationConfig => {
  // Check for user's motion preferences first
  if (prefersReducedMotion()) {
    return { ...ANIMATION_CONFIGS.REDUCED_MOTION, ...options };
  }

  // Use row reorder config as default
  return { ...ANIMATION_CONFIGS.ROW_REORDER, ...options };
};

/**
 * Performs FLIP animation on a single element
 * This function can be called multiple times on the same element - it will automatically
 * interrupt any ongoing animation and start a new one.
 * Returns a cleanup function that can be called to cancel the animation.
 */
export const flipElement = async ({
  element,
  finalConfig,
  fromBounds,
  toBounds,
}: {
  element: HTMLElement;
  finalConfig: FlipAnimationOptions;
  fromBounds: DOMRect;
  toBounds: DOMRect;
}): Promise<() => void> => {
  const invert = calculateInvert(fromBounds, toBounds);

  // Skip animation if element hasn't moved
  if (invert.x === 0 && invert.y === 0) {
    // Still need to clean up if there was an animation in progress
    cleanupAnimation(element);
    // Return no-op cleanup function
    return () => {};
  }

  // Skip animation entirely if user prefers reduced motion and no explicit override
  if (prefersReducedMotion() && finalConfig.respectReducedMotion !== false) {
    cleanupAnimation(element);
    return () => {};
  }

  // Get appropriate config based on user preferences
  const config = getAnimationConfig(finalConfig);

  // Apply new transform BEFORE cleaning up old one to prevent flickering
  // This ensures there's no gap where the element snaps to its DOM position
  applyInitialTransform(element, invert);

  // Now safe to clean up transition properties (but transform is already set above)
  // Only clean transition-related properties, not transform
  element.style.transition = "";
  element.style.transitionDelay = "";

  // Animate to final position and get cleanup function
  const cleanup = await animateToFinalPosition(element, config, finalConfig);

  return cleanup;
};

/**
 * Performs custom coordinate animation with absolute position control
 * This allows you to animate an element from one Y coordinate to another,
 * completely independent of the element's actual DOM position.
 */
export const animateWithCustomCoordinates = async ({
  element,
  options,
}: {
  element: HTMLElement;
  options: CustomAnimationOptions;
}): Promise<void> => {
  const {
    startY,
    endY,
    finalY,
    duration = 300,
    easing = "cubic-bezier(0.2, 0.0, 0.2, 1)",
    delay = 0,
    onComplete,
    respectReducedMotion = true,
  } = options;

  // Skip animation entirely if user prefers reduced motion and no explicit override
  if (prefersReducedMotion() && respectReducedMotion) {
    // Jump directly to final position if specified
    if (finalY !== undefined) {
      element.style.transform = "";
      element.style.top = `${finalY}px`;
    }
    if (onComplete) onComplete();
    return;
  }

  // Get element's current position
  const rect = element.getBoundingClientRect();
  const currentY = rect.top;

  // Calculate the transforms needed
  const startTransformY = startY - currentY;
  const endTransformY = endY - currentY;

  return new Promise((resolve) => {
    // CRITICAL: Set initial position BEFORE cleaning up to prevent flickering
    // Apply new transform first (overrides any existing transform)
    element.style.transform = `translate3d(0, ${startTransformY}px, 0)`;
    element.style.willChange = "transform";
    element.style.backfaceVisibility = "hidden";
    element.classList.add("st-animating");

    // Now clean up transition properties (transform already set above)
    element.style.transition = "none";
    element.style.transitionDelay = "";

    // Force reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element.offsetHeight;

    // Apply transition and animate to end position
    element.style.transition = `transform ${duration}ms ${easing}`;
    if (delay) {
      element.style.transitionDelay = `${delay}ms`;
    }

    // Animate to end position
    element.style.transform = `translate3d(0, ${endTransformY}px, 0)`;

    const cleanup = () => {
      // Clean up animation styles
      element.style.transition = "";
      element.style.transitionDelay = "";
      element.style.transform = "";
      element.style.willChange = "";
      element.style.backfaceVisibility = "";
      element.classList.remove("st-animating");

      // Move to final position if specified (invisible jump)
      if (finalY !== undefined) {
        element.style.top = `${finalY}px`;
      }

      element.removeEventListener("transitionend", cleanup);

      if (onComplete) {
        onComplete();
      }
      resolve();
    };

    element.addEventListener("transitionend", cleanup);

    // Fallback timeout in case transitionend doesn't fire
    setTimeout(cleanup, duration + (delay || 0) + 50);
  });
};
