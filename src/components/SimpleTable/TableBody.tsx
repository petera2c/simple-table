import { useRef } from "react";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import TableBodyProps from "../../types/TableBodyProps";
import TableSection from "./TableSection";

const TableBody = (props: TableBodyProps) => {
  const tableBodyRef = useRef<HTMLDivElement | null>(null);
  const {
    currentRows,
    headerContainerRef,
    isRowExpanded,
    mainTemplateColumns,
    onExpandRowClick,
    pinnedLeftColumns,
    pinnedLeftRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightRef,
    pinnedRightTemplateColumns,
    tableRef,
  } = props;

  useScrollbarVisibility({ headerContainerRef, mainSectionRef: tableBodyRef });

  return (
    <div className="st-table-body-container" ref={tableBodyRef}>
      {pinnedLeftColumns.length > 0 && (
        <TableSection
          {...props}
          rows={currentRows}
          templateColumns={pinnedLeftTemplateColumns}
          pinned="left"
          sectionRef={pinnedLeftRef}
          isRowExpanded={isRowExpanded}
          onExpandRowClick={onExpandRowClick}
        />
      )}
      <TableSection
        {...props}
        rows={currentRows}
        templateColumns={mainTemplateColumns}
        sectionRef={tableRef}
        isRowExpanded={isRowExpanded}
        onExpandRowClick={onExpandRowClick}
      />
      {pinnedRightColumns.length > 0 && (
        <TableSection
          {...props}
          rows={currentRows}
          templateColumns={pinnedRightTemplateColumns}
          pinned="right"
          sectionRef={pinnedRightRef}
          isRowExpanded={isRowExpanded}
          onExpandRowClick={onExpandRowClick}
        />
      )}
    </div>
  );
};

export default TableBody;
