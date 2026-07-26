/**
 * Previous default icon factories for Storybook A/B only.
 * Not used by the table at runtime.
 */

type Factory = (className?: string) => SVGSVGElement;

const createFillSvg = (
  viewBox: string,
  pathD: string,
  size: { height?: string; width?: string; heightEm?: boolean },
  className?: string,
): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", viewBox);
  if (size.heightEm) svg.setAttribute("height", "1em");
  if (size.height) svg.setAttribute("height", size.height);
  if (size.width) svg.setAttribute("width", size.width);
  if (className) svg.setAttribute("class", className);

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);
  return svg;
};

export const createLegacyFilterIcon: Factory = (className) =>
  createFillSvg(
    "0 0 512 512",
    "M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z",
    { heightEm: true },
    className,
  );

export const createLegacyAscIcon: Factory = (className) =>
  createFillSvg(
    "0 0 320 512",
    "M298 177.5c3.8-8.8 2-19-4.6-26l-116-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-116 144c-6.6 7-8.4 17.2-4.6 26S34.4 192 44 192l72 0 0 288c0 17.7 14.3 32 32 32l24 0c17.7 0 32-14.3 32-32l0-288 72 0c9.6 0 18.2-5.7 22-14.5z",
    { heightEm: true },
    className,
  );

export const createLegacyDescIcon: Factory = (className) =>
  createFillSvg(
    "0 0 320 512",
    "M22 334.5c-3.8 8.8-2 19 4.6 26l116 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l116-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L148 0C130.3 0 116 14.3 116 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z",
    { heightEm: true },
    className,
  );

export const createLegacyAngleRightIcon: Factory = (className) =>
  createFillSvg(
    "0 0 24 24",
    "M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z",
    { width: "24", height: "24" },
    className,
  );

export const createLegacyAngleLeftIcon: Factory = (className) =>
  createFillSvg(
    "0 0 24 24",
    "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
    { width: "24", height: "24" },
    className,
  );

export const createLegacyAngleDownIcon: Factory = (className) =>
  createFillSvg(
    "0 0 24 24",
    "M5.41 7.59L10 12.17l4.59-4.58L16 9l-6 6-6-6z",
    { width: "24", height: "24" },
    className,
  );

export const createLegacyAngleUpIcon: Factory = (className) =>
  createFillSvg(
    "0 0 24 24",
    "M5.41 11.41L10 6.83l4.59 4.58L16 10l-6-6-6 6z",
    { width: "24", height: "24" },
    className,
  );

export const createLegacyDragIcon: Factory = (className) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 16 10");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "10");
  if (className) svg.setAttribute("class", className);
  for (const { cx, cy } of [
    { cx: "3", cy: "3" },
    { cx: "8", cy: "3" },
    { cx: "13", cy: "3" },
    { cx: "3", cy: "7" },
    { cx: "8", cy: "7" },
    { cx: "13", cy: "7" },
  ]) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", "1.5");
    circle.setAttribute("fill", "currentColor");
    svg.appendChild(circle);
  }
  return svg;
};

export const createLegacyCheckIcon: Factory = (className) =>
  createFillSvg(
    "0 0 448 512",
    "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z",
    { height: "10px" },
    className,
  );

export const createLegacySelectIcon = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "12");
  svg.setAttribute("height", "12");
  svg.setAttribute("viewBox", "0 0 12 12");
  svg.setAttribute("fill", "none");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M3 4.5L6 7.5L9 4.5");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
};
