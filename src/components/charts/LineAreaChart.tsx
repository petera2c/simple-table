import React from "react";

export interface LineAreaChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * LineAreaChart - A simple area chart component for displaying data trends in table cells
 * No axes, labels, or grid lines - just the data visualization
 */
const LineAreaChart: React.FC<LineAreaChartProps> = ({
  data,
  width = 100,
  height = 30,
  color,
  fillColor,
  fillOpacity = 0.2,
  strokeWidth = 2,
  className = "",
}) => {
  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate min and max for scaling
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Avoid division by zero

  // Calculate points for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return { x, y };
  });

  // Create path for line
  const linePath = points
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x},${point.y}`;
    })
    .join(" ");

  // Create path for area (line + bottom)
  const areaPath = `
    ${linePath}
    L ${width},${height}
    L 0,${height}
    Z
  `;

  return (
    <svg
      width={width}
      height={height}
      className={`st-line-area-chart ${className}`}
      style={{ display: "block" }}
    >
      {/* Area fill */}
      <path
        d={areaPath}
        fill={fillColor || "var(--st-chart-fill-color)"}
        fillOpacity={fillOpacity}
        stroke="none"
      />
      {/* Line stroke */}
      <path
        d={linePath}
        fill="none"
        stroke={color || "var(--st-chart-color)"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LineAreaChart;
