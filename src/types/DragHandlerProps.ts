import HeaderObject from "./HeaderObject";

type useDragHandlerProps = {
  draggedHeaderRef: { current: HeaderObject | null };
  headers: HeaderObject[];
  hoveredHeaderRef: { current: HeaderObject | null };
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
};

export default useDragHandlerProps;
