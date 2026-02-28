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
  pinnedLeftWidth,
  pinnedRightColumns,
  pinnedRightTemplateColumns,
  pinnedRightWidth,
  sort,
}: TableHeaderProps) => {
  const {
    headerContainerRef,
    pinnedLeftRef,
    pinnedRightRef,
    collapsedHeaders,
    tableRows,
    maxHeaderDepth,
  } = useTableContext();

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
      aria-rowcount={tableRows.length + maxHeaderDepth}
      aria-colcount={totalColumns}
    >
      {canDisplaySection(headers, "left") && (
        <TableHeaderSection
          calculatedHeaderHeight={calculatedHeaderHeight}
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
        calculatedHeaderHeight={calculatedHeaderHeight}
        columnIndices={columnIndices}
        gridTemplateColumns={mainTemplateColumns}
        handleScroll={undefined}
        headers={headers}
        maxDepth={maxHeaderDepth}
        sectionRef={centerHeaderRef}
        sort={sort}
        leftOffset={canDisplaySection(headers, "left") ? pinnedLeftWidth : 0}
      />

      {canDisplaySection(headers, "right") && (
        <TableHeaderSection
          calculatedHeaderHeight={calculatedHeaderHeight}
          columnIndices={columnIndices}
          gridTemplateColumns={pinnedRightTemplateColumns}
          handleScroll={undefined}
          headers={headers}
          maxDepth={maxHeaderDepth}
          pinned="right"
          sectionRef={pinnedRightRef}
          sort={sort}
          width={pinnedRightWidth}
          leftOffset={canDisplaySection(headers, "left") ? pinnedLeftWidth : 0}
        />
      )}
    </div>
  );
};

export default TableHeader;
