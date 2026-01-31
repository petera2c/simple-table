import { Fragment, useMemo } from "react";
import { useTableContext } from "../../context/TableContext";
import TableRow from "../../types/TableRow";
import { ROW_SEPARATOR_WIDTH } from "../../consts/general-consts";
import TableRowComponent from "./TableRow";
import TableRowSeparator from "./TableRowSeparator";
import { rowIdToString } from "../../utils/rowUtils";
import { calculateColumnIndices } from "../../utils/columnIndicesUtils";
import RowIndices from "../../types/RowIndices";
import HeaderObject from "../../types/HeaderObject";

interface StickyParentsContainerProps {
  stickyParents: TableRow[];
  mainTemplateColumns: string;
  pinnedLeftColumns: HeaderObject[];
  pinnedLeftTemplateColumns: string;
  pinnedLeftWidth: number;
  pinnedRightColumns: HeaderObject[];
  pinnedRightTemplateColumns: string;
  pinnedRightWidth: number;
  setHoveredIndex: (index: number | null) => void;
  rowIndices: RowIndices;
}

const StickyParentsContainer = ({
  stickyParents,
  mainTemplateColumns,
  pinnedLeftColumns,
  pinnedLeftTemplateColumns,
  pinnedLeftWidth,
  pinnedRightColumns,
  pinnedRightTemplateColumns,
  pinnedRightWidth,
  setHoveredIndex,
  rowIndices,
}: StickyParentsContainerProps) => {
  const { headers, rowHeight, collapsedHeaders } = useTableContext();

  // Calculate column indices
  const columnIndices = useMemo(() => {
    return calculateColumnIndices({
      headers,
      pinnedLeftColumns,
      pinnedRightColumns,
      collapsedHeaders,
    });
  }, [headers, pinnedLeftColumns, pinnedRightColumns, collapsedHeaders]);

  // Calculate total height for sticky container
  const stickyHeight =
    stickyParents.length > 0
      ? stickyParents.length * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH
      : 0;

  if (stickyParents.length === 0) return null;

  // Render sticky rows for a specific section
  const renderStickySection = (
    templateColumns: string,
    sectionHeaders: HeaderObject[],
    pinned?: "left" | "right",
    width?: number,
    columnIndexStart: number = 0
  ) => {
    return (
      <div
        className={pinned ? `st-sticky-section-${pinned}` : "st-sticky-section-main"}
        style={{
          position: "relative",
          height: `${stickyHeight}px`,
          width: pinned ? `${width}px` : undefined,
          flexGrow: pinned ? 0 : 1,
          flexShrink: pinned ? 0 : undefined,
        }}
      >
        {stickyParents.map((tableRow, stickyIndex) => {
          const rowId = tableRow.stateIndicator
            ? `sticky-state-${tableRow.stateIndicator.parentRowId}-${tableRow.position}`
            : `sticky-${rowIdToString(tableRow.rowId)}`;

          // Calculate the Y position for this sticky row's separator
          const separatorTop =
            (stickyIndex + 1) * (rowHeight + ROW_SEPARATOR_WIDTH) - ROW_SEPARATOR_WIDTH;

          return (
            <Fragment key={rowId}>
              <TableRowComponent
                columnIndexStart={columnIndexStart}
                columnIndices={columnIndices}
                gridTemplateColumns={templateColumns}
                headers={sectionHeaders}
                index={tableRow.position}
                pinned={pinned}
                rowHeight={rowHeight}
                rowIndices={rowIndices}
                setHoveredIndex={setHoveredIndex}
                tableRow={tableRow}
                isSticky={true}
                stickyIndex={stickyIndex}
              />
              {/* Add separator after each sticky row - never use strong border for sticky rows */}
              <TableRowSeparator
                displayStrongBorder={false}
                position={separatorTop}
                rowHeight={rowHeight}
                templateColumns={templateColumns}
                isSticky={true}
              />
            </Fragment>
          );
        })}
      </div>
    );
  };

  const currentHeaders = headers.filter((header) => !header.pinned);

  return (
    <div className="st-sticky-top" style={{ height: `${stickyHeight}px` }}>
      {/* Left pinned section */}
      {pinnedLeftColumns.length > 0 &&
        renderStickySection(
          pinnedLeftTemplateColumns,
          pinnedLeftColumns,
          "left",
          pinnedLeftWidth,
          0
        )}

      {/* Main center section */}
      {renderStickySection(
        mainTemplateColumns,
        currentHeaders,
        undefined,
        undefined,
        pinnedLeftColumns.length
      )}

      {/* Right pinned section */}
      {pinnedRightColumns.length > 0 &&
        renderStickySection(
          pinnedRightTemplateColumns,
          pinnedRightColumns,
          "right",
          pinnedRightWidth,
          pinnedLeftColumns.length + currentHeaders.length
        )}
    </div>
  );
};

export default StickyParentsContainer;
