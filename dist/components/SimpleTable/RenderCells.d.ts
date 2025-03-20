import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";
import TableBodyProps from "../../types/TableBodyProps";
declare const RenderCells: ({ getBorderClass, handleMouseDown, handleMouseOver, headers, hiddenColumns, isRowExpanded, isSelected, isTopLeftCell, lastGroupRow, onExpandRowClick, pinned, row, rowIndex, shouldDisplayLastColumnCell, ...props }: {
    depth: number;
    headers: HeaderObject[];
    hiddenColumns: Record<string, boolean>;
    isRowExpanded: (rowId: string | number) => boolean;
    lastGroupRow?: boolean | undefined;
    onExpandRowClick: (rowIndex: number) => void;
    pinned?: "left" | "right" | undefined;
    row: Row;
    rowIndex: number;
    shouldDisplayLastColumnCell: boolean;
} & Omit<TableBodyProps, "currentRows">) => import("react/jsx-runtime").JSX.Element;
export default RenderCells;
