import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke chevron-left. */
export const createAngleLeftIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    paths: ["m15 18-6-6 6-6"],
  });
