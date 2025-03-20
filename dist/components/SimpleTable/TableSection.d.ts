import Row from "../../types/Row";
import { RefObject } from "react";
import TableBodyProps from "../../types/TableBodyProps";
declare const TableSection: ({ rows, templateColumns, pinned, sectionRef, isRowExpanded, onExpandRowClick, ...props }: {
    rows: Row[];
    templateColumns: string;
    pinned?: "left" | "right" | undefined;
    sectionRef?: RefObject<HTMLDivElement | null> | undefined;
    isRowExpanded: (rowId: string | number) => boolean;
    onExpandRowClick: (rowIndex: number) => void;
} & Omit<TableBodyProps, "currentRows">) => import("react/jsx-runtime").JSX.Element;
export default TableSection;
