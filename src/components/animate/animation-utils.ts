import { AnimationConfig, FlipAnimationOptions } from "./types";

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: 300,
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // ease-out-quad
  delay: 0,
};

/**
 * Calculates the invert values for FLIP animation
 */
export const calculateInvert = (first: DOMRect, last: DOMRect) => {
  return {
    x: first.left - last.left,
    y: first.top - last.top,
  };
};

/**
 * Applies initial transform to element for FLIP animation
 */
export const applyInitialTransform = (element: HTMLElement, invert: { x: number; y: number }) => {
  element.style.transform = `translate3d(${invert.x}px, ${invert.y}px, 0)`;
  element.style.transition = "none";
};

/**
 * Animates element to its final position
 */
const animateToFinalPosition = (
  element: HTMLElement,
  options: FlipAnimationOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const config = { ...DEFAULT_ANIMATION_CONFIG, ...options };

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
      element.style.transition = "";
      element.style.transitionDelay = "";
      element.style.transform = "";
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
 * Performs FLIP animation on a single element
 */
export const flipElement = async (
  element: HTMLElement,
  first: DOMRect,
  options: FlipAnimationOptions = {}
): Promise<void> => {
  const last = element.getBoundingClientRect();
  const invert = calculateInvert(first, last);

  // Skip animation if element hasn't moved
  if (invert.x === 0 && invert.y === 0) {
    return;
  }

  // Apply initial transform
  applyInitialTransform(element, invert);

  // Animate to final position
  await animateToFinalPosition(element, options);
};
