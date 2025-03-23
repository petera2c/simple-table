import Row from "../../types/Row";
import TableBodyProps from "../../types/TableBodyProps";
declare const TableRow: ({ depth, getNextRowIndex, index, lastGroupRow, pinned, props, row, }: {
    depth?: number | undefined;
    getNextRowIndex: () => number;
    index: number;
    lastGroupRow?: boolean | undefined;
    pinned?: "left" | "right" | undefined;
    props: Omit<TableBodyProps, "currentRows" | "headerContainerRef"> & {
        onExpandRowClick: (rowIndex: number) => void;
    };
    row: Row;
}) => import("react/jsx-runtime").JSX.Element;
export default TableRow;
