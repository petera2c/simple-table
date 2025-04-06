import { UIEvent, useMemo } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import { displayCell } from "../../utils/cellUtils";
import useScrollSync from "../../hooks/useScrollSync";
import HeaderObject from "../../types/HeaderObject";
import TableHeaderSection from "./TableHeaderSection";
import TableHeaderSectionProps from "../../types/TableHeaderSectionProps";

const getHeaderDepth = (header: HeaderObject): number => {
  return header.children?.length ? 1 + Math.max(...header.children.map(getHeaderDepth)) : 1;
};

const TableHeader = ({
  allowAnimations,
  centerHeaderRef,
  columnResizing,
  currentRows,
  columnReordering,
  draggedHeaderRef,
  forceUpdate,
  headerContainerRef,
  headersRef,
  hiddenColumns,
  hoveredHeaderRef,
  isWidthDragging,
  mainBodyRef,
  mainTemplateColumns,
  onColumnOrderChange,
  onSort,
  onTableHeaderDragEnd,
  pinnedLeftColumns,
  pinnedLeftHeaderRef,
  pinnedLeftTemplateColumns,
  pinnedRightColumns,
  pinnedRightHeaderRef,
  pinnedRightTemplateColumns,
  rowHeight,
  selectableColumns,
  setIsWidthDragging,
  setSelectedCells,
  sort,
  sortDownIcon,
  sortUpIcon,
}: TableHeaderProps) => {
  // Keep up to date the scroll position of the visible scroll
  useScrollSync(mainBodyRef, centerHeaderRef);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const scrollLeft = centerHeaderRef.current?.scrollLeft;
    if (scrollLeft !== undefined) {
      mainBodyRef.current?.scrollTo(scrollLeft, 0);
    }
  };

  const { maxDepth } = useMemo(() => {
    const headers = headersRef.current;
    let maxDepth = 0;
    headers.forEach((header) => {
      if (displayCell({ hiddenColumns, header })) {
        const depth = getHeaderDepth(header);
        maxDepth = Math.max(maxDepth, depth);
      }
    });
    return { maxDepth };
  }, [headersRef, hiddenColumns]);

  const tableHeaderSectionProps: Omit<
    TableHeaderSectionProps,
    "pinned" | "sectionRef" | "gridTemplateColumns"
  > = {
    allowAnimations,
    columnReordering,
    columnResizing,
    currentRows,
    draggedHeaderRef,
    forceUpdate,
    handleScroll,
    headersRef,
    hiddenColumns,
    hoveredHeaderRef,
    isWidthDragging,
    mainBodyRef,
    maxDepth,
    onColumnOrderChange,
    onSort,
    onTableHeaderDragEnd,
    rowHeight,
    selectableColumns,
    setIsWidthDragging,
    setSelectedCells,
    sort,
    sortDownIcon,
    sortUpIcon,
  };

  return (
    <div className="st-header-container" ref={headerContainerRef}>
      {pinnedLeftColumns.length > 0 && (
        <TableHeaderSection
          {...tableHeaderSectionProps}
          gridTemplateColumns={pinnedLeftTemplateColumns}
          pinned="left"
          sectionRef={pinnedLeftHeaderRef}
        />
      )}

      <TableHeaderSection
        {...tableHeaderSectionProps}
        gridTemplateColumns={mainTemplateColumns}
        handleScroll={handleScroll}
        sectionRef={centerHeaderRef}
      />
      {pinnedRightColumns.length > 0 && (
        <TableHeaderSection
          {...tableHeaderSectionProps}
          gridTemplateColumns={pinnedRightTemplateColumns}
          pinned="right"
          sectionRef={pinnedRightHeaderRef}
        />
      )}
    </div>
  );
};

export default TableHeader;
