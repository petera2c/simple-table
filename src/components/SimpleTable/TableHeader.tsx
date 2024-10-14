import { createRef, Dispatch, SetStateAction, useRef } from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import HeaderObject from "../../types/HeaderObject";
import TableLastColumnCell from "./TableLastColumnCell";

interface TableHeaderProps {
  forceUpdate: () => void;
  headersRef: React.RefObject<HeaderObject[]>;
  isWidthDragging: boolean;
  onSort: (columnIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  forceUpdate,
  headersRef,
  isWidthDragging,
  onSort,
  onTableHeaderDragEnd,
  setIsWidthDragging,
}) => {
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);

  return (
    <Animate pause={isWidthDragging}>
      {headersRef.current?.map((header, index) => (
        <TableHeaderCell
          draggedHeaderRef={draggedHeaderRef}
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
      <TableLastColumnCell ref={createRef()} />
    </Animate>
  );
};

export default TableHeader;
