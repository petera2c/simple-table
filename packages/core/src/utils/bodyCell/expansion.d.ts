import { AbsoluteBodyCell, CellRenderContext } from "./types";
export declare const createExpandIcon: (cell: AbsoluteBodyCell, context: CellRenderContext, isExpanded: boolean) => HTMLElement;
export type UpdateExpandIconStateOptions = {
    /** aria-label when the group is expanded (chevron shows collapse action). */
    ariaLabelWhenExpanded?: string;
    /** aria-label when the group is collapsed (chevron shows expand action). */
    ariaLabelWhenCollapsed?: string;
    /** When true, sets aria-expanded to match isExpanded after the toggle. */
    syncAriaExpanded?: boolean;
};
/** Update expand/collapse icon direction on an existing cell (e.g. after expand state changes for nested grids). */
export declare const updateExpandIconState: (cellElement: HTMLElement, isExpanded: boolean, options?: UpdateExpandIconStateOptions) => void;
