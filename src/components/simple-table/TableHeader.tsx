import { useMemo } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import TableHeaderSection from "./TableHeaderSection";
import { useTableContext } from "../../context/TableContext";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import { canDisplaySection } from "../../utils/generalUtils";

const TableHeader = ({
  calculatedHeaderHeight,
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
}: TableHeaderProps) => {
  const {
    headerContainerRef,
    pinnedLeftRef,
    pinnedRightRef,
    collapsedHeaders,
    tableRows,
    maxHeaderDepth,
  } = useTableContext();

  // When no section (left, main, or right) has visible columns, apply minHeight so the header doesn't collapse.
  const hasAnyVisibleSection = useMemo(
    () =>
      canDisplaySection(headers, "left") ||
      canDisplaySection(headers, undefined) ||
      canDisplaySection(headers, "right"),
    [headers],
  );
  const headerContainerStyle = useMemo(
    () => (!hasAnyVisibleSection ? { minHeight: calculatedHeaderHeight } : undefined),
    [hasAnyVisibleSection, calculatedHeaderHeight],
  );

  // Calculate column indices for all headers to ensure consistent colIndex values
  const columnIndices = useMemo(() => {
    return calculateColumnIndices({
      headers,
      pinnedLeftColumns,
      pinnedRightColumns,
      collapsedHeaders,
    });
  }, [headers, pinnedLeftColumns, pinnedRightColumns, collapsedHeaders]);

  // Count total leaf columns (visible columns)
  const totalColumns = useMemo(() => {
    return Object.keys(columnIndices).length;
  }, [columnIndices]);

  return (
    <div
      className="st-header-container"
      ref={headerContainerRef}
      style={headerContainerStyle}
      aria-rowcount={tableRows.length + maxHeaderDepth}
      aria-colcount={totalColumns}
    >
      {canDisplaySection(headers, "left") && (
        <TableHeaderSection
          columnIndices={columnIndices}
          gridTemplateColumns={pinnedLeftTemplateColumns}
          handleScroll={undefined}
          headers={headers}
          maxDepth={maxHeaderDepth}
          pinned="left"
          sectionRef={pinnedLeftRef}
          sort={sort}
          width={pinnedLeftWidth}
        />
      )}

      <TableHeaderSection
        columnIndices={columnIndices}
        gridTemplateColumns={mainTemplateColumns}
        handleScroll={undefined}
        headers={headers}
        maxDepth={maxHeaderDepth}
        sectionRef={centerHeaderRef}
        sort={sort}
      />

      {canDisplaySection(headers, "right") && (
        <TableHeaderSection
          columnIndices={columnIndices}
          gridTemplateColumns={pinnedRightTemplateColumns}
          handleScroll={undefined}
          headers={headers}
          maxDepth={maxHeaderDepth}
          pinned="right"
          sectionRef={pinnedRightRef}
          sort={sort}
          width={pinnedRightWidth}
        />
      )}
    </div>
  );
};

export default TableHeader;
