import { calculateSeparatorTopPosition } from "../../utils/infiniteScrollUtils";
import { useRef } from "react";

const TableRowSeparator = ({
  displayStrongBorder,
  position,
  rowHeight,
  templateColumns,
  rowIndex,
}: {
  displayStrongBorder?: boolean;
  position: number;
  rowHeight: number;
  templateColumns: string;
  rowIndex?: number;
}) => {
  const targetCellRef = useRef<HTMLElement | null>(null);

  const handleSeparatorMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // Use elementFromPoint to find which cell is underneath the click position
    // Temporarily disable pointer events on the separator so we can see through it
    const separatorElement = event.currentTarget as HTMLElement;
    const originalPointerEvents = separatorElement.style.pointerEvents;
    separatorElement.style.pointerEvents = "none";

    // Find the element at the click position (should be a cell)
    const elementUnderClick = document.elementFromPoint(event.clientX, event.clientY);

    // Restore pointer events
    separatorElement.style.pointerEvents = originalPointerEvents;

    if (!elementUnderClick) return;

    // Find the closest cell element
    const cellElement = elementUnderClick.closest(".st-cell");

    if (cellElement instanceof HTMLElement) {
      targetCellRef.current = cellElement;

      // Get the actual bounding rect of the target cell for accurate positioning
      const cellRect = cellElement.getBoundingClientRect();

      // Calculate the mouse position - use the original X position
      // and a Y position in the middle of the cell for reliable detection
      const clientX = event.clientX;
      const clientY = cellRect.top + cellRect.height / 2;

      // Dispatch mousedown event with proper coordinates to the cell
      const mouseDownEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0, // Left click
        clientX: clientX,
        clientY: clientY,
      });
      cellElement.dispatchEvent(mouseDownEvent);
    }
  };

  const handleSeparatorMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only dispatch mouseup if we have a target cell from the mousedown
    if (targetCellRef.current) {
      // Get the cell's position for accurate coordinates
      const cellRect = targetCellRef.current.getBoundingClientRect();

      const mouseUpEvent = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0, // Left click
        clientX: event.clientX,
        clientY: cellRect.top + cellRect.height / 2,
      });
      targetCellRef.current.dispatchEvent(mouseUpEvent);
      targetCellRef.current = null; // Clear the reference
    }
  };

  return (
    <div
      className={`st-row-separator ${displayStrongBorder ? "st-last-group-row" : ""}`}
      onMouseDown={handleSeparatorMouseDown}
      onMouseUp={handleSeparatorMouseUp}
      style={{
        gridTemplateColumns: templateColumns,
        transform: `translate3d(0, ${calculateSeparatorTopPosition({ position, rowHeight })}px, 0)`,
      }}
    >
      <div style={{ gridColumn: "1 / -1" }} />
    </div>
  );
};

export default TableRowSeparator;
