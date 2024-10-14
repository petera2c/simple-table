import { createRef, Dispatch, SetStateAction, useRef } from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import HeaderObject from "../../types/HeaderObject";

interface TableHeaderProps {
  headers: HeaderObject[];
  isWidthDragging: boolean;
  onSort: (columnIndex: number) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setIsWidthDragging: Dispatch<SetStateAction<boolean>>;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  headers,
  isWidthDragging,
  onSort,
  onTableHeaderDragEnd,
  setHeaders,
  setIsWidthDragging,
}) => {
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);

  return (
    <Animate pause={isWidthDragging}>
      {headers?.map((header, index) => (
        <TableHeaderCell
          draggedHeaderRef={draggedHeaderRef}
          headers={headers}
          hoveredHeaderRef={hoveredHeaderRef}
          index={index}
          key={header.accessor}
          onSort={onSort}
          onTableHeaderDragEnd={onTableHeaderDragEnd}
          ref={createRef()}
          setHeaders={setHeaders}
          setIsWidthDragging={setIsWidthDragging}
        />
      ))}
    </Animate>
  );
};

export default TableHeader;
