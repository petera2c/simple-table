import { useMemo, useRef } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import { useTableContext } from "../../context/TableContext";
import SortColumn from "../../types/SortColumn";
import { createGridTemplateColumns } from "../../utils/columnUtils";
import TableBodyProps from "../../types/TableBodyProps";
import TableRow from "../../types/TableRow";

// Define props for the frequently changing values not in context
interface TableContentLocalProps {
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  setScrollTop: (scrollTop: number) => void;
  setScrollDirection: (direction: "up" | "down" | "none") => void;
  shouldShowEmptyState: boolean;
  sort: SortColumn | null;
  tableRows: TableRow[];
  rowsToRender: TableRow[];
}

const TableContent = ({
  pinnedLeftWidth,
  pinnedRightWidth,
  setScrollTop,
  setScrollDirection,
  shouldShowEmptyState,
  sort,
  tableRows,
  rowsToRender,
}: TableContentLocalProps) => {
  // Get stable props from context
  const { columnResizing, editColumns, headers, collapsedHeaders } = useTableContext();

  // Refs
  const centerHeaderRef = useRef<HTMLDivElement>(null);

  // Derived state
  const currentHeaders = headers.filter((header) => !header.pinned);

  const pinnedLeftColumns = headers.filter((header) => header.pinned === "left");
  const pinnedRightColumns = headers.filter((header) => header.pinned === "right");

  const pinnedLeftTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({ headers: pinnedLeftColumns, collapsedHeaders });
  }, [pinnedLeftColumns, collapsedHeaders]);
  const mainTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({ headers: currentHeaders, collapsedHeaders });
  }, [currentHeaders, collapsedHeaders]);
  const pinnedRightTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({ headers: pinnedRightColumns, collapsedHeaders });
  }, [pinnedRightColumns, collapsedHeaders]);

  const tableHeaderProps: TableHeaderProps = {
    centerHeaderRef,
    headers,
    mainTemplateColumns,
    pinnedLeftColumns,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightTemplateColumns,
    sort,
    pinnedLeftWidth,
    pinnedRightWidth,
  };

  const tableBodyProps: TableBodyProps = {
    tableRows,
    mainTemplateColumns,
    pinnedLeftColumns,
    pinnedLeftTemplateColumns,
    pinnedLeftWidth,
    pinnedRightColumns,
    pinnedRightTemplateColumns,
    pinnedRightWidth,
    setScrollTop,
    setScrollDirection,
    shouldShowEmptyState,
    rowsToRender,
  };

  return (
    <div
      className={`st-content ${columnResizing ? "st-resizeable" : "st-not-resizeable"}`}
      style={{ width: editColumns ? "calc(100% - 27.5px)" : "100%" }}
    >
      <TableHeader {...tableHeaderProps} />
      <TableBody {...tableBodyProps} />
    </div>
  );
};

export default TableContent;
