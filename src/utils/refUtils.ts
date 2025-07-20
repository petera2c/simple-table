import React from "react";

/**
 * Merges multiple refs into a single ref callback
 * Handles both callback refs and ref objects
 * React 18 compatible
 */
export const mergeRefs = <T = any>(
  ...refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>
) => {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
};
