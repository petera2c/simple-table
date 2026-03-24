export const createAngleLeftIcon = (className?: string): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  
  if (className) {
    svg.setAttribute("class", className);
  }
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z");
  path.setAttribute("fill", "inherit");
  svg.appendChild(path);
  
  return svg;
};
