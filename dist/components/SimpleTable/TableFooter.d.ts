import { ReactNode } from "react";
interface TableFooterProps {
    currentPage: number;
    hideFooter?: boolean;
    nextIcon?: ReactNode;
    onPageChange: (page: number) => void;
    prevIcon?: ReactNode;
    rowsPerPage: number;
    totalRows: number;
}
declare const TableFooter: ({ currentPage, hideFooter, nextIcon, onPageChange, prevIcon, rowsPerPage, totalRows, }: TableFooterProps) => import("react/jsx-runtime").JSX.Element | null;
export default TableFooter;
