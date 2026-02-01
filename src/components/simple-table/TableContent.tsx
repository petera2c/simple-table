import { useMemo, useRef } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import { useTableContext } from "../../context/TableContext";
import SortColumn from "../../types/SortColumn";
import { createGridTemplateColumns } from "../../utils/columnUtils";
import TableBodyProps from "../../types/TableBodyProps";
import TableRow from "../../types/TableRow";
import { CumulativeHeightMap } from "../../utils/infiniteScrollUtils";

// Define props for the frequently changing values not in context
interface TableContentLocalProps {
  calculatedHeaderHeight: number;
  hideHeader: boolean;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  setScrollTop: (scrollTop: number) => void;
  setScrollDirection: (direction: "up" | "down" | "none") => void;
  shouldShowEmptyState: boolean;
  sort: SortColumn | null;
  tableRows: TableRow[];
  rowsToRender: TableRow[];
  stickyParents: TableRow[];
  regularRows: TableRow[];
  partiallyVisibleRows: TableRow[];
  heightMap?: CumulativeHeightMap;
}

const TableContent = ({
  calculatedHeaderHeight,
  hideHeader,
  pinnedLeftWidth,
  pinnedRightWidth,
  setScrollTop,
  setScrollDirection,
  shouldShowEmptyState,
  sort,
  tableRows,
  rowsToRender,
  stickyParents,
  regularRows,
  partiallyVisibleRows,
  heightMap,
}: TableContentLocalProps) => {
  // Get stable props from context
  const { columnResizing, editColumns, headers, collapsedHeaders, autoExpandColumns } =
    useTableContext();

  // Refs
  const centerHeaderRef = useRef<HTMLDivElement>(null);

  // Derived state
  const currentHeaders = headers.filter((header) => !header.pinned);

  const pinnedLeftColumns = headers.filter((header) => header.pinned === "left");
  const pinnedRightColumns = headers.filter((header) => header.pinned === "right");

  const pinnedLeftTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({
      headers: pinnedLeftColumns,
      collapsedHeaders,
      autoExpandColumns,
    });
  }, [pinnedLeftColumns, collapsedHeaders, autoExpandColumns]);
  const mainTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({
      headers: currentHeaders,
      collapsedHeaders,
      autoExpandColumns,
    });
  }, [currentHeaders, collapsedHeaders, autoExpandColumns]);
  const pinnedRightTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({
      headers: pinnedRightColumns,
      collapsedHeaders,
      autoExpandColumns,
    });
  }, [pinnedRightColumns, collapsedHeaders, autoExpandColumns]);

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
    calculatedHeaderHeight,
    mainTemplateColumns,
    pinnedLeftColumns,
    pinnedLeftTemplateColumns,
    pinnedLeftWidth,
    pinnedRightColumns,
    pinnedRightTemplateColumns,
    pinnedRightWidth,
    rowsToRender,
    stickyParents,
    regularRows,
    partiallyVisibleRows,
    heightMap,
    setScrollDirection,
    setScrollTop,
    shouldShowEmptyState,
    tableRows,
  };

  return (
    <div
      className={`st-content ${columnResizing ? "st-resizeable" : "st-not-resizeable"}`}
      style={{ width: editColumns ? "calc(100% - 27.5px)" : "100%" }}
    >
      {!hideHeader && <TableHeader {...tableHeaderProps} />}
      <TableBody {...tableBodyProps} />
    </div>
  );
};

export default TableContent;
