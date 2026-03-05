export const createAngleDownIcon = (className?: string): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  
  if (className) {
    svg.setAttribute("class", className);
  }
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M5.41 7.59L10 12.17l4.59-4.58L16 9l-6 6-6-6z");
  svg.appendChild(path);
  
  return svg;
};
