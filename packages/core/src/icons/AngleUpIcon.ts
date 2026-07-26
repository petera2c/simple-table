import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke chevron-up. */
export const createAngleUpIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    paths: ["m18 15-6-6-6 6"],
  });
