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

/**
 * Renders a sparkline bar chart in pixel space: the viewBox always matches the
 * actual rendered size (tracked via ResizeObserver), and bar edges are snapped
 * to whole pixels so bars and gaps stay uniform and crisp at any column width.
 */
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

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("class", `st-bar-chart ${className}`.trim());
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

    const count = data.length;

    // Shrink the gap when there isn't room for at least 1px-wide bars.
    let effectiveGap = Math.max(0, gap);
    if (count > 1 && (w - effectiveGap * (count - 1)) / count < 1) {
      effectiveGap = Math.max(0, Math.floor((w - count) / (count - 1)));
    }
    const barWidth = (w - effectiveGap * (count - 1)) / count;
    const step = barWidth + effectiveGap;

    const hasNegative = min < 0;
    const zeroY = hasNegative ? h * (max / range) : h;

    data.forEach((value, index) => {
      let top: number;
      let bottom: number;

      if (hasNegative) {
        if (value >= 0) {
          const barHeight = (value / range) * h;
          top = zeroY - barHeight;
          bottom = zeroY;
        } else {
          top = zeroY;
          bottom = zeroY + (Math.abs(value) / range) * h;
        }
      } else {
        const barHeight = ((value - min) / range) * h;
        top = h - barHeight;
        bottom = h;
      }

      // Snap edges to whole pixels for uniform, crisp bars; keep every bar at
      // least 1px wide and 1px tall so minimum values remain visible.
      const x0 = Math.round(index * step);
      const x1 = Math.max(x0 + 1, Math.round(index * step + barWidth));
      const y0 = Math.round(top);
      const y1 = Math.max(y0 + 1, Math.round(bottom));

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(x0));
      rect.setAttribute("y", String(y0));
      rect.setAttribute("width", String(x1 - x0));
      rect.setAttribute("height", String(y1 - y0));
      rect.setAttribute("fill", color || "var(--st-chart-color)");
      rect.setAttribute("rx", String(Math.min(1, (x1 - x0) / 3)));

      svg.appendChild(rect);
    });
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
    resizeObserver?.disconnect();
    svg.remove();
  };

  return { element: svg, update, destroy };
};
