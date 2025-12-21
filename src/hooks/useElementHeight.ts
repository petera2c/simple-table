import { useState, useEffect, RefObject } from "react";

interface UseElementHeightProps {
  ref: RefObject<HTMLElement>;
  enabled?: boolean;
}

/**
 * Hook to measure and track the height of an element using ResizeObserver
 * @param ref - React ref to the element to measure
 * @param enabled - Whether to enable measurement (default: true)
 * @returns The current height of the element in pixels, or undefined if not yet measured
 */
export const useElementHeight = ({
  ref,
  enabled = true,
}: UseElementHeightProps): number | undefined => {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;

    // Initial measurement
    const initialHeight = element.getBoundingClientRect().height;
    setHeight(initialHeight);

    // Set up ResizeObserver to watch for changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use borderBoxSize for more accurate measurement
        if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
          const newHeight = entry.borderBoxSize[0].blockSize;
          setHeight(newHeight);
        } else {
          // Fallback to getBoundingClientRect
          const newHeight = entry.target.getBoundingClientRect().height;
          setHeight(newHeight);
        }
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, enabled]);

  return height;
};
