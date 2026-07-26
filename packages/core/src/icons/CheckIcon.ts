import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke check — checkbox mark. */
export const createCheckIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    width: 12,
    height: 12,
    strokeWidth: 2.5,
    paths: ["M20 6 9 17l-5-5"],
  });
