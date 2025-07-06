import { useRef, useCallback, useEffect } from "react";
import { ListViewItem, FlipAnimationOptions } from "./types";
import { captureElementBounds, flipElements, calculateStaggerDelay } from "./animation-utils";

interface UseFlipAnimationOptions {
  animationOptions?: FlipAnimationOptions;
  staggerDelay?: number;
  disabled?: boolean;
}

export const useFlipAnimation = (items: ListViewItem[], options: UseFlipAnimationOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstBoundsRef = useRef<Map<string | number, DOMRect> | null>(null);
  const isAnimatingRef = useRef(false);
  const previousItemsRef = useRef<ListViewItem[]>(items);

  // Capture bounds before DOM changes
  const captureFirst = useCallback(() => {
    if (!containerRef.current || options.disabled) return;

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>("[data-flip-id]")
    );

    firstBoundsRef.current = captureElementBounds(elements);
  }, [options.disabled]);

  // Perform FLIP animation after DOM changes
  const performFlipAnimation = useCallback(async () => {
    if (!containerRef.current || !firstBoundsRef.current || options.disabled) return;

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>("[data-flip-id]")
    );

    if (elements.length === 0) return;

    isAnimatingRef.current = true;

    try {
      // Apply stagger delay if specified
      if (options.staggerDelay && options.staggerDelay > 0) {
        const animationPromises = elements.map(async (element, index) => {
          const id = element.getAttribute("data-flip-id");
          if (id && firstBoundsRef.current!.has(id)) {
            const first = firstBoundsRef.current!.get(id)!;
            const staggeredOptions = {
              ...options.animationOptions,
              delay: calculateStaggerDelay(index, options.staggerDelay),
            };
            const { flipElement } = await import("./animation-utils");
            await flipElement(element, first, staggeredOptions);
          }
        });

        await Promise.all(animationPromises);
      } else {
        await flipElements(elements, firstBoundsRef.current, options.animationOptions);
      }
    } finally {
      isAnimatingRef.current = false;
      firstBoundsRef.current = null;
    }
  }, [options.animationOptions, options.staggerDelay, options.disabled]);

  // Detect when items have changed and trigger animation (automatic mode)
  useEffect(() => {
    const currentItems = items;
    const previousItems = previousItemsRef.current;

    // Check if items have actually changed
    const hasChanged =
      currentItems.length !== previousItems.length ||
      currentItems.some((item, index) => item.id !== previousItems[index]?.id);

    if (hasChanged && !options.disabled && firstBoundsRef.current) {
      // Perform animation after React has updated the DOM
      const timeoutId = setTimeout(() => {
        performFlipAnimation();
      }, 0);

      return () => clearTimeout(timeoutId);
    }

    previousItemsRef.current = currentItems;
  }, [items, performFlipAnimation, options.disabled]);

  // Helper to manually trigger capture (useful for external triggers)
  const triggerFlipAnimation = useCallback(() => {
    if (options.disabled) return;
    captureFirst();
    // Use setTimeout to ensure DOM has updated
    setTimeout(performFlipAnimation, 0);
  }, [captureFirst, performFlipAnimation, options.disabled]);

  return {
    containerRef,
    captureFirst,
    performFlipAnimation,
    triggerFlipAnimation,
    isAnimating: isAnimatingRef.current,
  };
};

export default useFlipAnimation;
