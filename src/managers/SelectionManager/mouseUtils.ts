import type Cell from "../../types/Cell";

/**
 * Calculate the nearest cell to a given mouse position.
 */
export function calculateNearestCell(
  clientX: number,
  clientY: number,
): Cell | null {
  const tableContainer = document.querySelector(".st-body-container");
  if (!tableContainer) return null;

  const rect = tableContainer.getBoundingClientRect();
  const cells = Array.from(
    document.querySelectorAll(
      ".st-cell[data-row-index][data-col-index]:not(.st-selection-cell)",
    ),
  );

  if (cells.length === 0) return null;

  const clampedX = Math.max(rect.left, Math.min(rect.right, clientX));
  const clampedY = Math.max(rect.top, Math.min(rect.bottom, clientY));

  let closestCell: HTMLElement | null = null;
  let minDistance = Infinity;

  cells.forEach((cell) => {
    if (!(cell instanceof HTMLElement)) return;
    const htmlCell = cell as HTMLElement;

    const cellRect = htmlCell.getBoundingClientRect();
    const cellCenterX = cellRect.left + cellRect.width / 2;
    const cellCenterY = cellRect.top + cellRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(cellCenterX - clampedX, 2) +
        Math.pow(cellCenterY - clampedY, 2),
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestCell = htmlCell;
    }
  });

  if (closestCell !== null) {
    const cellElement: HTMLElement = closestCell;
    const rowIndex = parseInt(
      cellElement.getAttribute("data-row-index") || "-1",
      10,
    );
    const colIndex = parseInt(
      cellElement.getAttribute("data-col-index") || "-1",
      10,
    );
    const rowId = cellElement.getAttribute("data-row-id");

    if (rowIndex >= 0 && colIndex >= 0 && rowId !== null) {
      return { rowIndex, colIndex, rowId };
    }
  }

  return null;
}

/**
 * Get cell from mouse position (element under point, or nearest cell).
 */
export function getCellFromMousePosition(
  clientX: number,
  clientY: number,
): Cell | null {
  const element = document.elementFromPoint(clientX, clientY);
  if (!element) return null;

  const cellElement = element.closest(".st-cell");

  if (cellElement instanceof HTMLElement) {
    const rowIndex = parseInt(
      cellElement.getAttribute("data-row-index") || "-1",
      10,
    );
    const colIndex = parseInt(
      cellElement.getAttribute("data-col-index") || "-1",
      10,
    );
    const rowId = cellElement.getAttribute("data-row-id");

    if (rowIndex >= 0 && colIndex >= 0 && rowId !== null) {
      return { rowIndex, colIndex, rowId };
    }
  }

  return calculateNearestCell(clientX, clientY);
}

/**
 * Handle auto-scrolling when dragging near table edges.
 */
export function handleAutoScroll(clientX: number, clientY: number): void {
  const tableContainer = document.querySelector(".st-body-container");
  if (!tableContainer) return;

  const rect = tableContainer.getBoundingClientRect();
  const scrollMargin = 50;
  const scrollSpeed = 10;

  if (clientY < rect.top + scrollMargin) {
    const distance = Math.max(0, rect.top - clientY);
    const speedMultiplier = Math.min(3, 1 + distance / 100);
    tableContainer.scrollTop -= scrollSpeed * speedMultiplier;
  } else if (clientY > rect.bottom - scrollMargin) {
    const distance = Math.max(0, clientY - rect.bottom);
    const speedMultiplier = Math.min(3, 1 + distance / 100);
    tableContainer.scrollTop += scrollSpeed * speedMultiplier;
  }

  const mainBody = document.querySelector(".st-body-main");
  if (mainBody) {
    if (clientX < rect.left + scrollMargin) {
      const distance = Math.max(0, rect.left - clientX);
      const speedMultiplier = Math.min(3, 1 + distance / 100);
      mainBody.scrollLeft -= scrollSpeed * speedMultiplier;
    } else if (clientX > rect.right - scrollMargin) {
      const distance = Math.max(0, clientX - rect.right);
      const speedMultiplier = Math.min(3, 1 + distance / 100);
      mainBody.scrollLeft += scrollSpeed * speedMultiplier;
    }
  }
}
