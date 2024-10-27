import { createRef, Dispatch, ReactNode, SetStateAction, useRef } from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import HeaderObject from "../../types/HeaderObject";
import TableLastColumnCell from "./TableLastColumnCell";
import TableRowSeparator from "./TableRowSeparator";
import SortConfig from "../../types/SortConfig";
import OnSortProps from "../../types/OnSortProps";

interface TableHeaderProps {
  draggable: boolean;
  enableColumnResizing: boolean;
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  isWidthDragging: boolean;
  onSort: OnSortProps;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  shouldDisplayLastColumnCell: boolean;
  sort: SortConfig | null;
  sortDownIcon?: ReactNode;
  sortUpIcon?: ReactNode;
}

const TableHeader = ({
  draggable,
  enableColumnResizing,
  forceUpdate,
  headersRef,
  isWidthDragging,
  onSort,
  onTableHeaderDragEnd,
  setIsWidthDragging,
  shouldDisplayLastColumnCell,
  sort,
  sortDownIcon,
  sortUpIcon,
}: TableHeaderProps) => {
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);

  return (
    <>
      <Animate pauseAnimation={isWidthDragging}>
        {headersRef.current?.map((header, index) => (
          <TableHeaderCell
            draggable={draggable}
            draggedHeaderRef={draggedHeaderRef}
            enableColumnResizing={enableColumnResizing}
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
        ))}
        <TableLastColumnCell
          ref={createRef()}
          visible={shouldDisplayLastColumnCell}
        />
      </Animate>
      <TableRowSeparator />
    </>
  );
};

export default TableHeader;
