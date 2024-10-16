/// <reference types="react" />
import HeaderObject from "../types/HeaderObject";
interface UseTableHeaderCellProps {
    draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
    headersRef: React.RefObject<HeaderObject[]>;
    hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
    onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
}
declare const useTableHeaderCell: ({ draggedHeaderRef, headersRef, hoveredHeaderRef, onTableHeaderDragEnd, }: UseTableHeaderCellProps) => {
    handleDragStart: (header: HeaderObject) => void;
    handleDragOver: (hoveredHeader: HeaderObject) => void;
    handleDragEnd: () => void;
};
export default useTableHeaderCell;
