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
export declare const createBarChart: (options: BarChartProps) => {
    element: SVGSVGElement;
    update: (newOptions: Partial<BarChartProps>) => void;
    destroy: () => void;
} | null;
