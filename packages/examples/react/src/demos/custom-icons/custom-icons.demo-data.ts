// Self-contained demo table setup for this example.
import type { HeaderObject, Row } from "@simple-table/react";


export const customIconsData: Row[] = [
  { id: 1, name: "Alpha Release", version: "1.0.0", status: "released", downloads: 15420, date: "2024-01-15" },
  { id: 2, name: "Beta Release", version: "1.1.0", status: "released", downloads: 28300, date: "2024-03-22" },
  { id: 3, name: "Hotfix", version: "1.1.1", status: "released", downloads: 31050, date: "2024-04-05" },
  { id: 4, name: "Feature Update", version: "1.2.0", status: "released", downloads: 42100, date: "2024-06-10" },
  { id: 5, name: "Security Patch", version: "1.2.1", status: "released", downloads: 45800, date: "2024-07-18" },
  { id: 6, name: "Major Release", version: "2.0.0", status: "released", downloads: 67200, date: "2024-09-01" },
  { id: 7, name: "Minor Update", version: "2.1.0", status: "beta", downloads: 8900, date: "2024-11-12" },
  { id: 8, name: "Next Release", version: "2.2.0", status: "planned", downloads: 0, date: "2025-01-20" },
];

export const customIconsHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number", isSortable: true },
  { accessor: "name", label: "Release", width: 170, type: "string", isSortable: true },
  { accessor: "version", label: "Version", width: 100, type: "string", isSortable: true },
  { accessor: "status", label: "Status", width: 110, type: "string", isSortable: true },
  {
    accessor: "downloads",
    label: "Downloads",
    width: 130,
    type: "number",
    isSortable: true,
    valueFormatter: ({ value }) => (value as number).toLocaleString(),
  },
  {
    accessor: "date",
    label: "Date",
    width: 130,
    type: "date",
    isSortable: true,
    valueFormatter: ({ value }) => new Date(value as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  },
];

export const customIconsConfig = {
  headers: customIconsHeaders,
  rows: customIconsData,
} as const;

export function createSvgIcon(pathD: string, color = "#3b82f6", size = 14): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", color);
  svg.setAttribute("stroke-width", "2.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  svg.appendChild(path);
  return svg;
}

export const ICON_PATHS = {
  sortUp: "M12 19V5M5 12l7-7 7 7",
  sortDown: "M12 5v14M19 12l-7 7-7-7",
  filter: "M3 4h18l-7 8.5V18l-4 2V12.5L3 4z",
  expand: "M9 5l7 7-7 7",
  next: "M9 5l7 7-7 7",
  prev: "M15 19l-7-7 7-7",
} as const;

export function buildVanillaCustomIcons() {
  return {
    sortUp: createSvgIcon(ICON_PATHS.sortUp, "#6366f1"),
    sortDown: createSvgIcon(ICON_PATHS.sortDown, "#6366f1"),
    filter: createSvgIcon(ICON_PATHS.filter, "#8b5cf6"),
    expand: createSvgIcon(ICON_PATHS.expand, "#6366f1"),
    next: createSvgIcon(ICON_PATHS.next, "#2563eb"),
    prev: createSvgIcon(ICON_PATHS.prev, "#2563eb"),
  };
}
