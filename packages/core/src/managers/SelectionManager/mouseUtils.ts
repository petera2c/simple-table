import type Cell from "../../types/Cell";

/**
 * Calculate the nearest cell to a given mouse position.
 * Uses row buckets: one getBoundingClientRect per row to find the row, then only
 * measures cells in that row (O(rows + cols) instead of O(rows * cols)).
 */
export function calculateNearestCell(
  clientX: number,
  clientY: number,
): Cell | null {
  const tableContainer = document.querySelector(".st-body-container");
  if (!tableContainer) return null;

  const rect = tableContainer.getBoundingClientRect();
  const clampedX = Math.max(rect.left, Math.min(rect.right, clientX));
  const clampedY = Math.max(rect.top, Math.min(rect.bottom, clientY));

  const cellElements = document.querySelectorAll<HTMLElement>(
    ".st-cell[data-row-index][data-col-index][data-row-id]:not(.st-selection-cell)",
  );
  if (cellElements.length === 0) return null;

  // Group cells by row (use rowId so we merge same row across sections if needed)
  const byRow = new Map<string, HTMLElement[]>();
  for (let i = 0; i < cellElements.length; i++) {
    const el = cellElements[i];
    const rowId = el.getAttribute("data-row-id");
    const key = rowId ?? el.getAttribute("data-row-index") ?? "";
    if (!key) continue;
    let list = byRow.get(key);
    if (!list) {
      list = [];
      byRow.set(key, list);
    }
    list.push(el);
  }

  // One getBoundingClientRect per row to get Y bounds
  const rowBounds: { key: string; top: number; bottom: number }[] = [];
  byRow.forEach((cells, key) => {
    const r = cells[0].getBoundingClientRect();
    rowBounds.push({ key, top: r.top, bottom: r.bottom });
  });
  rowBounds.sort((a, b) => a.top - b.top);

  // Find row that contains clampedY (or closest)
  let bestRowKey: string | null = null;
  let bestRowDistance = Infinity;
  for (let i = 0; i < rowBounds.length; i++) {
    const { key, top, bottom } = rowBounds[i];
    if (clampedY >= top && clampedY <= bottom) {
      bestRowKey = key;
      bestRowDistance = 0;
      break;
    }
    const mid = (top + bottom) / 2;
    const d = Math.abs(clampedY - mid);
    if (d < bestRowDistance) {
      bestRowDistance = d;
      bestRowKey = key;
    }
  }

  if (bestRowKey === null) return null;
  const rowCells = byRow.get(bestRowKey);
  if (!rowCells || rowCells.length === 0) return null;

  // Only measure cells in the chosen row
  let closestCell: HTMLElement | null = null;
  let minDistance = Infinity;
  for (let i = 0; i < rowCells.length; i++) {
    const htmlCell = rowCells[i];
    const rowIndex = parseInt(htmlCell.getAttribute("data-row-index") ?? "-1", 10);
    const colIndex = parseInt(htmlCell.getAttribute("data-col-index") ?? "-1", 10);
    const rowId = htmlCell.getAttribute("data-row-id");
    if (rowIndex < 0 || colIndex < 0 || rowId == null || rowId === "") continue;

    const cellRect = htmlCell.getBoundingClientRect();
    const cellCenterX = cellRect.left + cellRect.width / 2;
    const cellCenterY = cellRect.top + cellRect.height / 2;

    const distance = Math.sqrt(
      (cellCenterX - clampedX) ** 2 + (cellCenterY - clampedY) ** 2,
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestCell = htmlCell;
    }
  }

  if (closestCell !== null) {
    const rowIndex = parseInt(
      closestCell.getAttribute("data-row-index") || "-1",
      10,
    );
    const colIndex = parseInt(
      closestCell.getAttribute("data-col-index") || "-1",
      10,
    );
    const rowId = closestCell.getAttribute("data-row-id");
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
 * @param root - Table root (e.g. `.simple-table-root`); limits queries to this instance.
 */
export function handleAutoScroll(
  clientX: number,
  clientY: number,
  root: Document | HTMLElement = document,
): void {
  const tableContainer = root.querySelector(".st-body-container");
  if (!tableContainer) return;

  const rect = tableContainer.getBoundingClientRect();
  const scrollMargin = 50;
  const scrollSpeed = 10;

  const maxScrollTop = Math.max(
    0,
    tableContainer.scrollHeight - tableContainer.clientHeight,
  );

  if (clientY < rect.top + scrollMargin) {
    const distance = Math.max(0, rect.top - clientY);
    const speedMultiplier = Math.min(3, 1 + distance / 100);
    tableContainer.scrollTop = Math.max(
      0,
      tableContainer.scrollTop - scrollSpeed * speedMultiplier,
    );
  } else if (clientY > rect.bottom - scrollMargin) {
    const distance = Math.max(0, clientY - rect.bottom);
    const speedMultiplier = Math.min(3, 1 + distance / 100);
    tableContainer.scrollTop = Math.min(
      maxScrollTop,
      tableContainer.scrollTop + scrollSpeed * speedMultiplier,
    );
  }

  const mainBody = root.querySelector(".st-body-main");
  if (mainBody) {
    const maxScrollLeft = Math.max(
      0,
      mainBody.scrollWidth - mainBody.clientWidth,
    );
    if (clientX < rect.left + scrollMargin) {
      const distance = Math.max(0, rect.left - clientX);
      const speedMultiplier = Math.min(3, 1 + distance / 100);
      mainBody.scrollLeft = Math.max(
        0,
        mainBody.scrollLeft - scrollSpeed * speedMultiplier,
      );
    } else if (clientX > rect.right - scrollMargin) {
      const distance = Math.max(0, clientX - rect.right);
      const speedMultiplier = Math.min(3, 1 + distance / 100);
      mainBody.scrollLeft = Math.min(
        maxScrollLeft,
        mainBody.scrollLeft + scrollSpeed * speedMultiplier,
      );
    }
  }
}
