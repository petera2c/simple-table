import Cell from "../types/Cell";
import HeaderObject from "../types/HeaderObject";
import type TableRowType from "../types/TableRow";
interface CellRegistryEntry {
    updateContent: (newValue: any) => void;
}
/**
 * Copies selected cells to clipboard in tab-separated format
 */
export declare const copySelectedCellsToClipboard: (selectedCells: Set<string>, leafHeaders: HeaderObject[], tableRows: TableRowType[], copyHeadersToClipboard?: boolean) => string;
/**
 * Pastes clipboard data into cells starting from the initial focused cell
 */
export declare const pasteClipboardDataToCells: (clipboardText: string, initialFocusedCell: Cell, leafHeaders: HeaderObject[], tableRows: TableRowType[], onCellEdit?: (props: any) => void, cellRegistry?: Map<string, CellRegistryEntry>) => {
    updatedCells: Set<string>;
    warningCells: Set<string>;
};
/**
 * Deletes content from selected cells (sets them to appropriate empty values)
 */
export declare const deleteSelectedCellsContent: (selectedCells: Set<string>, leafHeaders: HeaderObject[], tableRows: TableRowType[], onCellEdit?: (props: any) => void, cellRegistry?: Map<string, CellRegistryEntry>) => {
    deletedCells: Set<string>;
    warningCells: Set<string>;
};
export {};
