import Cell from "../types/Cell";
import TableRow from "../types/TableRow";
import { CustomTheme } from "../types/CustomTheme";
/**
 * Scrolls a cell into view, handling virtualization by calculating
 * approximate positions when cells are not yet rendered.
 * Uses viewport calculations to check if the cell is already fully visible
 * before performing any scroll operations.
 */
export declare const scrollCellIntoView: (cell: Cell, rowHeight: number, customTheme: CustomTheme, tableRows?: TableRow[]) => void;
