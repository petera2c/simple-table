import { MutableRefObject, Dispatch, SetStateAction } from "react";
import HeaderObject from "./HeaderObject";

type useDragHandlerProps = {
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  headers: HeaderObject[];
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
};

export default useDragHandlerProps;
