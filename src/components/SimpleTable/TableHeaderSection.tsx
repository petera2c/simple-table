import { createRef, Fragment, useMemo } from "react";
import { Pinned } from "../../types/Pinned";
import { displayCell } from "../../utils/cellUtils";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import TableHeaderSectionProps from "../../types/TableHeaderSectionProps";
import { HeaderObject } from "../..";

// Define a type for the grid positions
type GridPosition = {
  gridColumnStart: number;
  gridColumnEnd: number;
  gridRowStart: number;
  gridRowEnd: number;
  children?: Record<string, GridPosition>;
};

// Props for RecursiveTableHeaderRender
interface RecursiveRenderProps {
  columnIndices: TableHeaderSectionProps["columnIndices"];
  depth: number;
  header: HeaderObject;
  hiddenColumns: Record<string, boolean>;
  maxDepth: number;
  pinned?: Pinned;
  gridPosition: GridPosition;
  reverse?: boolean;
  sort: TableHeaderSectionProps["sort"];
}

const RecursiveTableHeaderRender = ({
  columnIndices,
  depth,
  header,
  hiddenColumns,
  maxDepth,
  pinned,
  gridPosition,
  reverse,
  sort,
}: RecursiveRenderProps) => {
  if (!displayCell({ hiddenColumns, header, pinned })) return null;

  const { gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd } = gridPosition;
  const colIndex = columnIndices[header.accessor];

  if (header.children) {
    const children = header.children.filter((child) =>
      displayCell({ hiddenColumns, header: child, pinned })
    );
    return (
      <Fragment>
        <TableHeaderCell
          colIndex={colIndex}
          gridColumnEnd={gridColumnEnd}
          gridColumnStart={gridColumnStart}
          gridRowEnd={gridRowEnd}
          gridRowStart={gridRowStart}
          header={header}
          ref={createRef()}
          reverse={reverse}
          sort={sort}
        />
        {children.map((child, childIndex) => {
          // Find the grid position for this child
          const childGridPosition = gridPosition.children?.[child.accessor];
          if (!childGridPosition) return null;

          return (
            <RecursiveTableHeaderRender
              columnIndices={columnIndices}
              depth={depth + 1}
              gridPosition={childGridPosition}
              header={child}
              hiddenColumns={hiddenColumns}
              key={child.accessor}
              maxDepth={maxDepth}
              pinned={pinned}
              reverse={reverse}
              sort={sort}
            />
          );
        })}
      </Fragment>
    );
  }

  return (
    <TableHeaderCell
      colIndex={colIndex}
      gridColumnEnd={gridColumnEnd}
      gridColumnStart={gridColumnStart}
      gridRowEnd={gridRowEnd}
      gridRowStart={gridRowStart}
      header={header}
      ref={createRef()}
      reverse={reverse}
      sort={sort}
    />
  );
};

const TableHeaderSection = ({
  columnIndices,
  gridTemplateColumns,
  handleScroll,
  headersRef,
  hiddenColumns,
  maxDepth,
  pinned,
  sectionRef,
  sort,
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

        const childrenLength =
          header.children?.filter((child) => displayCell({ hiddenColumns, header: child, pinned }))
            .length ?? 0;

        const gridColumnStart = columnCounter;
        const gridColumnEnd =
          childrenLength > 0 ? gridColumnStart + childrenLength : gridColumnStart + 1;
        const gridRowStart = depth;
        const gridRowEnd = childrenLength > 0 ? gridRowStart + 1 : maxDepth + 1;

        const position: GridPosition = {
          gridColumnStart,
          gridColumnEnd,
          gridRowStart,
          gridRowEnd,
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
      <Animate rowIndex={0}>
        {headers.map((header) => {
          const headerGridPosition = gridPositions[header.accessor];
          if (!headerGridPosition) return null;

          return (
            <RecursiveTableHeaderRender
              columnIndices={columnIndices}
              depth={1}
              gridPosition={headerGridPosition}
              header={header}
              hiddenColumns={hiddenColumns}
              key={header.accessor}
              maxDepth={maxDepth}
              pinned={pinned}
              reverse={pinned === "right"}
              sort={sort}
            />
          );
        })}
      </Animate>
    </div>
  );
};

export default TableHeaderSection;
