import React from "react";

export interface LineAreaChartProps {
  data: number[];
  width?: number | string;
  height?: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  className?: string;
  min?: number; // Custom minimum value for scaling
  max?: number; // Custom maximum value for scaling
}

/**
 * LineAreaChart - A simple area chart component for displaying data trends in table cells
 * No axes, labels, or grid lines - just the data visualization
 */
const LineAreaChart: React.FC<LineAreaChartProps> = ({
  data,
  width = "100%",
  height = 30,
  color,
  fillColor,
  fillOpacity = 0.2,
  strokeWidth = 2,
  className = "",
  min: customMin,
  max: customMax,
}) => {
  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate min and max for scaling (use custom values if provided)
  const min = customMin !== undefined ? customMin : Math.min(...data);
  const max = customMax !== undefined ? customMax : Math.max(...data);
  const range = max - min || 1; // Avoid division by zero

  // For path calculations, we need a numeric width
  // Use viewBox with a standard coordinate system
  const viewBoxWidth = 100;
  const viewBoxHeight = height;

  // Calculate points for the line using viewBox coordinates
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * viewBoxWidth;
    const y = viewBoxHeight - ((value - min) / range) * viewBoxHeight;
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
    L ${viewBoxWidth},${viewBoxHeight}
    L 0,${viewBoxHeight}
    Z
  `;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      className={`st-line-area-chart ${className}`}
      style={{ display: "block" }}
    >
      {/* Area fill */}
      <path
        d={areaPath}
        fill={fillColor || "var(--st-chart-fill-color)"}
        fillOpacity={fillOpacity}
        stroke="none"
        vectorEffect="non-scaling-stroke"
      />
      {/* Line stroke */}
      <path
        d={linePath}
        fill="none"
        stroke={color || "var(--st-chart-color)"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default LineAreaChart;
