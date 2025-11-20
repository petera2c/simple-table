import { useMemo } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import { displayCell } from "../../utils/cellUtils";
import HeaderObject from "../../types/HeaderObject";
import TableHeaderSection from "./TableHeaderSection";
import { useTableContext } from "../../context/TableContext";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import { canDisplaySection } from "../../utils/generalUtils";

const getHeaderDepth = (header: HeaderObject): number => {
  // If singleRowChildren is true, don't add depth for immediate children
  if (header.singleRowChildren && header.children?.length) {
    return 1;
  }
  return header.children?.length ? 1 + Math.max(...header.children.map(getHeaderDepth)) : 1;
};

const TableHeader = ({
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
  const { headerContainerRef, pinnedLeftRef, pinnedRightRef, collapsedHeaders } = useTableContext();

  // Calculate column indices for all headers to ensure consistent colIndex values
  const columnIndices = useMemo(() => {
    return calculateColumnIndices({
      headers,
      pinnedLeftColumns,
      pinnedRightColumns,
      collapsedHeaders,
    });
  }, [headers, pinnedLeftColumns, pinnedRightColumns, collapsedHeaders]);

  const { maxDepth } = useMemo(() => {
    let maxDepth = 0;
    const allHeaders = [...pinnedLeftColumns, ...headers, ...pinnedRightColumns];
    headers.forEach((header) => {
      if (displayCell({ header, headers: allHeaders, collapsedHeaders })) {
        const depth = getHeaderDepth(header);
        maxDepth = Math.max(maxDepth, depth);
      }
    });
    return { maxDepth };
  }, [headers, pinnedLeftColumns, pinnedRightColumns, collapsedHeaders]);

  return (
    <div className="st-header-container" ref={headerContainerRef}>
      {canDisplaySection(headers, "left") && (
        <TableHeaderSection
          columnIndices={columnIndices}
          gridTemplateColumns={pinnedLeftTemplateColumns}
          handleScroll={undefined}
          headers={headers}
          maxDepth={maxDepth}
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
        maxDepth={maxDepth}
        sectionRef={centerHeaderRef}
        sort={sort}
      />

      {canDisplaySection(headers, "right") && (
        <TableHeaderSection
          columnIndices={columnIndices}
          gridTemplateColumns={pinnedRightTemplateColumns}
          handleScroll={undefined}
          headers={headers}
          maxDepth={maxDepth}
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
