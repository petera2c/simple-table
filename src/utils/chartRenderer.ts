// Canvas-based chart rendering for table cells

export interface ChartOptions {
  color?: string;
  fillColor?: string;
  showArea?: boolean;
  showLine?: boolean;
  showPoints?: boolean;
  barColor?: string;
  barSpacing?: number;
  min?: number; // Custom minimum for scaling (matches HeaderObject chartOptions)
  max?: number; // Custom maximum for scaling (matches HeaderObject chartOptions)
}

// Render a line/area chart on a canvas
export const renderLineAreaChart = (
  canvas: HTMLCanvasElement,
  data: number[],
  options?: ChartOptions
): void => {
  if (!data || data.length === 0) return;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const padding = 4;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Find min and max values (use custom min/max from options if provided)
  const minValue = options?.min !== undefined ? options.min : Math.min(...data);
  const maxValue = options?.max !== undefined ? options.max : Math.max(...data);
  const valueRange = maxValue - minValue || 1; // Avoid division by zero
  
  // Calculate points
  const points: { x: number; y: number }[] = data.map((value, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * plotWidth;
    const normalizedValue = (value - minValue) / valueRange;
    const y = padding + plotHeight - normalizedValue * plotHeight;
    return { x, y };
  });
  
  // Draw area fill if enabled
  if (options?.showArea !== false) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);
    
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    
    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    const fillColor = options?.fillColor || options?.color || "#3b82f6";
    gradient.addColorStop(0, fillColor + "80"); // 50% opacity
    gradient.addColorStop(1, fillColor + "00"); // 0% opacity
    
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  // Draw line if enabled
  if (options?.showLine !== false) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    
    ctx.strokeStyle = options?.color || "#3b82f6";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }
  
  // Draw points if enabled
  if (options?.showPoints) {
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = options?.color || "#3b82f6";
      ctx.fill();
    });
  }
};

// Render a bar chart on a canvas
export const renderBarChart = (
  canvas: HTMLCanvasElement,
  data: number[],
  options?: ChartOptions
): void => {
  if (!data || data.length === 0) return;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  const padding = 4;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Find min and max values (use custom min/max from options if provided)
  const minValue = options?.min !== undefined ? options.min : Math.min(0, ...data);
  const maxValue = options?.max !== undefined ? options.max : Math.max(...data);
  const valueRange = maxValue - minValue || 1;
  
  // Calculate bar properties
  const barSpacing = options?.barSpacing ?? 2;
  const totalSpacing = barSpacing * (data.length - 1);
  const barWidth = (plotWidth - totalSpacing) / data.length;
  
  // Draw bars
  data.forEach((value, index) => {
    const x = padding + index * (barWidth + barSpacing);
    const normalizedValue = (value - minValue) / valueRange;
    const barHeight = normalizedValue * plotHeight;
    const y = padding + plotHeight - barHeight;
    
    ctx.fillStyle = options?.barColor || options?.color || "#3b82f6";
    ctx.fillRect(x, y, barWidth, barHeight);
  });
};
