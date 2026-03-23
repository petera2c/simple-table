import { useEffect, useRef } from "react";
import PreviousValueTracker from "./previousValue";

/**
 * React hook wrapper around PreviousValueTracker.
 * Tracks the previous value of a prop or state variable.
 * 
 * @param value - The current value to track
 * @returns The previous value
 */
const usePrevious = <T>(value: T) => {
  const trackerRef = useRef<PreviousValueTracker<T> | null>(null);

  if (!trackerRef.current) {
    trackerRef.current = new PreviousValueTracker<T>(value);
  }

  useEffect(() => {
    trackerRef.current?.update(value);
  }, [value]);

  return trackerRef.current.get();
};

export default usePrevious;
