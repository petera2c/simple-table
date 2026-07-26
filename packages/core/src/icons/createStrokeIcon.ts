/** Shared factory for stroke icons (24×24 grid, currentColor). */

export interface CreateStrokeIconOptions {
  className?: string;
  width?: number;
  height?: number;
  paths: string[];
  /** Extra elements (e.g. circles for grip icons). */
  circles?: Array<{ cx: number; cy: number; r: number }>;
  strokeWidth?: number;
}

export const createStrokeIcon = ({
  className,
  width = 20,
  height = 20,
  paths,
  circles = [],
  strokeWidth = 2,
}: CreateStrokeIconOptions): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("role", "img");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", String(strokeWidth));
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  if (className) {
    svg.setAttribute("class", className);
  }

  for (const d of paths) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    svg.appendChild(path);
  }

  for (const { cx, cy, r } of circles) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(cx));
    circle.setAttribute("cy", String(cy));
    circle.setAttribute("r", String(r));
    // Grip dots are filled, not stroked
    circle.setAttribute("fill", "currentColor");
    circle.setAttribute("stroke", "none");
    svg.appendChild(circle);
  }

  return svg;
};
