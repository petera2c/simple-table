import { DragEvent } from "react";
import HeaderObject from "../types/HeaderObject";
import DragHandlerProps from "../types/DragHandlerProps";
declare const useDragHandler: ({ draggedHeaderRef, headersRef, hoveredHeaderRef, onTableHeaderDragEnd, }: DragHandlerProps) => {
    handleDragStart: (header: HeaderObject) => void;
    handleDragOver: ({ event, hoveredHeader, }: {
        event: DragEvent<HTMLDivElement>;
        hoveredHeader: HeaderObject;
    }) => void;
    handleDragEnd: () => void;
};
export default useDragHandler;
