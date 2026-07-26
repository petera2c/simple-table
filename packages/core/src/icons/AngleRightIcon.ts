import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke chevron-right. */
export const createAngleRightIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    paths: ["m9 18 6-6-6-6"],
  });
