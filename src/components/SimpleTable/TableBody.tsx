import { createRef, Fragment, ReactNode, RefObject } from "react";
import TableCell from "./TableCell";
import Animate from "../Animate";
import TableLastColumnCell from "./TableLastColumnCell";
import TableRowSeparator from "./TableRowSeparator";
import TableBodyProps from "../../types/TableBodyProps";
import { displayCell } from "../../utils/cellUtils";
import Row from "../../types/Row";
import HeaderObject from "../../types/HeaderObject";
import CellValue from "../../types/CellValue";
import CellChangeProps from "../../types/CellChangeProps";
import { MouseDownProps } from "../../hooks/useSelection";

const TableBody = ({
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
  mainTemplateColumns,
  onCellChange,
  onTableHeaderDragEnd,
  pinnedLeftColumns,
  pinnedLeftRef,
  pinnedLeftTemplateColumns,
  pinnedRightColumns,
  pinnedRightRef,
  pinnedRightTemplateColumns,
  shouldDisplayLastColumnCell,
  shouldPaginate,
  tableRef,
}: TableBodyProps) => {
  return (
    <div className="st-table-body-container">
      {pinnedLeftColumns.length > 0 && (
        <div
          className="st-table-body-pinned-left"
          ref={pinnedLeftRef}
          style={{
            gridTemplateColumns: pinnedLeftTemplateColumns,
          }}
        >
          {currentRows.map((row, rowIndex) => {
            return (
              <Fragment key={rowIndex}>
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
                  {headers.map((header, colIndex) => {
                    if (!displayCell({ hiddenColumns, header, pinned: "left" }))
                      return null;

                    let content: CellValue | ReactNode =
                      row.rowData[header.accessor];

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
                        isSelected={isSelected(rowIndex, colIndex)}
                        isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
                        key={colIndex}
                        onCellChange={onCellChange}
                        onMouseDown={() =>
                          handleMouseDown({ rowIndex, colIndex })
                        }
                        onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                        onTableHeaderDragEnd={onTableHeaderDragEnd}
                        ref={createRef()}
                        row={row}
                        rowIndex={rowIndex}
                      />
                    );
                  })}
                  <TableLastColumnCell
                    ref={createRef()}
                    visible={shouldDisplayLastColumnCell}
                  />
                </Animate>
                {rowIndex !== currentRows.length - 1 && <TableRowSeparator />}
              </Fragment>
            );
          })}
        </div>
      )}
      <div
        className="st-table-body-main"
        ref={tableRef}
        style={{
          gridTemplateColumns: mainTemplateColumns,
        }}
      >
        {currentRows.map((row, rowIndex) => {
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
              key={rowIndex}
              onCellChange={onCellChange}
              onTableHeaderDragEnd={onTableHeaderDragEnd}
              onToggleGroup={() => {}}
              row={row}
              rowIndex={rowIndex}
              shouldDisplayLastColumnCell={shouldDisplayLastColumnCell}
              shouldPaginate={shouldPaginate}
              tableRef={tableRef}
            />
          );
        })}
      </div>
      {pinnedRightColumns.length > 0 && (
        <div
          className="st-table-body-pinned-right"
          ref={pinnedRightRef}
          style={{
            gridTemplateColumns: pinnedRightTemplateColumns,
          }}
        >
          {currentRows.map((row, rowIndex) => {
            return (
              <Fragment key={rowIndex}>
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
                  {headers.map((header, colIndex) => {
                    if (
                      !displayCell({ hiddenColumns, header, pinned: "right" })
                    )
                      return null;

                    let content: CellValue | ReactNode =
                      row.rowData[header.accessor];

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
                        isSelected={isSelected(rowIndex, colIndex)}
                        isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
                        key={colIndex}
                        onCellChange={onCellChange}
                        onMouseDown={() =>
                          handleMouseDown({ rowIndex, colIndex })
                        }
                        onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                        onTableHeaderDragEnd={onTableHeaderDragEnd}
                        ref={createRef()}
                        row={row}
                        rowIndex={rowIndex}
                      />
                    );
                  })}
                  <TableLastColumnCell
                    ref={createRef()}
                    visible={shouldDisplayLastColumnCell}
                  />
                </Animate>
                {rowIndex !== currentRows.length - 1 && <TableRowSeparator />}
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

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
                isSelected={isSelected(rowIndex, colIndex)}
                isTopLeftCell={isTopLeftCell(rowIndex, colIndex)}
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

export default TableBody;
