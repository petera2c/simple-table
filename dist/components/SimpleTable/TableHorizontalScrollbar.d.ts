import { RefObject } from "react";
import HeaderObject from "../../types/HeaderObject";
declare const TableHorizontalScrollbar: ({ headersRef, pinnedLeftRef, pinnedRightRef, tableRef, }: {
    headersRef: RefObject<HeaderObject[]>;
    pinnedLeftRef: RefObject<HTMLDivElement | null>;
    pinnedRightRef: RefObject<HTMLDivElement | null>;
    tableRef: RefObject<HTMLDivElement | null>;
}) => import("react/jsx-runtime").JSX.Element | null;
export default TableHorizontalScrollbar;
