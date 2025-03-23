import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import TableBodyProps from "../../types/TableBodyProps";
import TableSection from "./TableSection";

const TableBody = (props: TableBodyProps) => {
  const {
    currentRows,
    headerContainerRef,
    isRowExpanded,
    mainBodyRef,
    mainTemplateColumns,
    onExpandRowClick,
    pinnedLeftColumns,
    pinnedLeftRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightRef,
    pinnedRightTemplateColumns,
    scrollbarHorizontalRef,
    tableBodyContainerRef,
  } = props;

  useScrollbarVisibility({ headerContainerRef, mainSectionRef: mainBodyRef, scrollbarHorizontalRef });

  return (
    <div className="st-table-body-container" ref={tableBodyContainerRef}>
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
        sectionRef={mainBodyRef}
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
