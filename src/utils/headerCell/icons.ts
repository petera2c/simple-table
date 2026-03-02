// SVG icon data for header cells
export const SVG_ICONS = {
  sortUp: {
    viewBox: "0 0 320 512",
    path: "M298 177.5c3.8-8.8 2-19-4.6-26l-116-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-116 144c-6.6 7-8.4 17.2-4.6 26S34.4 192 44 192l72 0 0 288c0 17.7 14.3 32 32 32l24 0c17.7 0 32-14.3 32-32l0-288 72 0c9.6 0 18.2-5.7 22-14.5z",
    height: "1em",
  },
  sortDown: {
    viewBox: "0 0 320 512",
    path: "M22 334.5c-3.8 8.8-2 19 4.6 26l116 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l116-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L148 0C130.3 0 116 14.3 116 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z",
    height: "1em",
  },
  filter: {
    viewBox: "0 0 512 512",
    path: "M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z",
    height: "1em",
  },
  angleLeft: {
    viewBox: "0 0 24 24",
    path: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
    width: "24",
    height: "24",
  },
  angleRight: {
    viewBox: "0 0 24 24",
    path: "M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z",
    width: "24",
    height: "24",
  },
  check: {
    viewBox: "0 0 448 512",
    path: "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z",
    height: "10px",
  },
};

// Create SVG element from icon data
export const createSVGIcon = (iconKey: keyof typeof SVG_ICONS, className?: string, style?: Partial<CSSStyleDeclaration>): SVGSVGElement => {
  const iconData = SVG_ICONS[iconKey];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("role", "img");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", iconData.viewBox);
  
  if (className) {
    svg.setAttribute("class", className);
  }
  
  if ("width" in iconData && iconData.width) {
    svg.style.width = iconData.width;
  }
  if (iconData.height) {
    svg.style.height = iconData.height;
  }
  
  if (style) {
    Object.assign(svg.style, style);
  }
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", iconData.path);
  
  svg.appendChild(path);
  return svg;
};
