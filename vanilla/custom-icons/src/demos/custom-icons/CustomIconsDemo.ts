import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, IconsConfig, GetRowIdParams } from "simple-table-core";
import { customIconsConfig } from "./custom-icons.demo-data";
import type { SoftwareRelease } from "./custom-icons.demo-data";
import "simple-table-core/styles.css";

function iconSvg(pathD: string, color: string, strokeWidth = "2.5"): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", color);
  svg.setAttribute("stroke-width", strokeWidth);
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  svg.appendChild(path);
  return svg;
}

const getRowId = ({ row }: GetRowIdParams<SoftwareRelease>) => row.id;

const icons: IconsConfig = {
  sortUp: iconSvg("M12 19V5M5 12l7-7 7 7", "#6366f1"),
  sortDown: iconSvg("M12 5v14M19 12l-7 7-7-7", "#6366f1"),
  filter: iconSvg("M3 4h18l-7 8.5V18l-4 2V12.5L3 4z", "#8b5cf6", "2"),
  expand: iconSvg("M9 5l7 7-7 7", "#6366f1"),
  next: iconSvg("M9 5l7 7-7 7", "#2563eb"),
  prev: iconSvg("M15 19l-7-7 7-7", "#2563eb"),
};

export function renderCustomIconsDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<SoftwareRelease> {
  return new SimpleTableVanilla(container, {
    getRowId,
    columns: customIconsConfig.headers,
    rows: customIconsConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    icons,
  });
}
