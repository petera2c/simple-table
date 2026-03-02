// SVG icon data for body cells
export const SVG_ICONS: Record<string, { path: string; viewBox: string; width?: number }> = {
  chevronRight: {
    path: "M9 18l6-6-6-6",
    viewBox: "0 0 24 24",
  },
  chevronDown: {
    path: "M6 9l6 6 6-6",
    viewBox: "0 0 24 24",
  },
};

// Create SVG icon element
export const createSVGIcon = (iconName: keyof typeof SVG_ICONS, className: string = ""): SVGSVGElement => {
  const iconData = SVG_ICONS[iconName];
  if (!iconData) {
    throw new Error(`Icon "${iconName}" not found`);
  }

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", iconData.viewBox);
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  if (className) {
    svg.setAttribute("class", className);
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", iconData.path);
  svg.appendChild(path);

  return svg;
};
