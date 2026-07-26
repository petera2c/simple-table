import { createStrokeIcon } from "./createStrokeIcon";

/** Stroke list-filter — three tapering lines; matches sort/chevron stroke icons. */
export const createFilterIcon = (className?: string): SVGSVGElement =>
  createStrokeIcon({
    className,
    paths: ["M3 6h18", "M7 12h10", "M10 18h4"],
  });
