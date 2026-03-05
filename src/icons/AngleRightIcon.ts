export const createAngleRightIcon = (className?: string): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  
  if (className) {
    svg.setAttribute("class", className);
  }
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z");
  svg.appendChild(path);
  
  return svg;
};
