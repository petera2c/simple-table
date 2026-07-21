import type TableRowType from "../types/TableRow";
import { HeightOffsets } from "./infiniteScrollUtils";
import { CustomTheme } from "../types/CustomTheme";
import { LoadingStateRenderer, ErrorStateRenderer, EmptyStateRenderer } from "../types/RowStateRendererProps";
export interface StateRowRenderContext {
    index: number;
    rowHeight: number;
    heightOffsets: HeightOffsets | undefined;
    customTheme: CustomTheme;
    loadingStateRenderer?: LoadingStateRenderer;
    errorStateRenderer?: ErrorStateRenderer;
    emptyStateRenderer?: EmptyStateRenderer;
}
export declare const createStateRow: (tableRow: TableRowType, context: StateRowRenderContext) => HTMLElement;
export declare const cleanupStateRow: (rowElement: HTMLElement) => void;
