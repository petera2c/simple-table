import { UIEvent, useMemo } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import { displayCell } from "../../utils/cellUtils";
import useScrollSync from "../../hooks/useScrollSync";
import HeaderObject from "../../types/HeaderObject";
import TableHeaderSection from "./TableHeaderSection";
import { useTableContext } from "../../context/TableContext";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";

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
  pinnedLeftHeaderRef,
  pinnedLeftTemplateColumns,
  pinnedRightColumns,
  pinnedRightHeaderRef,
  pinnedRightTemplateColumns,
  sort,
}: TableHeaderProps) => {
  const { mainBodyRef } = useTableContext();
  // Keep up to date the scroll position of the visible scroll
  useScrollSync(mainBodyRef, centerHeaderRef);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const scrollLeft = centerHeaderRef.current?.scrollLeft;
    if (scrollLeft !== undefined) {
      mainBodyRef.current?.scrollTo(scrollLeft, 0);
    }
  };

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
          sectionRef={pinnedLeftHeaderRef}
          sort={sort}
        />
      )}

      <TableHeaderSection
        columnIndices={columnIndices}
        gridTemplateColumns={mainTemplateColumns}
        handleScroll={handleScroll}
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
          sectionRef={pinnedRightHeaderRef}
          sort={sort}
        />
      )}
    </div>
  );
};

export default TableHeader;
