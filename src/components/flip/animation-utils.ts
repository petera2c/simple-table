import { FlipItem, FlipAnimationState, AnimationConfig, FlipAnimationOptions } from "./types";

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: 300,
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // ease-out-quad
  delay: 0,
};

/**
 * Captures the current position and dimensions of elements
 */
export const captureElementBounds = (elements: HTMLElement[]): Map<string | number, DOMRect> => {
  const bounds = new Map<string | number, DOMRect>();

  elements.forEach((element) => {
    const id = element.getAttribute("data-flip-id");
    if (id) {
      bounds.set(id, element.getBoundingClientRect());
    }
  });

  return bounds;
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
export const animateToFinalPosition = (
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

/**
 * Performs FLIP animation on multiple elements
 */
export const flipElements = async (
  elements: HTMLElement[],
  firstBounds: Map<string | number, DOMRect>,
  options: FlipAnimationOptions = {}
): Promise<void> => {
  const animations = elements.map(async (element) => {
    const id = element.getAttribute("data-flip-id");
    if (id && firstBounds.has(id)) {
      const first = firstBounds.get(id)!;
      await flipElement(element, first, options);
    }
  });

  await Promise.all(animations);
};

/**
 * Easing functions for custom animations
 */
export const easingFunctions = {
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  easeInOutQuart: "cubic-bezier(0.77, 0, 0.175, 1)",
};

/**
 * Stagger animation delays for multiple elements
 */
export const calculateStaggerDelay = (index: number, stagger: number = 50): number => {
  return index * stagger;
};
