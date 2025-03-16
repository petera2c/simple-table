import { RefObject, useMemo, useState } from "react";
import TableBodyProps from "../../types/TableBodyProps";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

// Common properties to omit from both TableHeaderProps and TableBodyProps
type OmittedTableProps =
  | "shouldDisplayLastColumnCell"
  | "pinnedLeftColumns"
  | "pinnedRightColumns"
  | "mainTemplateColumns"
  | "pinnedLeftTemplateColumns"
  | "pinnedRightTemplateColumns";

interface TableContentProps
  extends Omit<TableHeaderProps, OmittedTableProps>,
    Omit<TableBodyProps, OmittedTableProps> {
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
  onCellChange,
  onSort,
  onTableHeaderDragEnd,
  pinnedLeftRef,
  pinnedRightRef,
  selectableColumns,
  setIsWidthDragging,
  setSelectedCells,
  shouldPaginate,
  sort,
  sortDownIcon,
  sortUpIcon,
  tableRef,
}: TableContentProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const currentHeaders = headersRef.current.filter(
    (header) => !header.hide && !header.pinned
  );
  const shouldDisplayLastColumnCell = useMemo(() => {
    if (!tableRef.current) return false;
    const totalColumnWidth = currentHeaders.reduce(
      (acc, header) => acc + header.width,
      0
    );
    return totalColumnWidth < tableRef.current.clientWidth;
  }, [currentHeaders, tableRef]);

  const pinnedLeftColumns = headersRef.current.filter(
    (header) => header.pinned === "left" && header.hide !== true
  );
  const pinnedRightColumns = headersRef.current.filter(
    (header) => header.pinned === "right" && header.hide !== true
  );

  const pinnedLeftTemplateColumns = useMemo(() => {
    return `${pinnedLeftColumns
      .map((header) => `${header.width}px`)
      .join(" ")}`;
  }, [pinnedLeftColumns]);
  const mainTemplateColumns = useMemo(() => {
    return `${currentHeaders
      .filter((header) => hiddenColumns[header.accessor] !== true)
      .map((header) => `${header.width}px`)
      .join(" ")} 1fr`;
  }, [currentHeaders, hiddenColumns]);
  const pinnedRightTemplateColumns = useMemo(() => {
    return `${pinnedRightColumns
      .map((header) => `${header.width}px`)
      .join(" ")}`;
  }, [pinnedRightColumns]);

  const handleToggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const tableHeaderProps: TableHeaderProps = {
    allowAnimations,
    columnResizing,
    currentRows,
    draggable,
    draggedHeaderRef,
    forceUpdate,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    isWidthDragging,
    mainTemplateColumns,
    onSort,
    onTableHeaderDragEnd,
    pinnedLeftColumns,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightTemplateColumns,
    selectableColumns,
    setIsWidthDragging,
    setSelectedCells,
    shouldDisplayLastColumnCell,
    sort,
    sortDownIcon,
    sortUpIcon,
    tableRef,
  };

  const tableBodyProps: TableBodyProps = {
    allowAnimations,
    currentRows,
    draggedHeaderRef,
    getBorderClass,
    handleMouseDown,
    handleMouseOver,
    headers: headersRef.current,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    isSelected,
    isTopLeftCell,
    isWidthDragging,
    mainTemplateColumns,
    onCellChange,
    onTableHeaderDragEnd,
    onToggleGroup: handleToggleGroup,
    pinnedLeftColumns,
    pinnedLeftRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightRef,
    pinnedRightTemplateColumns,
    shouldDisplayLastColumnCell,
    shouldPaginate,
    tableRef,
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
