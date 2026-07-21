export interface ContentHeightConfig {
    height?: string | number;
    maxHeight?: string | number;
    rowHeight: number;
    shouldPaginate?: boolean;
    rowsPerPage?: number;
    totalRowCount: number;
    headerHeight?: number;
    footerHeight?: number;
    /**
     * Visible portion of the table inside an external scroll parent (in pixels).
     * Only consulted when neither `height` nor `maxHeight` is set; enables
     * virtualization driven by a window- or element-level scroller.
     */
    externalViewportHeight?: number;
}
/**
 * Converts a height value (string or number) to pixels
 */
export declare const convertHeightToPixels: (heightValue: string | number, container?: Element | null) => number;
/**
 * Calculates the content height for the table.
 * This is a pure function alternative to the useContentHeight hook.
 *
 * @param config - Configuration for content height calculation
 * @returns The calculated content height in pixels, or undefined to disable virtualization
 */
export declare const calculateContentHeight: ({ height, maxHeight, rowHeight, shouldPaginate, rowsPerPage, totalRowCount, headerHeight, footerHeight, externalViewportHeight, }: ContentHeightConfig) => number | undefined;
export default calculateContentHeight;
