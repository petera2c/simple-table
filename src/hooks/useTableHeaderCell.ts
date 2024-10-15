import HeaderObject from "../types/HeaderObject";

interface UseTableHeaderCellProps {
  draggedHeaderRef: React.MutableRefObject<HeaderObject | null>;
  headersRef: React.RefObject<HeaderObject[]>;
  hoveredHeaderRef: React.MutableRefObject<HeaderObject | null>;
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
}
var isUpdating = false;

const useTableHeaderCell = ({
  draggedHeaderRef,
  headersRef,
  hoveredHeaderRef,
  onTableHeaderDragEnd,
}: UseTableHeaderCellProps) => {
  const handleDragStart = (header: HeaderObject) => {
    draggedHeaderRef.current = header;
  };

  const updateHeaders = (hoveredHeader: HeaderObject) => {
    if (isUpdating) return;
    hoveredHeaderRef.current = hoveredHeader;

    if (
      hoveredHeader.accessor !== draggedHeaderRef.current?.accessor &&
      draggedHeaderRef.current !== null &&
      !isUpdating
    ) {
      isUpdating = true;
      if (!headersRef.current) return;

      const newHeaders = [...headersRef.current];
      const draggedHeaderIndex = newHeaders.findIndex(
        (header) => header.accessor === draggedHeaderRef.current?.accessor
      );
      const hoveredHeaderIndex = newHeaders.findIndex(
        (header) => header.accessor === hoveredHeader.accessor
      );

      if (draggedHeaderIndex === undefined || hoveredHeaderIndex === undefined)
        return;

      const [draggedHeader] = newHeaders.splice(draggedHeaderIndex, 1);
      newHeaders.splice(hoveredHeaderIndex, 0, draggedHeader);

      // Check if the newHeaders array is different from the original headers array
      if (JSON.stringify(newHeaders) !== JSON.stringify(headersRef.current)) {
        setTimeout(() => {
          onTableHeaderDragEnd(newHeaders);

          setTimeout(() => {
            isUpdating = false;
          }, 500);
        }, 50);
      }
    }
  };

  const handleDragOver = (hoveredHeader: HeaderObject) => {
    updateHeaders(hoveredHeader);
  };

  const handleDragEnd = () => {
    draggedHeaderRef.current = null;
    hoveredHeaderRef.current = null;
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

export default useTableHeaderCell;
