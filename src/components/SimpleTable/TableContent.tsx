import { useMemo, useRef, Dispatch, SetStateAction } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import { createGridTemplateColumns } from "../../utils/columnUtils";
import { useTableContext } from "../../context/TableContext";
import Row from "../../types/Row";
import SortConfig from "../../types/SortConfig";
import VisibleRow from "../../types/VisibleRow";

// Define props for the frequently changing values not in context
interface TableContentLocalProps {
  flattenedRows: Row[];
  isWidthDragging: boolean;
  setFlattenedRows: Dispatch<SetStateAction<Row[]>>;
  setScrollTop: Dispatch<SetStateAction<number>>;
  sort: SortConfig | null;
  visibleRows: VisibleRow[];
}

const TableContent = ({
  flattenedRows,
  isWidthDragging,
  setFlattenedRows,
  setScrollTop,
  sort,
  visibleRows,
}: TableContentLocalProps) => {
  // Get stable props from context
  const { editColumns, headersRef, hiddenColumns } = useTableContext();

  // Refs
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const pinnedLeftHeaderRef = useRef<HTMLDivElement>(null);
  const centerHeaderRef = useRef<HTMLDivElement>(null);
  const pinnedRightHeaderRef = useRef<HTMLDivElement>(null);

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
    pinnedLeftHeaderRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightHeaderRef,
    pinnedRightTemplateColumns,
    sort,
  };

  const tableBodyProps = {
    centerHeaderRef,
    flattenedRows,
    headerContainerRef,
    isWidthDragging,
    mainTemplateColumns,
    pinnedLeftColumns,
    pinnedLeftHeaderRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightHeaderRef,
    pinnedRightTemplateColumns,
    setFlattenedRows,
    setScrollTop,
    visibleRows,
  };

  return (
    <div
      className="st-table-content"
      style={{ width: editColumns ? "calc(100% - 27.5px)" : "100%" }}
    >
      <TableHeader {...tableHeaderProps} />
      <TableBody {...tableBodyProps} />
    </div>
  );
};

export default TableContent;
