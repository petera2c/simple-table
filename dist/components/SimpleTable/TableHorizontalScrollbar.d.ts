import { RefObject } from "react";
import HeaderObject from "../../types/HeaderObject";
declare const TableHorizontalScrollbar: ({ headersRef, mainBodyRef, pinnedLeftRef, pinnedRightRef, scrollbarHorizontalRef, tableContentWidth, }: {
    headersRef: RefObject<HeaderObject[]>;
    mainBodyRef: RefObject<HTMLDivElement | null>;
    pinnedLeftRef: RefObject<HTMLDivElement | null>;
    pinnedRightRef: RefObject<HTMLDivElement | null>;
    scrollbarHorizontalRef: RefObject<HTMLDivElement | null>;
    tableContentWidth: number;
}) => import("react/jsx-runtime").JSX.Element | null;
export default TableHorizontalScrollbar;
