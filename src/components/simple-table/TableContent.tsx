import { useMemo, useRef, Dispatch, SetStateAction } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import { useTableContext } from "../../context/TableContext";
import Row from "../../types/Row";
import SortConfig from "../../types/SortConfig";
import VisibleRow from "../../types/VisibleRow";
import { createGridTemplateColumns } from "../../utils/columnUtils";
import TableBodyProps from "../../types/TableBodyProps";

// Define props for the frequently changing values not in context
interface TableContentLocalProps {
  flattenedRowsData: Array<{ row: Row; depth: number; groupingKey?: string }>;
  isWidthDragging: boolean;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  setFlattenedRows: Dispatch<SetStateAction<Row[]>>;
  setScrollTop: Dispatch<SetStateAction<number>>;
  sort: SortConfig | null;
  visibleRows: VisibleRow[];
}

const TableContent = ({
  flattenedRowsData,
  isWidthDragging,
  pinnedLeftWidth,
  pinnedRightWidth,
  setFlattenedRows,
  setScrollTop,
  sort,
  visibleRows,
}: TableContentLocalProps) => {
  // Get stable props from context
  const { columnResizing, editColumns, headersRef, hiddenColumns } = useTableContext();

  // Refs
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const centerHeaderRef = useRef<HTMLDivElement>(null);

  // Derived state
  const currentHeaders = headersRef.current.filter((header) => !header.pinned);

  const pinnedLeftColumns = headersRef.current.filter((header) => header.pinned === "left");
  const pinnedRightColumns = headersRef.current.filter((header) => header.pinned === "right");

  const pinnedLeftTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({ headers: pinnedLeftColumns, hiddenColumns });
  }, [pinnedLeftColumns, hiddenColumns]);
  const mainTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({ headers: currentHeaders, hiddenColumns });
  }, [currentHeaders, hiddenColumns]);
  const pinnedRightTemplateColumns = useMemo(() => {
    return createGridTemplateColumns({ headers: pinnedRightColumns, hiddenColumns });
  }, [pinnedRightColumns, hiddenColumns]);

  const tableHeaderProps: TableHeaderProps = {
    centerHeaderRef,
    headerContainerRef,
    headersRef,
    hiddenColumns,
    mainTemplateColumns,
    pinnedLeftColumns,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightTemplateColumns,
    sort,
  };

  const tableBodyProps: TableBodyProps = {
    flattenedRowsData,
    headerContainerRef,
    isWidthDragging,
    mainTemplateColumns,
    pinnedLeftColumns,
    pinnedLeftTemplateColumns,
    pinnedLeftWidth,
    pinnedRightColumns,
    pinnedRightTemplateColumns,
    pinnedRightWidth,
    setFlattenedRows,
    setScrollTop,
    visibleRows,
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
