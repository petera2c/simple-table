import HeaderObject from "../types/HeaderObject";
import UseTableHeaderCellProps from "../types/UseTableHeaderCellProps";

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
    if (isUpdating) {
      return;
    }

    hoveredHeaderRef.current = hoveredHeader;

    if (
      hoveredHeader.accessor !== draggedHeaderRef.current?.accessor &&
      draggedHeaderRef.current !== null
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

      if (JSON.stringify(newHeaders) !== JSON.stringify(headersRef.current)) {
        onTableHeaderDragEnd(newHeaders);

        setTimeout(() => {
          isUpdating = false;
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
