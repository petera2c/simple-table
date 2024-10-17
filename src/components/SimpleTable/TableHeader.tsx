import { createRef, Dispatch, SetStateAction, useRef } from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import HeaderObject from "../../types/HeaderObject";
import TableLastColumnCell from "./TableLastColumnCell";
import TableRowSeparator from "./TableRowSeparator";

interface TableHeaderProps {
  enableColumnResizing: boolean;
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  isWidthDragging: boolean;
  onSort: (columnIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
  shouldDisplayLastColumnCell: boolean;
}

const TableHeader = ({
  enableColumnResizing,
  forceUpdate,
  headersRef,
  isWidthDragging,
  onSort,
  onTableHeaderDragEnd,
  setIsWidthDragging,
  shouldDisplayLastColumnCell,
}: TableHeaderProps) => {
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);

  return (
    <>
      <Animate pauseAnimation={isWidthDragging}>
        {headersRef.current?.map((header, index) => (
          <TableHeaderCell
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
