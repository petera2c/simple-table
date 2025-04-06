import { createRef, Dispatch, Fragment, SetStateAction, useMemo } from "react";
import { Pinned } from "../../types/Pinned";
import { displayCell } from "../../utils/cellUtils";
import Animate from "../Animate";
import TableHeaderCell, { TableHeaderCellProps } from "./TableHeaderCell";
import TableHeaderSectionProps from "../../types/TableHeaderSectionProps";
import { HeaderObject } from "../..";

// Define a type for the grid positions
type GridPosition = {
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  colIndex: number;
  children?: Record<string, GridPosition>;
};

const RecursiveTableHeaderRender = ({
  depth,
  header,
  hiddenColumns,
  index,
  maxDepth,
  pinned,
  gridPosition,
  lastSelectedColumnIndex,
  ...props
}: Omit<
  TableHeaderCellProps,
  "ref" | "gridColumnStart" | "gridColumnEnd" | "gridRowStart" | "gridRowEnd" | "colIndex"
> & {
  depth: number;
  header: HeaderObject;
  hiddenColumns: Record<string, boolean>;
  index: number;
  maxDepth: number;
  pinned?: Pinned;
  gridPosition: GridPosition;
  lastSelectedColumnIndex?: number | null;
}) => {
  if (!displayCell({ hiddenColumns, header, pinned })) return null;

  const { gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd, colIndex } = gridPosition;

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
        {children.map((child, childIndex) => {
          // Find the grid position for this child
          const childGridPosition = gridPosition.children?.[child.accessor];
          if (!childGridPosition) return null;

          return (
            <RecursiveTableHeaderRender
              {...props}
              depth={depth + 1}
              gridPosition={childGridPosition}
              header={child}
              hiddenColumns={hiddenColumns}
              index={childIndex}
              key={child.accessor}
              maxDepth={maxDepth}
              lastSelectedColumnIndex={lastSelectedColumnIndex}
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
  lastSelectedColumnIndex,
  mainBodyRef,
  maxDepth,
  onColumnOrderChange,
  onSort,
  onTableHeaderDragEnd,
  pinned,
  rowHeight,
  sectionRef,
  selectableColumns,
  selectColumns,
  setIsWidthDragging,
  setSelectedColumns,
  sort,
  sortDownIcon,
  sortUpIcon,
}: TableHeaderSectionProps) => {
  const headers = headersRef.current.filter((header) =>
    displayCell({ hiddenColumns, header, pinned })
  );

  // Memoize the grid positions calculation
  const gridPositions = useMemo(() => {
    // Calculate grid positions for all headers upfront
    const calculateGridPositions = () => {
      const positions: Record<string, GridPosition> = {};
      let columnCounter = 1;

      const processHeader = (
        header: HeaderObject,
        depth: number,
        isFirst: boolean = false
      ): GridPosition => {
        // Only increment for non-first siblings
        if (!isFirst) {
          columnCounter++;
        }

        const colIndex = columnCounter;
        const childrenLength =
          header.children?.filter((child) => displayCell({ hiddenColumns, header: child, pinned }))
            .length ?? 0;

        const gridColumnStart = colIndex;
        const gridColumnEnd =
          childrenLength > 0 ? gridColumnStart + childrenLength : gridColumnStart + 1;
        const gridRowStart = depth;
        const gridRowEnd = childrenLength > 0 ? gridRowStart + 1 : maxDepth + 1;

        const position: GridPosition = {
          gridColumnStart,
          gridColumnEnd,
          gridRowStart,
          gridRowEnd,
          colIndex,
          children: {},
        };

        // Process children recursively
        if (header.children && header.children.length > 0) {
          header.children
            .filter((child) => displayCell({ hiddenColumns, header: child, pinned }))
            .forEach((child, i) => {
              position.children![child.accessor] = processHeader(child, depth + 1, i === 0);
            });
        }

        positions[header.accessor] = position;
        return position;
      };

      // Process all top-level headers
      headers.forEach((header, i) => {
        processHeader(header, 1, i === 0);
      });

      return positions;
    };

    return calculateGridPositions();
  }, [headers, hiddenColumns, maxDepth, pinned]);

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
          const headerGridPosition = gridPositions[header.accessor];
          if (!headerGridPosition) return null;

          return (
            <RecursiveTableHeaderRender
              columnReordering={columnReordering}
              columnResizing={columnResizing}
              currentRows={currentRows}
              depth={1}
              draggedHeaderRef={draggedHeaderRef}
              forceUpdate={forceUpdate}
              gridPosition={headerGridPosition}
              header={header}
              headersRef={headersRef}
              hiddenColumns={hiddenColumns}
              hoveredHeaderRef={hoveredHeaderRef}
              index={index}
              key={header.accessor}
              lastSelectedColumnIndex={lastSelectedColumnIndex}
              maxDepth={maxDepth}
              onColumnOrderChange={onColumnOrderChange}
              onSort={onSort}
              onTableHeaderDragEnd={onTableHeaderDragEnd}
              pinned={pinned}
              reverse={pinned === "right"}
              rowHeight={rowHeight}
              selectableColumns={selectableColumns}
              selectColumns={selectColumns}
              setIsWidthDragging={setIsWidthDragging}
              setSelectedColumns={setSelectedColumns}
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
