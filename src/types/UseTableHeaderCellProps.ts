import HeaderObject from "./HeaderObject";

type UseTableHeaderCellProps = {
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
};

export default UseTableHeaderCellProps;
