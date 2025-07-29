import { MutableRefObject } from "react";
import HeaderObject, { AggregatedRow } from "./HeaderObject";

type useDragHandlerProps<T> = {
  draggedHeaderRef: MutableRefObject<HeaderObject<AggregatedRow<T>> | null>;
  headers: HeaderObject<AggregatedRow<T>>[];
  hoveredHeaderRef: MutableRefObject<HeaderObject<AggregatedRow<T>> | null>;
  onColumnOrderChange?: (newHeaders: HeaderObject<AggregatedRow<T>>[]) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject<AggregatedRow<T>>[]) => void;
};

export default useDragHandlerProps;
