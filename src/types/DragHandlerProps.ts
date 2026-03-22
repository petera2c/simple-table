import { MutableRefObject } from "react";
import HeaderObject, { Accessor } from "./HeaderObject";

type useDragHandlerProps = {
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  essentialAccessors?: ReadonlySet<Accessor | string>;
  headers: HeaderObject[];
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
};

export default useDragHandlerProps;
