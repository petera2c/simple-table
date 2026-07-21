import { AbsoluteCell, HeaderRenderContext } from "./types";
export declare const calculateHeaderCellClasses: (cell: AbsoluteCell, context: HeaderRenderContext) => string;
export declare const createHeaderCellElement: (cell: AbsoluteCell, context: HeaderRenderContext) => HTMLElement;
export declare const getLastHeaderIndex: (absoluteCells: AbsoluteCell[]) => number;
/** Replace sort/filter/collapse icons on an existing header cell, preserving label/drag handlers. */
export declare const refreshHeaderCellIcons: (cellElement: HTMLElement, header: AbsoluteCell["header"], context: HeaderRenderContext, colIndex: number) => void;
export declare const updateHeaderCellElement: (cellElement: HTMLElement, cell: AbsoluteCell, context: HeaderRenderContext) => void;
