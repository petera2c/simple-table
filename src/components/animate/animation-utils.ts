import CellValue from "../../types/CellValue";
import { AnimationConfig, FlipAnimationOptions, CustomAnimationOptions } from "./types";

/**
 * Animation configs for different types of movements
 */
export const ANIMATION_CONFIGS = {
  // For row reordering (vertical movement)
  ROW_REORDER: {
    duration: 9000,
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
  const elementId = element.getAttribute("data-animate-id");
  const currentVisualY = element.getBoundingClientRect().y;
  const hasExistingTransform = element.style.transform && element.style.transform !== "none";

  // CRITICAL: If element has a frozen transform, we need to recalculate invert from pure DOM position
  let adjustedInvertX = invert.x;
  let adjustedInvertY = invert.y;

  if (hasExistingTransform) {
    const oldTransform = element.style.transform;

    // Temporarily remove transform to get pure DOM position
    element.style.transform = "none";
    const pureDOMY = element.getBoundingClientRect().y;
    const pureDOMX = element.getBoundingClientRect().x;

    // Recalculate invert: we want to go from current visual position to where fromBounds expects
    // The invert passed in assumes we're at pureDOMY, but we need to adjust for frozen position
    // Original calculation: fromBoundsY - toBoundsY = invert.y
    // But toBounds is the frozen visual position, not DOM position
    // So we need: fromBoundsY - pureDOMY = adjusted invert
    const fromBoundsY = currentVisualY + invert.y; // Reverse engineer fromBounds
    const fromBoundsX = element.getBoundingClientRect().x + invert.x;

    adjustedInvertY = fromBoundsY - pureDOMY;
    adjustedInvertX = fromBoundsX - pureDOMX;

    if (elementId === "1-name") {
      console.log("🔧 [applyInitialTransform] Adjusting for frozen transform", {
        oldTransform,
        currentVisualY,
        pureDOMY,
        originalInvertY: invert.y,
        adjustedInvertY,
        fromBoundsY,
      });
    }
  }

  element.style.transform = `translate3d(${adjustedInvertX}px, ${adjustedInvertY}px, 0)`;
  element.style.transition = "none";
  // Performance optimizations for smoother animations
  element.style.willChange = "transform"; // Hint to browser for optimization
  element.style.backfaceVisibility = "hidden"; // Prevent flickering during animation
  // Add animating class to ensure proper z-index during animation
  element.classList.add("st-animating");

  if (elementId === "1-name") {
    console.log("🎨 [applyInitialTransform] 1-name", {
      invertY: invert.y,
      adjustedInvertY,
      beforeY: currentVisualY,
      afterY: element.getBoundingClientRect().y,
      transform: element.style.transform,
    });
  }
};

/**
 * Cleans up animation styles from element
 */
const cleanupAnimation = (element: HTMLElement) => {
  const elementId = element.getAttribute("data-animate-id");
  if (elementId === "1-name") {
    console.log("🧼 [cleanupAnimation] Cleaning up 1-name", {
      currentTransform: element.style.transform,
      currentTransition: element.style.transition,
      visualY: element.getBoundingClientRect().y,
    });
  }

  element.style.transition = "";
  element.style.transitionDelay = "";
  element.style.transform = "";
  element.style.top = "";
  // Clean up performance optimization styles
  element.style.willChange = "";
  element.style.backfaceVisibility = "";
  // Remove animating class to restore normal z-index
  element.classList.remove("st-animating");

  if (elementId === "1-name") {
    console.log("🧼 [cleanupAnimation] After cleanup 1-name", {
      visualY: element.getBoundingClientRect().y,
    });
  }
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
    const elementId = element.getAttribute("data-animate-id");

    // Force a reflow to ensure the initial transform is applied
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    element.offsetHeight;

    // Apply transition
    element.style.transition = `transform ${config.duration}ms ${config.easing}`;

    // Apply delay if specified
    if (config.delay) {
      element.style.transitionDelay = `${config.delay}ms`;
    }

    if (elementId === "1-name") {
      console.log("🎭 [animateToFinalPosition] Before animating 1-name", {
        visualY: element.getBoundingClientRect().y,
        currentTransform: element.style.transform,
        willAnimateTo: "translate3d(0, 0, 0)",
        duration: config.duration,
      });
    }

    // Animate to final position
    element.style.transform = "translate3d(0, 0, 0)";

    if (elementId === "1-name") {
      console.log("🎭 [animateToFinalPosition] After setting final transform 1-name", {
        visualY: element.getBoundingClientRect().y,
        transform: element.style.transform,
      });
    }

    let isCleanedUp = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Clean up after animation
    const doCleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;

      if (elementId === "1-name") {
        console.log("✅ [animateToFinalPosition] Animation complete for 1-name", {
          visualY: element.getBoundingClientRect().y,
        });
      }

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

      if (elementId === "1-name") {
        console.log("🚫 [animateToFinalPosition] Animation cleanup cancelled for 1-name");
      }

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

  // Debug logging for one specific cell
  const elementId = element.getAttribute("data-animate-id");
  if (elementId === "1-name") {
    console.log("⚡ [flipElement] Called for 1-name", {
      fromY: fromBounds.y,
      toY: toBounds.y,
      invertY: invert.y,
    });
  }

  // Skip animation if element hasn't moved
  if (invert.x === 0 && invert.y === 0) {
    if (elementId === "1-name") {
      console.log("⏭️ [flipElement] No movement needed for 1-name, cleaning up");
    }
    // Still need to clean up if there was an animation in progress
    cleanupAnimation(element);
    // Return no-op cleanup function
    return () => {};
  }

  // Get appropriate config based on movement type and user preferences
  const config = getAnimationConfig(finalConfig);

  if (elementId === "1-name") {
    console.log("🔄 [flipElement] Starting FLIP sequence for 1-name", {
      step: "1-before-apply-transform",
      currentVisualY: element.getBoundingClientRect().y,
      currentTransform: element.style.transform,
      currentTransition: element.style.transition,
    });
  }

  // CRITICAL: Apply new transform BEFORE cleaning up old one to prevent flickering
  // This ensures there's no gap where the element snaps to its DOM position
  // First, apply the new initial transform (this will override the existing transform)
  applyInitialTransform(element, invert);

  if (elementId === "1-name") {
    console.log("🔄 [flipElement] After applyInitialTransform for 1-name", {
      step: "2-after-apply-transform",
      currentVisualY: element.getBoundingClientRect().y,
      currentTransform: element.style.transform,
    });
  }

  // Now safe to clean up transition properties (but transform is already set above)
  // Only clean transition-related properties, not transform
  element.style.transition = "";
  element.style.transitionDelay = "";

  if (elementId === "1-name") {
    console.log("🔄 [flipElement] After clearing transitions for 1-name", {
      step: "3-after-clear-transitions",
      currentVisualY: element.getBoundingClientRect().y,
    });
  }

  // Animate to final position and get cleanup function
  const cleanup = await animateToFinalPosition(element, config, finalConfig);

  if (elementId === "1-name") {
    console.log("🔄 [flipElement] FLIP sequence complete for 1-name");
  }

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
  } = options;

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
