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
 * Applies initial transform to element for FLIP animation
 */
export const applyInitialTransform = (element: HTMLElement, invert: { x: number; y: number }) => {
  element.style.transform = `translate3d(${invert.x}px, ${invert.y}px, 0)`;
  element.style.transition = "none";
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
  // Remove animating class to restore normal z-index
  element.classList.remove("st-animating");
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

  // Clean up any existing animation before starting a new one
  cleanupAnimation(element);

  // Apply initial transform
  applyInitialTransform(element, invert);

  // Animate to final position
  await animateToFinalPosition(element, options);
};
