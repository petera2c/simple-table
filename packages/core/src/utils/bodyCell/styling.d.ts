import { AbsoluteBodyCell, CellRegistryEntry, CellRenderContext } from "./types";
import { CellLiveRef, cellLiveRefMap } from "./cellLiveRef";
export { cellLiveRefMap };
export type { CellLiveRef };
/** Drop the content memo so the next `updateBodyCellElement` rebuilds. */
export declare const invalidateBodyCellContentMemo: (cellElement: HTMLElement) => void;
export declare const untrackCellByRow: (rowId: string, cellElement: HTMLElement) => void;
export declare const unregisterCellFromRegistry: (cellElement: HTMLElement, cellRegistry?: Map<string, CellRegistryEntry>) => void;
export declare const createBodyCellElement: (cell: AbsoluteBodyCell, context: CellRenderContext) => HTMLElement;
export declare const updateBodyCellPosition: (cellElement: HTMLElement, cell: AbsoluteBodyCell) => void;
export declare const updateBodyCellElement: (cellElement: HTMLElement, cell: AbsoluteBodyCell, context: CellRenderContext) => void;
