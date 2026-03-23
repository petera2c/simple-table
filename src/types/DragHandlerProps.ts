import HeaderObject, { Accessor } from "./HeaderObject";

type useDragHandlerProps = {
  draggedHeaderRef: { current: HeaderObject | null };
  essentialAccessors?: ReadonlySet<Accessor | string>;
  headers: HeaderObject[];
  hoveredHeaderRef: { current: HeaderObject | null };
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
};

export default useDragHandlerProps;
