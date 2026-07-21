import type Cell from "../../types/Cell";
import type TableRowType from "../../types/TableRow";
/**
 * Compute the set of cell IDs for a selection range.
 * Resolves rowId to current row index (for virtualized/sorted tables) then fills the rectangle.
 */
export declare function computeSelectionRange(startCell: Cell, endCell: Cell, tableRows: TableRowType[], enableRowSelection: boolean): Set<string>;
