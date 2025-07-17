import { useMemo } from "react";
import TableHeaderProps from "../../types/TableHeaderProps";
import { displayCell } from "../../utils/cellUtils";
import HeaderObject from "../../types/HeaderObject";
import TableHeaderSection from "./TableHeaderSection";
import { useTableContext } from "../../context/TableContext";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import { canDisplaySection } from "../../utils/generalUtils";

const getHeaderDepth = (header: HeaderObject): number => {
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
  const { headerContainerRef, pinnedLeftRef, pinnedRightRef } = useTableContext();

  // Calculate column indices for all headers to ensure consistent colIndex values
  const columnIndices = useMemo(() => {
    return calculateColumnIndices({
      headers,
      pinnedLeftColumns,
      pinnedRightColumns,
    });
  }, [headers, pinnedLeftColumns, pinnedRightColumns]);

  const { maxDepth } = useMemo(() => {
    let maxDepth = 0;
    headers.forEach((header) => {
      if (displayCell({ header })) {
        const depth = getHeaderDepth(header);
        maxDepth = Math.max(maxDepth, depth);
      }
    });
    return { maxDepth };
  }, [headers]);

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
