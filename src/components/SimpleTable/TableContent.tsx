import { RefObject, useMemo, useRef } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

// Common properties to omit from both TableHeaderProps and TableBodyProps
type OmittedTableProps =
  | "centerHeaderRef"
  | "headerContainerRef"
  | "mainTemplateColumns"
  | "pinnedLeftColumns"
  | "pinnedLeftHeaderRef"
  | "pinnedLeftTemplateColumns"
  | "pinnedRightColumns"
  | "pinnedRightHeaderRef"
  | "pinnedRightTemplateColumns"
  | "shouldDisplayLastColumnCell";

interface TableContentProps extends Omit<TableHeaderProps, OmittedTableProps>, Omit<TableBodyProps, OmittedTableProps> {
  editColumns: boolean;
  pinnedLeftRef: RefObject<HTMLDivElement | null>;
  pinnedRightRef: RefObject<HTMLDivElement | null>;
}

const TableContent = ({
  allowAnimations,
  columnResizing,
  currentRows,
  draggable,
  draggedHeaderRef,
  editColumns,
  forceUpdate,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headersRef,
  hiddenColumns,
  hoveredHeaderRef,
  isSelected,
  isTopLeftCell,
  isWidthDragging,
  mainBodyRef,
  onCellChange,
  onSort,
  onTableHeaderDragEnd,
  pinnedLeftRef,
  pinnedRightRef,
  scrollbarHorizontalRef,
  scrollbarWidth,
  selectableColumns,
  setIsWidthDragging,
  setSelectedCells,
  shouldPaginate,
  sort,
  sortDownIcon,
  sortUpIcon,
  tableBodyContainerRef,
}: TableContentProps) => {
  // Refs
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const pinnedLeftHeaderRef = useRef<HTMLDivElement>(null);
  const centerHeaderRef = useRef<HTMLDivElement>(null);
  const pinnedRightHeaderRef = useRef<HTMLDivElement>(null);

  // Derived state
  const currentHeaders = headersRef.current.filter((header) => !header.hide && !header.pinned);
  const shouldDisplayLastColumnCell = useMemo(() => {
    if (!mainBodyRef.current) return false;
    const totalColumnWidth = currentHeaders.reduce((acc, header) => acc + header.width, 0);
    return totalColumnWidth < mainBodyRef.current.clientWidth;
  }, [currentHeaders, mainBodyRef]);

  const pinnedLeftColumns = headersRef.current.filter((header) => header.pinned === "left" && header.hide !== true);
  const pinnedRightColumns = headersRef.current.filter((header) => header.pinned === "right" && header.hide !== true);

  const pinnedLeftTemplateColumns = useMemo(() => {
    return `${pinnedLeftColumns.map((header) => `${header.width}px`).join(" ")}`;
  }, [pinnedLeftColumns]);
  const mainTemplateColumns = useMemo(() => {
    return `${currentHeaders
      .filter((header) => hiddenColumns[header.accessor] !== true)
      .map((header) => `${header.width}px`)
      .join(" ")} 1fr`;
  }, [currentHeaders, hiddenColumns]);
  const pinnedRightTemplateColumns = useMemo(() => {
    return `${pinnedRightColumns.map((header) => `${header.width}px`).join(" ")}`;
  }, [pinnedRightColumns]);

  const tableHeaderProps: TableHeaderProps = {
    allowAnimations,
    centerHeaderRef,
    columnResizing,
    currentRows,
    draggable,
    draggedHeaderRef,
    forceUpdate,
    headerContainerRef,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    isWidthDragging,
    mainBodyRef,
    mainTemplateColumns,
    onSort,
    onTableHeaderDragEnd,
    pinnedLeftColumns,
    pinnedLeftHeaderRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightHeaderRef,
    pinnedRightTemplateColumns,
    selectableColumns,
    setIsWidthDragging,
    setSelectedCells,
    shouldDisplayLastColumnCell,
    sort,
    sortDownIcon,
    sortUpIcon,
    tableBodyContainerRef,
  };

  const tableBodyProps: TableBodyProps = {
    allowAnimations,
    centerHeaderRef,
    currentRows,
    draggedHeaderRef,
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    headerContainerRef,
    headers: headersRef.current,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    isSelected,
    isTopLeftCell,
    isWidthDragging,
    mainBodyRef,
    mainTemplateColumns,
    onCellChange,
    onTableHeaderDragEnd,
    pinnedLeftColumns,
    pinnedLeftHeaderRef,
    pinnedLeftRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightHeaderRef,
    pinnedRightRef,
    pinnedRightTemplateColumns,
    scrollbarHorizontalRef,
    scrollbarWidth,
    shouldDisplayLastColumnCell,
    shouldPaginate,
    tableBodyContainerRef,
  };

  return (
    <div className="st-table-content" style={{ width: editColumns ? "calc(100% - 27.5px)" : "100%" }}>
      <TableHeader {...tableHeaderProps} />
      <TableBody {...tableBodyProps} />
    </div>
  );
};

export default TableContent;
