import { createRef, useRef } from "react";
import Animate from "../Animate";
import TableHeaderCell from "./TableHeaderCell";
import HeaderObject from "../../types/HeaderObject";

interface TableHeaderProps {
  headersRef: React.RefObject<HeaderObject[]>;
  onSort: (columnIndex: number) => void;
  onDragEnd: (newHeaders: HeaderObject[]) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  headersRef,
  onSort,
  onDragEnd,
}) => {
  const draggedHeaderRef = useRef<HeaderObject | null>(null);
  const hoveredHeaderRef = useRef<HeaderObject | null>(null);

  return (
    <thead className="st-thead">
      <tr className="st-tr">
        <Animate>
          {headersRef.current?.map((header, index) => (
            <TableHeaderCell
              draggedHeaderRef={draggedHeaderRef}
              headersRef={headersRef}
              hoveredHeaderRef={hoveredHeaderRef}
              index={index}
              key={header.accessor}
              onDragEnd={onDragEnd}
              onSort={onSort}
              ref={createRef()}
            />
          ))}
        </Animate>
      </tr>
    </thead>
  );
};

export default TableHeader;
