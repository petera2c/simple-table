import CellValue from "../../types/CellValue";
import { AnimationConfig, FlipAnimationOptions, CustomAnimationOptions } from "./types";

/**
 * Animation configs for different types of movements
 */
export const ANIMATION_CONFIGS = {
  // For row reordering (vertical movement)
  ROW_REORDER: {
    duration: 3000,
    // duration: 500,
    easing: "cubic-bezier(0.2, 0.0, 0.2, 1)",
    delay: 0,
  },
} as const;

/**
 * Create a custom animation config with smart defaults
 */
export const createAnimationConfig = (
  overrides: Partial<AnimationConfig> = {}
): AnimationConfig => {
  return { ...ANIMATION_CONFIGS.ROW_REORDER, ...overrides };
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
  element.style.top = "";
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
  options: FlipAnimationOptions = {},
  id?: CellValue
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
export const getAnimationConfig = (options: FlipAnimationOptions = {}): AnimationConfig => {
  // Fall back to default config
  return { ...ANIMATION_CONFIGS.ROW_REORDER, ...options };
};

/**
 * Performs FLIP animation on a single element
 * This function can be called multiple times on the same element - it will automatically
 * interrupt any ongoing animation and start a new one.
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
}): Promise<void> => {
  const invert = calculateInvert(fromBounds, toBounds);

  // Skip animation if element hasn't moved
  if (invert.x === 0 && invert.y === 0) {
    return;
  }

  // Get appropriate config based on movement type and user preferences
  const config = getAnimationConfig(finalConfig);

  // Clean up any existing animation before starting a new one
  cleanupAnimation(element);

  // Apply initial transform with limited values
  applyInitialTransform(element, invert);

  // Animate to final position
  await animateToFinalPosition(element, config, finalConfig);
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
  } = options;

  // Get element's current position
  const rect = element.getBoundingClientRect();
  const currentY = rect.top;

  // Calculate the transforms needed
  const startTransformY = startY - currentY;
  const endTransformY = endY - currentY;

  return new Promise((resolve) => {
    // Clean up any existing animation
    element.style.transition = "";
    element.style.transitionDelay = "";
    element.style.transform = "";
    element.style.willChange = "";
    element.style.backfaceVisibility = "";
    element.classList.remove("st-animating");

    // Set initial position (startY)
    element.style.transform = `translate3d(0, ${startTransformY}px, 0)`;
    element.style.transition = "none";
    element.style.willChange = "transform";
    element.style.backfaceVisibility = "hidden";
    element.classList.add("st-animating");

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
