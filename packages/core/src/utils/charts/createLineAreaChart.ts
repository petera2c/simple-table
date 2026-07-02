export interface LineAreaChartProps {
  data: number[];
  width?: number | string;
  height?: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  className?: string;
  min?: number;
  max?: number;
}

let gradientIdCounter = 0;

/**
 * Renders a sparkline line/area chart in pixel space: the viewBox always
 * matches the actual rendered size (tracked via ResizeObserver), so the stroke
 * keeps a uniform width instead of being smeared by non-uniform scaling. The
 * line is inset by half the stroke width so peaks and valleys aren't clipped,
 * and the area is filled with a vertical gradient that fades toward the
 * baseline.
 */
export const createLineAreaChart = (options: LineAreaChartProps) => {
  let {
    data,
    width = "100%",
    height = 30,
    color,
    fillColor,
    fillOpacity = 0.25,
    strokeWidth = 1.5,
    className = "",
    min: customMin,
    max: customMax,
  } = options;

  if (!data || data.length === 0) {
    return null;
  }

  const gradientId = `st-line-area-gradient-${++gradientIdCounter}`;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("class", `st-line-area-chart ${className}`.trim());
  svg.style.display = "block";

  // Pixel width used for layout; updated by the ResizeObserver once mounted.
  let renderWidth = typeof width === "number" ? width : 100;

  const render = () => {
    svg.innerHTML = "";

    const w = renderWidth;
    const h = height;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const min = customMin !== undefined ? customMin : Math.min(...data);
    const max = customMax !== undefined ? customMax : Math.max(...data);
    const range = max - min || 1;

    // Inset so the stroke (including round caps) isn't clipped at the edges.
    const pad = strokeWidth / 2 + 0.5;
    const innerWidth = Math.max(1, w - pad * 2);
    const innerHeight = Math.max(1, h - pad * 2);

    const points = data.map((value, index) => {
      const x =
        data.length === 1 ? pad + innerWidth / 2 : pad + (index / (data.length - 1)) * innerWidth;
      const y = pad + innerHeight - ((value - min) / range) * innerHeight;
      return { x, y };
    });

    const linePath = points
      .map((point, index) => {
        return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)},${point.y.toFixed(2)}`;
      })
      .join(" ");

    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    const areaPath = `${linePath} L ${lastX.toFixed(2)},${h} L ${firstX.toFixed(2)},${h} Z`;

    const resolvedFill = fillColor || "var(--st-chart-fill-color)";

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", gradientId);
    gradient.setAttribute("x1", "0");
    gradient.setAttribute("y1", "0");
    gradient.setAttribute("x2", "0");
    gradient.setAttribute("y2", "1");

    const stopTop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stopTop.setAttribute("offset", "0%");
    stopTop.style.stopColor = resolvedFill;
    stopTop.setAttribute("stop-opacity", String(fillOpacity));

    const stopBottom = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stopBottom.setAttribute("offset", "100%");
    stopBottom.style.stopColor = resolvedFill;
    stopBottom.setAttribute("stop-opacity", String(fillOpacity * 0.15));

    gradient.appendChild(stopTop);
    gradient.appendChild(stopBottom);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const areaPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    areaPathElement.setAttribute("d", areaPath);
    areaPathElement.setAttribute("fill", `url(#${gradientId})`);
    areaPathElement.setAttribute("stroke", "none");

    const linePathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    linePathElement.setAttribute("d", linePath);
    linePathElement.setAttribute("fill", "none");
    linePathElement.setAttribute("stroke", color || "var(--st-chart-color)");
    linePathElement.setAttribute("stroke-width", String(strokeWidth));
    linePathElement.setAttribute("stroke-linecap", "round");
    linePathElement.setAttribute("stroke-linejoin", "round");

    svg.appendChild(areaPathElement);
    svg.appendChild(linePathElement);
  };

  render();

  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver((entries) => {
          const observedWidth = entries[0]?.contentRect.width ?? 0;
          if (observedWidth > 0 && Math.abs(observedWidth - renderWidth) >= 0.5) {
            renderWidth = observedWidth;
            render();
          }
        })
      : null;
  resizeObserver?.observe(svg);

  const update = (newOptions: Partial<LineAreaChartProps>) => {
    if (newOptions.data !== undefined) {
      data = newOptions.data;
      if (!data || data.length === 0) {
        svg.innerHTML = "";
        return;
      }
    }
    if (newOptions.width !== undefined) {
      width = newOptions.width;
      svg.setAttribute("width", String(width));
      if (typeof width === "number") {
        renderWidth = width;
      }
    }
    if (newOptions.height !== undefined) {
      height = newOptions.height;
      svg.setAttribute("height", String(height));
    }
    if (newOptions.color !== undefined) {
      color = newOptions.color;
    }
    if (newOptions.fillColor !== undefined) {
      fillColor = newOptions.fillColor;
    }
    if (newOptions.fillOpacity !== undefined) {
      fillOpacity = newOptions.fillOpacity;
    }
    if (newOptions.strokeWidth !== undefined) {
      strokeWidth = newOptions.strokeWidth;
    }
    if (newOptions.className !== undefined) {
      className = newOptions.className;
      svg.setAttribute("class", `st-line-area-chart ${className}`.trim());
    }
    if (newOptions.min !== undefined) {
      customMin = newOptions.min;
    }
    if (newOptions.max !== undefined) {
      customMax = newOptions.max;
    }

    render();
  };

  const destroy = () => {
    resizeObserver?.disconnect();
    svg.remove();
  };

  return { element: svg, update, destroy };
};
