import React from "react";

export interface BarChartProps {
  data: number[];
  width?: number | string;
  height?: number;
  color?: string;
  gap?: number;
  className?: string;
  min?: number; // Custom minimum value for scaling
  max?: number; // Custom maximum value for scaling
}

/**
 * BarChart - A simple bar chart component for displaying data in table cells
 * No axes, labels, or grid lines - just the bars
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  width = "100%",
  height = 30,
  color,
  gap = 2,
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

  // Calculate bar width
  const totalGapWidth = gap * (data.length - 1);
  const barWidth = (viewBoxWidth - totalGapWidth) / data.length;

  // Handle negative values - find zero line position
  const hasNegative = min < 0;
  const zeroY = hasNegative ? viewBoxHeight * (max / range) : viewBoxHeight;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      className={`st-bar-chart ${className}`}
      style={{ display: "block" }}
      shapeRendering="crispEdges"
    >
      {data.map((value, index) => {
        const x = index * (barWidth + gap);

        // Calculate bar height and position
        const normalizedValue = (value - min) / range;
        const barHeight = normalizedValue * viewBoxHeight;
        const y = viewBoxHeight - barHeight;

        // For charts with negative values, adjust positioning
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

        return (
          <rect
            key={index}
            x={x}
            y={adjustedY}
            width={barWidth}
            height={adjustedHeight}
            fill={color || "var(--st-chart-color)"}
            rx={0.5} // Subtle rounding for modern look
          />
        );
      })}
    </svg>
  );
};

export default BarChart;
