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
    if (rowIndex === undefined) return;

    const separatorElement = event.currentTarget;
    const rect = separatorElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    // Parse the grid template columns to get column widths
    const columnWidths = templateColumns.split(" ").map((width) => {
      if (width.includes("px")) {
        return parseFloat(width);
      } else if (width.includes("fr")) {
        // For fractional units, estimate equal width
        const frCount = templateColumns.split(" ").filter((w) => w.includes("fr")).length;
        return rect.width / frCount;
      }
      return 100; // fallback width
    });

    // Calculate which column was clicked
    let accumulatedWidth = 0;
    let targetColumnIndex = 0;

    for (let i = 0; i < columnWidths.length; i++) {
      if (clickX <= accumulatedWidth + columnWidths[i]) {
        targetColumnIndex = i;
        break;
      }
      accumulatedWidth += columnWidths[i];
      targetColumnIndex = i;
    }

    // Generate the cell ID and dispatch mousedown
    const cellId = `cell-${rowIndex + 1}-${targetColumnIndex + 1}`;
    const cellElement = document.getElementById(cellId);

    if (cellElement) {
      targetCellRef.current = cellElement;

      // Dispatch mousedown event
      const mouseDownEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0, // Left click
      });
      cellElement.dispatchEvent(mouseDownEvent);
    }
  };

  const handleSeparatorMouseUp = () => {
    // Only dispatch mouseup if we have a target cell from the mousedown
    if (targetCellRef.current) {
      const mouseUpEvent = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0, // Left click
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
        top: calculateSeparatorTopPosition({ position, rowHeight }),
      }}
    >
      <div style={{ gridColumn: "1 / -1" }} />
    </div>
  );
};

export default TableRowSeparator;
