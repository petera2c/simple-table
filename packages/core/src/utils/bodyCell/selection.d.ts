import { AbsoluteBodyCell, CellRenderContext } from "./types";
/**
 * Creates the row selection checkbox using the shared createCheckbox (same as popout and header).
 */
export declare const createSelectionCheckbox: (cell: AbsoluteBodyCell, context: CellRenderContext, isChecked: boolean) => HTMLElement;
export declare const createRowNumber: (displayRowNumber: number) => HTMLElement;
export declare const createRowButtons: (cell: AbsoluteBodyCell, context: CellRenderContext) => HTMLElement | null;
