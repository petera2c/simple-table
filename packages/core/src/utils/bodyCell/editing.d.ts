import CellValue from "../../types/CellValue";
import { AbsoluteBodyCell, CellRenderContext } from "./types";
export declare const createEditableInput: (cell: AbsoluteBodyCell, context: CellRenderContext, currentValue: CellValue, onComplete: () => void) => HTMLElement;
export declare const createEditor: (cell: AbsoluteBodyCell, context: CellRenderContext, onComplete: () => void) => HTMLElement | null;
