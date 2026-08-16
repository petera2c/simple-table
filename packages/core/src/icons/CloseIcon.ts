import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke X — dismiss / remove control. */
export const createCloseIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    width: 14,
    height: 14,
    strokeWidth: 2,
    paths: ["M18 6L6 18", "M6 6l12 12"],
  });
