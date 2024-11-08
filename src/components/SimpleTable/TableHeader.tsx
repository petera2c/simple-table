import {
  createRef,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useRef,
} from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import HeaderObject from "../../types/HeaderObject";
import TableLastColumnCell from "./TableLastColumnCell";
import SortConfig from "../../types/SortConfig";
import OnSortProps from "../../types/OnSortProps";

interface TableHeaderProps {
  draggable: boolean;
  columnResizing: boolean;
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  hiddenColumns: Record<string, boolean>;
  isWidthDragging: boolean;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  shouldDisplayLastColumnCell: boolean;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
  tableRef: RefObject<HTMLDivElement>;
}

const TableHeader = ({
  draggable,
  columnResizing,
  forceUpdate,
  headersRef,
  hiddenColumns,
  isWidthDragging,
  onSort,
  onTableHeaderDragEnd,
  setIsWidthDragging,
  shouldDisplayLastColumnCell,
  sort,
  sortDownIcon,
  sortUpIcon,
  tableRef,
}: TableHeaderProps) => {
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);

  return (
    <>
      <Animate pauseAnimation={isWidthDragging} tableRef={tableRef}>
        {headersRef.current?.map((header, index) => {
          if (hiddenColumns[header.accessor]) return null;

          return (
            <TableHeaderCell
              draggable={draggable}
              draggedHeaderRef={draggedHeaderRef}
              columnResizing={columnResizing}
              forceUpdate={forceUpdate}
              headersRef={headersRef}
              hoveredHeaderRef={hoveredHeaderRef}
              index={index}
              key={header.accessor}
              onSort={onSort}
              onTableHeaderDragEnd={onTableHeaderDragEnd}
              ref={createRef()}
              setIsWidthDragging={setIsWidthDragging}
              sort={sort}
              sortDownIcon={sortDownIcon}
              sortUpIcon={sortUpIcon}
            />
          );
        })}
        <TableLastColumnCell
          ref={createRef()}
          visible={shouldDisplayLastColumnCell}
        />
      </Animate>
    </>
  );
};

export default TableHeader;
