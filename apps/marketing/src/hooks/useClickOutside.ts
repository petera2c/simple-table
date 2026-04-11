import { useEffect, RefObject } from "react";

/**
 * Hook that triggers a callback when clicking outside of the specified element
 * @param ref - React ref object pointing to the element to detect clicks outside of
 * @param callback - Function to call when a click outside is detected
 * @param enabled - Optional flag to enable/disable the listener (defaults to true)
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback, enabled]);
};
