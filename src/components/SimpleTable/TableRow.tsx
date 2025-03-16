import { createRef, ReactNode, RefObject } from "react";
import Animate from "../Animate";
import TableRowSeparator from "./TableRowSeparator";
import TableLastColumnCell from "./TableLastColumnCell";
import TableCell from "./TableCell";
import CellValue from "../../types/CellValue";
import HeaderObject from "../../types/HeaderObject";
import { MouseDownProps } from "../../hooks/useSelection";
import CellChangeProps from "../../types/CellChangeProps";
import Row from "../../types/Row";
import { displayCell } from "../../utils/cellUtils";

const TableRow = ({
  allowAnimations,
  currentRows,
  draggedHeaderRef,
  getBorderClass,
  handleMouseDown,
  handleMouseOver,
  headers,
  headersRef,
  hiddenColumns,
  hoveredHeaderRef,
  isSelected,
  isTopLeftCell,
  isWidthDragging,
  onCellChange,
  onTableHeaderDragEnd,
  onToggleGroup,
  row,
  rowIndex,
  shouldDisplayLastColumnCell,
  shouldPaginate,
  tableRef,
}: {
  allowAnimations: boolean;
  currentRows: { [key: string]: any }[];
  draggedHeaderRef: RefObject<HeaderObject | null>;
  getBorderClass: (rowIndex: number, columnIndex: number) => string;
  handleMouseDown: (props: MouseDownProps) => void;
  handleMouseOver: (rowIndex: number, columnIndex: number) => void;
  headers: HeaderObject[];
  headersRef: RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  isSelected: (rowIndex: number, columnIndex: number) => boolean;
  isTopLeftCell: (rowIndex: number, columnIndex: number) => boolean;
  isWidthDragging: boolean;
  onCellChange?: (props: CellChangeProps) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  onToggleGroup: (rowId: number) => void;
  row: Row;
  rowIndex: number;
  shouldDisplayLastColumnCell: boolean;
  shouldPaginate: boolean;
  tableRef: RefObject<HTMLDivElement | null>;
}) => {
  const isGroup = (row.rowMeta?.children?.length || 0) > 0;

  return (
    <>
      <Animate
        allowAnimations={allowAnimations}
        allowHorizontalAnimate={shouldPaginate}
        draggedHeaderRef={draggedHeaderRef}
        headersRef={headersRef}
        isBody
        pauseAnimation={isWidthDragging}
        rowIndex={rowIndex + 1}
        tableRef={tableRef}
      >
        {isGroup ? (
          <>
            <div
              className="st-table-row-group-header"
              onClick={() => onToggleGroup?.(row.rowMeta.rowId)}
            >
              <div className="st-table-row-group-header-content">
                <span className="st-table-row-group-header-toggle-icon">
                  {row.rowMeta.isExpanded ? "▼" : "▶"}
                </span>
              </div>
            </div>
            {row.rowMeta.isExpanded &&
              row.rowMeta.children?.map((child, childIndex) => {
                return (
                  <TableRow
                    allowAnimations={allowAnimations}
                    currentRows={currentRows}
                    draggedHeaderRef={draggedHeaderRef}
                    getBorderClass={getBorderClass}
                    handleMouseDown={handleMouseDown}
                    handleMouseOver={handleMouseOver}
                    headers={headers}
                    headersRef={headersRef}
                    hiddenColumns={hiddenColumns}
                    hoveredHeaderRef={hoveredHeaderRef}
                    isSelected={isSelected}
                    isTopLeftCell={isTopLeftCell}
                    isWidthDragging={isWidthDragging}
                    onCellChange={onCellChange}
                    onTableHeaderDragEnd={onTableHeaderDragEnd}
                    onToggleGroup={onToggleGroup}
                    row={child}
                    key={childIndex}
                    rowIndex={rowIndex + 1}
                    shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
                    shouldPaginate={shouldPaginate}
                    tableRef={tableRef}
                  />
                );
              })}
          </>
        ) : (
          headers.map((header, colIndex) => {
            if (!displayCell({ hiddenColumns, header })) return null;

            if (header.accessor === "children") {
              return (
                <div className="contents" key={colIndex}>
                  hello world
                  {/* <TableRow
                      row={content}
                      rowIndex={rowIndex}
                      key={header.accessor}
                    /> */}
                </div>
              );
            }

            let content: CellValue | ReactNode = row.rowData[header.accessor];

            if (header.cellRenderer) {
              content = header.cellRenderer(row);
            }

            return (
              <TableCell
                borderClass={getBorderClass(rowIndex, colIndex)}
                colIndex={colIndex}
                content={content}
                draggedHeaderRef={draggedHeaderRef}
                header={header}
                headersRef={headersRef}
                hoveredHeaderRef={hoveredHeaderRef}
                isSelected={isSelected}
                isTopLeftCell={isTopLeftCell}
                key={header.accessor}
                onCellChange={onCellChange}
                onMouseDown={() => handleMouseDown({ rowIndex, colIndex })}
                onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                onTableHeaderDragEnd={onTableHeaderDragEnd}
                ref={createRef()}
                row={row}
                rowIndex={rowIndex}
              />
            );
          })
        )}
        <TableLastColumnCell
          ref={createRef()}
          visible={shouldDisplayLastColumnCell}
        />
      </Animate>
      {rowIndex !== currentRows.length - 1 && <TableRowSeparator />}
    </>
  );
};

export default TableRow;
