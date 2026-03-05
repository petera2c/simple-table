export const createDescIcon = (className?: string): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("role", "img");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 320 512");
  svg.style.height = "1em";
  
  if (className) {
    svg.setAttribute("class", className);
  }
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M22 334.5c-3.8 8.8-2 19 4.6 26l116 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l116-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L148 0C130.3 0 116 14.3 116 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z");
  svg.appendChild(path);
  
  return svg;
};
