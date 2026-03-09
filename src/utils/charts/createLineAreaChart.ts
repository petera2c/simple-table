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

  const min = customMin !== undefined ? customMin : Math.min(...data);
  const max = customMax !== undefined ? customMax : Math.max(...data);
  const range = max - min || 1;

  const viewBoxWidth = 100;
  const viewBoxHeight = height;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("class", `st-line-area-chart ${className}`.trim());
  svg.setAttribute("shape-rendering", "geometricPrecision");
  svg.style.display = "block";

  const render = () => {
    svg.innerHTML = "";

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * viewBoxWidth;
      const y = viewBoxHeight - ((value - min) / range) * viewBoxHeight;
      return { x, y };
    });

    const linePath = points
      .map((point, index) => {
        return `${index === 0 ? "M" : "L"} ${point.x},${point.y}`;
      })
      .join(" ");

    const areaPath = `
      ${linePath}
      L ${viewBoxWidth},${viewBoxHeight}
      L 0,${viewBoxHeight}
      Z
    `;

    const areaPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    areaPathElement.setAttribute("d", areaPath);
    areaPathElement.setAttribute("fill", fillColor || "var(--st-chart-fill-color)");
    areaPathElement.setAttribute("fill-opacity", String(fillOpacity));
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
    svg.remove();
  };

  return { element: svg, update, destroy };
};
