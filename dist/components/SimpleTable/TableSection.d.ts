import Row from "../../types/Row";
import { RefObject } from "react";
import TableBodyProps from "../../types/TableBodyProps";
declare const TableSection: ({ headerContainerRef, isRowExpanded, onExpandRowClick, pinned, rows, sectionRef, templateColumns, ...props }: {
    headerContainerRef: RefObject<HTMLDivElement | null>;
    isRowExpanded: (rowId: string | number) => boolean;
    onExpandRowClick: (rowIndex: number) => void;
    pinned?: "left" | "right" | undefined;
    rows: Row[];
    sectionRef?: RefObject<HTMLDivElement | null> | undefined;
    templateColumns: string;
} & Omit<TableBodyProps, "currentRows">) => import("react/jsx-runtime").JSX.Element;
export default TableSection;
