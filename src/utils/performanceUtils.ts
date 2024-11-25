import { useCallback } from "react";
import { useRef } from "react";
import HeaderObject from "../types/HeaderObject";

export const useThrottle = () => {
  const lastCallTime = useRef(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    ({
      callback,
      callbackProps,
      limit,
    }: {
      callback: (callbackProps: any) => void;
      callbackProps: any;
      limit: number;
    }) => {
      const now = Date.now();
      if (lastCallTime.current === 0 || now - lastCallTime.current >= limit) {
        callback(callbackProps);
        lastCallTime.current = now;
      } else if (timeoutId.current === null) {
        timeoutId.current = setTimeout(() => {
          lastCallTime.current = Date.now();
          timeoutId.current = null;
        }, limit - (now - lastCallTime.current));
      }
    },
    []
  );
};

export const logArrayDifferences = (
  original: HeaderObject[],
  updated: HeaderObject[]
) => {
  const differences = original.reduce((diff, header, index) => {
    if (header.accessor !== updated[index]?.accessor) {
      diff.push({ original: header, updated: updated[index] });
    }
    return diff;
  }, [] as { original: HeaderObject; updated: HeaderObject | undefined }[]);

  console.info("Differences between arrays:", differences);
  console.info("\n");
};
