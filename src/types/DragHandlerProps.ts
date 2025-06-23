import { RefObject, Dispatch, SetStateAction } from "react";
import HeaderObject from "./HeaderObject";

type useDragHandlerProps = {
  draggedHeaderRef: RefObject<HeaderObject | null>;
  headers: HeaderObject[];
  hoveredHeaderRef: RefObject<HeaderObject | null>;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
};

export default useDragHandlerProps;
