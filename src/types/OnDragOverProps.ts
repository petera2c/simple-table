import { DragEvent } from "react";
import HeaderObject from "./HeaderObject";

type OnDragOverProps = {
  event: DragEvent<HTMLDivElement>;
  header: HeaderObject;
  throttledHandleDragOver: (header: HeaderObject, event: DragEvent) => void;
};

export default OnDragOverProps;
