import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke arrow-down — sort descending. */
export const createDescIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    paths: ["M12 5v14", "m19 12-7 7-7-7"],
  });
