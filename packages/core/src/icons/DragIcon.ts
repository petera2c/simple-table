export const createDragIcon = (className?: string): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("role", "img");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 16 10");
  svg.setAttribute("width", "16px");
  svg.setAttribute("height", "10px");
  
  if (className) {
    svg.setAttribute("class", className);
  }
  
  const circles = [
    { cx: "3", cy: "3" },
    { cx: "8", cy: "3" },
    { cx: "13", cy: "3" },
    { cx: "3", cy: "7" },
    { cx: "8", cy: "7" },
    { cx: "13", cy: "7" },
  ];
  
  circles.forEach(({ cx, cy }) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", "1.5");
    circle.setAttribute("fill", "currentColor");
    svg.appendChild(circle);
  });
  
  return svg;
};
