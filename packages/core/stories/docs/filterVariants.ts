/**
 * Focused filter-icon comparison for Storybook — not wired into the table.
 */

export type FilterVariant = {
  id: string;
  name: string;
  note: string;
  create: () => SVGSVGElement;
};

const SIZE = 20;

const svgRoot = (
  viewBox: string,
  width: number,
  height: number,
  fillNone = false,
): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  if (fillNone) svg.setAttribute("fill", "none");
  return svg;
};

const addPath = (
  svg: SVGSVGElement,
  d: string,
  opts: { fill?: string; stroke?: string; strokeWidth?: number } = {},
) => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  if (opts.fill) path.setAttribute("fill", opts.fill);
  if (opts.stroke) {
    path.setAttribute("stroke", opts.stroke);
    path.setAttribute("stroke-width", String(opts.strokeWidth ?? 2));
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    if (!opts.fill) path.setAttribute("fill", "none");
  }
  svg.appendChild(path);
};

const addLine = (
  svg: SVGSVGElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  strokeWidth = 2,
) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", String(x1));
  line.setAttribute("y1", String(y1));
  line.setAttribute("x2", String(x2));
  line.setAttribute("y2", String(y2));
  line.setAttribute("stroke", "currentColor");
  line.setAttribute("stroke-width", String(strokeWidth));
  line.setAttribute("stroke-linecap", "round");
  svg.appendChild(line);
};

/** Filled funnel with soft top and rectangular stem. */
const createFilledFunnelSoft = (): SVGSVGElement => {
  const svg = svgRoot("0 0 24 24", SIZE, SIZE);
  addPath(
    svg,
    "M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61z",
    { fill: "currentColor" },
  );
  return svg;
};

/** Three tapering horizontal bars. */
const createNarrowingBars = (): SVGSVGElement => {
  const svg = svgRoot("0 0 24 24", SIZE, SIZE, true);
  addLine(svg, 3, 6, 21, 6, 2.25);
  addLine(svg, 6, 12, 18, 12, 2.25);
  addLine(svg, 9, 18, 15, 18, 2.25);
  return svg;
};

/** Classic filled funnel silhouette. */
const createFilledFunnelClassic = (): SVGSVGElement => {
  const svg = svgRoot("0 0 512 512", SIZE, SIZE);
  addPath(
    svg,
    "M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z",
    { fill: "currentColor" },
  );
  return svg;
};

/** Outline funnel. */
const createStrokeFunnel = (): SVGSVGElement => {
  const svg = svgRoot("0 0 24 24", SIZE, SIZE, true);
  addPath(svg, "M22 3H2l8 9.46V19l4 2v-8.54L22 3z", {
    stroke: "currentColor",
    strokeWidth: 2,
  });
  return svg;
};

/** Current default — three tapering stroke lines. */
const createListFilter = (): SVGSVGElement => {
  const svg = svgRoot("0 0 24 24", SIZE, SIZE, true);
  addLine(svg, 3, 6, 21, 6, 2);
  addLine(svg, 7, 12, 17, 12, 2);
  addLine(svg, 10, 18, 14, 18, 2);
  return svg;
};

export const FILTER_COMPARISON: FilterVariant[] = [
  {
    id: "list-filter",
    name: "Current · List filter",
    note: "What the table uses now. Stroke narrowing bars — matches sort/chevron icons.",
    create: createListFilter,
  },
  {
    id: "filled-soft",
    name: "Filled funnel (soft stem)",
    note: "Solid funnel with a soft top and rectangular stem.",
    create: createFilledFunnelSoft,
  },
  {
    id: "narrowing-bars",
    name: "Narrowing bars",
    note: "Three horizontal lines getting shorter — common column-filter metaphor.",
    create: createNarrowingBars,
  },
  {
    id: "filled-classic",
    name: "Filled funnel (classic)",
    note: "Solid funnel silhouette with a shaped stem.",
    create: createFilledFunnelClassic,
  },
  {
    id: "stroke-funnel",
    name: "Stroke funnel",
    note: "Outline funnel — common next to a “Filter” label in toolbars.",
    create: createStrokeFunnel,
  },
];
