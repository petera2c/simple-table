export interface BarChartProps {
  data: number[];
  width?: number | string;
  height?: number;
  color?: string;
  gap?: number;
  className?: string;
  min?: number;
  max?: number;
}

export const createBarChart = (options: BarChartProps) => {
  let {
    data,
    width = "100%",
    height = 30,
    color,
    gap = 2,
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

  const totalGapWidth = gap * (data.length - 1);
  const barWidth = (viewBoxWidth - totalGapWidth) / data.length;

  const hasNegative = min < 0;
  const zeroY = hasNegative ? viewBoxHeight * (max / range) : viewBoxHeight;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("class", `st-bar-chart ${className}`.trim());
  svg.setAttribute("shape-rendering", "crispEdges");
  svg.style.display = "block";

  const render = () => {
    svg.innerHTML = "";

    data.forEach((value, index) => {
      const x = index * (barWidth + gap);

      const normalizedValue = (value - min) / range;
      const barHeight = normalizedValue * viewBoxHeight;
      const y = viewBoxHeight - barHeight;

      let adjustedY = y;
      let adjustedHeight = barHeight;

      if (hasNegative) {
        if (value >= 0) {
          adjustedHeight = (value / range) * viewBoxHeight;
          adjustedY = zeroY - adjustedHeight;
        } else {
          adjustedHeight = (Math.abs(value) / range) * viewBoxHeight;
          adjustedY = zeroY;
        }
      }

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(adjustedY));
      rect.setAttribute("width", String(barWidth));
      rect.setAttribute("height", String(adjustedHeight));
      rect.setAttribute("fill", color || "var(--st-chart-color)");
      rect.setAttribute("rx", "0.5");

      svg.appendChild(rect);
    });
  };

  render();

  const update = (newOptions: Partial<BarChartProps>) => {
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
    if (newOptions.gap !== undefined) {
      gap = newOptions.gap;
    }
    if (newOptions.className !== undefined) {
      className = newOptions.className;
      svg.setAttribute("class", `st-bar-chart ${className}`.trim());
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
