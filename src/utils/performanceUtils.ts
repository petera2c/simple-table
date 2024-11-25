import { DragEvent, useCallback } from "react";
import { useRef } from "react";
import HeaderObject from "../types/HeaderObject";

export const useThrottle = ({
  callback,
  limit,
}: {
  callback: ({
    event,
    hoveredHeader,
  }: {
    event: DragEvent<HTMLDivElement>;
    hoveredHeader: HeaderObject;
  }) => void;
  limit: number;
}) => {
  const lastCallTime = useRef(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    ({
      event,
      hoveredHeader,
    }: {
      event: DragEvent<HTMLDivElement>;
      hoveredHeader: HeaderObject;
    }) => {
      const now = Date.now();
      if (lastCallTime.current === 0 || now - lastCallTime.current >= limit) {
        callback({ event, hoveredHeader });
        lastCallTime.current = now;
      } else if (timeoutId.current === null) {
        timeoutId.current = setTimeout(() => {
          lastCallTime.current = Date.now();
          timeoutId.current = null;
        }, limit - (now - lastCallTime.current));
      }
    },
    [callback, limit]
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
