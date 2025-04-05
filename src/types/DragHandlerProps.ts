import { RefObject } from "react";
import HeaderObject from "./HeaderObject";

type useDragHandlerProps = {
  draggedHeaderRef: RefObject<HeaderObject | null>;
  headersRef: RefObject<HeaderObject[]>;
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
};

export default useDragHandlerProps;
