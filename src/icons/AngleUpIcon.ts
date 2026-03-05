export const createAngleUpIcon = (className?: string): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  
  if (className) {
    svg.setAttribute("class", className);
  }
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M5.41 11.41L10 6.83l4.59 4.58L16 10l-6-6-6 6z");
  svg.appendChild(path);
  
  return svg;
};
