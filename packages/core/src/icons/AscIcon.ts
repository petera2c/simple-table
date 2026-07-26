import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke arrow-up — sort ascending. */
export const createAscIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    paths: ["m5 12 7-7 7 7", "M12 19V5"],
  });
