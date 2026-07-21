import HeaderObject from "../../types/HeaderObject";
import CellValue from "../../types/CellValue";
import { AbsoluteBodyCell, CellRenderContext } from "./types";
export declare const formatCellContent: (content: CellValue, header: HeaderObject, colIndex: number, row: any, rowIndex: number) => string | null;
export declare const createCellContent: (cell: AbsoluteBodyCell, context: CellRenderContext, contentSpan: HTMLElement) => void;
