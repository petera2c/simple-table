import { useLayoutEffect, useMemo } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import { displayCell } from "../../utils/cellUtils";
import HeaderObject from "../../types/HeaderObject";
import TableHeaderSection from "./TableHeaderSection";
import { useTableContext } from "../../context/TableContext";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import { calculatePinnedWidth } from "../../utils/headerUtils";

const getHeaderDepth = (header: HeaderObject): number => {
  return header.children?.length ? 1 + Math.max(...header.children.map(getHeaderDepth)) : 1;
};

const TableHeader = ({
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
}: TableHeaderProps) => {
  const { pinnedLeftRef, pinnedRightRef, setPinnedLeftWidth, setPinnedRightWidth } =
    useTableContext();

  // Calculate column indices for all headers to ensure consistent colIndex values
  const columnIndices = useMemo(() => {
    return calculateColumnIndices({
      headersRef,
      hiddenColumns,
      pinnedLeftColumns,
      pinnedRightColumns,
    });
  }, [headersRef, hiddenColumns, pinnedLeftColumns, pinnedRightColumns]);

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

  useLayoutEffect(() => {
    setPinnedLeftWidth(calculatePinnedWidth(pinnedLeftRef.current?.clientWidth));
    setPinnedRightWidth(calculatePinnedWidth(pinnedRightRef.current?.clientWidth));
  }, [pinnedLeftRef, pinnedRightRef, setPinnedLeftWidth, setPinnedRightWidth]);

  return (
    <div className="st-header-container" ref={headerContainerRef}>
      {pinnedLeftColumns.length > 0 && (
        <TableHeaderSection
          columnIndices={columnIndices}
          gridTemplateColumns={pinnedLeftTemplateColumns}
          handleScroll={undefined}
          headersRef={headersRef}
          hiddenColumns={hiddenColumns}
          maxDepth={maxDepth}
          pinned="left"
          sectionRef={pinnedLeftRef}
          sort={sort}
        />
      )}

      <TableHeaderSection
        columnIndices={columnIndices}
        gridTemplateColumns={mainTemplateColumns}
        handleScroll={undefined}
        headersRef={headersRef}
        hiddenColumns={hiddenColumns}
        maxDepth={maxDepth}
        sectionRef={centerHeaderRef}
        sort={sort}
      />

      {pinnedRightColumns.length > 0 && (
        <TableHeaderSection
          columnIndices={columnIndices}
          gridTemplateColumns={pinnedRightTemplateColumns}
          handleScroll={undefined}
          headersRef={headersRef}
          hiddenColumns={hiddenColumns}
          maxDepth={maxDepth}
          pinned="right"
          sectionRef={pinnedRightRef}
          sort={sort}
        />
      )}
    </div>
  );
};

export default TableHeader;
