import Row from "./Row";
import RowState from "./RowState";
import HeaderObject, { Accessor } from "./HeaderObject";
type TableRow = {
    depth: number;
    displayPosition: number;
    groupingKey?: string;
    isLastGroupRow: boolean;
    position: number;
    row: Row;
    rowId: (string | number)[];
    /**
     * Position-independent identity for the row, used as the basis for the
     * cell DOM `id`, the animation coordinator's snapshot key, and **expand /
     * collapse / row-loading state maps** ({@link expandStateKey}).
     *
     * Sort/filter reorder leaves this unchanged while positional `rowId` changes,
     * so nested rows stay expanded after sort when this is supplied (via `getRowId`
     * or WeakMap-backed fallback identities).
     */
    stableRowKey?: string;
    rowPath?: (string | number)[];
    rowIndexPath?: number[];
    stateIndicator?: {
        parentRowId: string | number;
        parentRow: Row;
        state: RowState;
    };
    isLoadingSkeleton?: boolean;
    nestedTable?: {
        parentRow: Row;
        expandableHeader: HeaderObject;
        childAccessor: Accessor;
        calculatedHeight: number;
    };
    absoluteRowIndex: number;
    parentIndices?: number[];
};
export default TableRow;
