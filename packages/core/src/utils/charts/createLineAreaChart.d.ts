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
/**
 * Renders a sparkline line/area chart in pixel space: the viewBox always
 * matches the actual rendered size (tracked via ResizeObserver), so the stroke
 * keeps a uniform width instead of being smeared by non-uniform scaling. The
 * line is inset by half the stroke width so peaks and valleys aren't clipped,
 * and the area is filled with a vertical gradient that fades toward the
 * baseline.
 */
export declare const createLineAreaChart: (options: LineAreaChartProps) => {
    element: SVGSVGElement;
    update: (newOptions: Partial<LineAreaChartProps>) => void;
    destroy: () => void;
} | null;
