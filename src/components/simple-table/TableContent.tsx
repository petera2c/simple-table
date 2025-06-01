import { useMemo, useRef, Dispatch, SetStateAction } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import { useTableContext } from "../../context/TableContext";
import SortConfig from "../../types/SortConfig";
import { createGridTemplateColumns } from "../../utils/columnUtils";
import TableBodyProps from "../../types/TableBodyProps";
import TableRow from "../../types/TableRow";

// Define props for the frequently changing values not in context
interface TableContentLocalProps {
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  setScrollTop: Dispatch<SetStateAction<number>>;
  sort: SortConfig | null;
  tableRows: TableRow[];
  visibleRows: TableRow[];
}

const TableContent = ({
  pinnedLeftWidth,
  pinnedRightWidth,
  setScrollTop,
  sort,
  tableRows,
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
    tableRows,
    headerContainerRef,
    mainTemplateColumns,
    pinnedLeftColumns,
    pinnedLeftTemplateColumns,
    pinnedLeftWidth,
    pinnedRightColumns,
    pinnedRightTemplateColumns,
    pinnedRightWidth,
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
