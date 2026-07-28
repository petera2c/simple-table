import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke minus — indeterminate checkbox mark. */
export const createMinusIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    width: 12,
    height: 12,
    strokeWidth: 2.5,
    paths: ["M5 12h14"],
  });
