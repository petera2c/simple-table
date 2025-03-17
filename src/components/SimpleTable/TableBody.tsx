import TableBodyProps from "../../types/TableBodyProps";
import TableSection from "./TableSection";

const TableBody = (props: TableBodyProps) => {
  const {
    currentRows,
    pinnedLeftColumns,
    pinnedLeftRef,
    pinnedLeftTemplateColumns,
    pinnedRightColumns,
    pinnedRightRef,
    pinnedRightTemplateColumns,
    mainTemplateColumns,
    tableRef,
    isRowExpanded,
    onExpandRowClick,
  } = props;

  return (
    <div className="st-table-body-container">
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
