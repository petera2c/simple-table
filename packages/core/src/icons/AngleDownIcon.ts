import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke chevron-down. */
export const createAngleDownIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    paths: ["m6 9 6 6 6-6"],
  });
