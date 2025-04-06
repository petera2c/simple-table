import { createRef, Fragment, useEffect, useRef } from "react";
import { Pinned } from "../../enums/Pinned";
import { displayCell } from "../../utils/cellUtils";
import Animate from "../Animate";
import TableHeaderCell, { TableHeaderCellProps } from "./TableHeaderCell";
import TableHeaderSectionProps from "../../types/TableHeaderSectionProps";
import { HeaderObject } from "../..";

const RecursiveTableHeaderRender = ({
  depth,
  getNextColIndex,
  header,
  hiddenColumns,
  index,
  maxDepth,
  pinned,
  ...props
}: Omit<
  TableHeaderCellProps,
  "ref" | "gridColumnStart" | "gridColumnEnd" | "gridRowStart" | "gridRowEnd" | "colIndex"
> & {
  depth: number;
  getNextColIndex: (add?: number) => number;
  header: HeaderObject;
  hiddenColumns: Record<string, boolean>;
  index: number;
  maxDepth: number;
  pinned?: Pinned;
}) => {
  const childrenLength = header.children?.length ?? 0;

  const colIndex = getNextColIndex(index === 0 ? 0 : 1);
  const gridColumnStart = colIndex;
  const gridColumnEnd = childrenLength > 0 ? gridColumnStart + childrenLength : gridColumnStart + 1;
  const gridRowStart = depth;
  const gridRowEnd = childrenLength > 0 ? gridRowStart + 1 : maxDepth + 1;

  const gridProps = {
    gridColumnStart,
    gridColumnEnd,
    gridRowStart,
    gridRowEnd,
  };

  if (header.children) {
    const children = header.children.filter((child) =>
      displayCell({ hiddenColumns, header: child, pinned })
    );
    return (
      <Fragment>
        <TableHeaderCell
          {...props}
          {...gridProps}
          colIndex={colIndex}
          header={header}
          ref={createRef()}
        />
        {children.map((child, index) => {
          return (
            <RecursiveTableHeaderRender
              {...props}
              depth={depth + 1}
              getNextColIndex={getNextColIndex}
              header={child}
              hiddenColumns={hiddenColumns}
              index={index}
              key={child.accessor}
              maxDepth={maxDepth}
            />
          );
        })}
      </Fragment>
    );
  }

  return (
    <TableHeaderCell
      {...props}
      {...gridProps}
      colIndex={colIndex}
      header={header}
      ref={createRef()}
    />
  );
};

const TableHeaderSection = ({
  allowAnimations,
  columnReordering,
  columnResizing,
  currentRows,
  draggedHeaderRef,
  forceUpdate,
  gridTemplateColumns,
  handleScroll,
  headersRef,
  hiddenColumns,
  hoveredHeaderRef,
  isWidthDragging,
  mainBodyRef,
  maxDepth,
  onColumnOrderChange,
  onSort,
  onTableHeaderDragEnd,
  pinned,
  rowHeight,
  sectionRef,
  selectableColumns,
  setIsWidthDragging,
  setSelectedCells,
  sort,
  sortDownIcon,
  sortUpIcon,
}: TableHeaderSectionProps) => {
  const colIndexRef = useRef(1);

  useEffect(() => {
    colIndexRef.current = 1;
  });

  const getNextColIndex = (add = 1) => {
    colIndexRef.current += add;
    return colIndexRef.current;
  };

  const headers = headersRef.current.filter((header) =>
    displayCell({ hiddenColumns, header, pinned })
  );
  return (
    <div
      className={`st-header-${pinned ? `pinned-${pinned}` : "main"}`}
      {...(handleScroll && { onScroll: handleScroll })}
      ref={sectionRef}
      style={{
        gridTemplateColumns,
      }}
    >
      <Animate
        allowAnimations={allowAnimations}
        draggedHeaderRef={draggedHeaderRef}
        headersRef={headersRef}
        mainBodyRef={mainBodyRef}
        pauseAnimation={isWidthDragging}
        rowIndex={0}
      >
        {headers.map((header, index) => {
          return (
            <RecursiveTableHeaderRender
              getNextColIndex={getNextColIndex}
              columnReordering={columnReordering}
              columnResizing={columnResizing}
              currentRows={currentRows}
              depth={1}
              draggedHeaderRef={draggedHeaderRef}
              forceUpdate={forceUpdate}
              header={header}
              headersRef={headersRef}
              hiddenColumns={hiddenColumns}
              hoveredHeaderRef={hoveredHeaderRef}
              index={index}
              key={header.accessor}
              maxDepth={maxDepth}
              onColumnOrderChange={onColumnOrderChange}
              onSort={onSort}
              onTableHeaderDragEnd={onTableHeaderDragEnd}
              pinned={pinned}
              reverse={pinned === Pinned.RIGHT}
              rowHeight={rowHeight}
              selectableColumns={selectableColumns}
              setIsWidthDragging={setIsWidthDragging}
              setSelectedCells={setSelectedCells}
              sort={sort}
              sortDownIcon={sortDownIcon}
              sortUpIcon={sortUpIcon}
            />
          );
        })}
      </Animate>
    </div>
  );
};

export default TableHeaderSection;
