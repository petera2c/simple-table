import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import { FlattenedHeader } from "../../types/FlattenedHeader";

export type { FlattenedHeader };

export const findAndMarkParentsVisible = (
  headers: HeaderObject[],
  childAccessor: Accessor,
  visited: Set<string> = new Set(),
) => {
  for (const header of headers) {
    if (visited.has(header.accessor)) continue;
    visited.add(header.accessor);

    if (header.children && header.children.length > 0) {
      const hasDirectChild = header.children.some((child) => child.accessor === childAccessor);

      let hasNestedChild = false;
      if (!hasDirectChild) {
        for (const child of header.children) {
          findAndMarkParentsVisible([child], childAccessor, visited);
          if (child.hide === false) {
            hasNestedChild = true;
            break;
          }
        }
      }

      if (hasDirectChild || hasNestedChild) {
        header.hide = false;
      }
    }
  }
};

export const areAllChildrenHidden = (children: HeaderObject[]) => {
  return children.every((child) => child.hide);
};

export const updateParentHeaders = (headers: HeaderObject[]) => {
  headers.forEach((header) => {
    if (header.children && header.children.length > 0) {
      updateParentHeaders(header.children);

      const allChildrenHidden = areAllChildrenHidden(header.children);

      if (allChildrenHidden) {
        header.hide = true;
      }
    }
  });
};

export const buildColumnVisibilityState = (headers: HeaderObject[]): ColumnVisibilityState => {
  const visibilityState: ColumnVisibilityState = {};

  const processHeader = (header: HeaderObject) => {
    visibilityState[header.accessor] = !header.hide;

    if (header.children && header.children.length > 0) {
      header.children.forEach(processHeader);
    }
  };

  headers.forEach(processHeader);
  return visibilityState;
};

export const findClosestValidSeparatorIndex = ({
  flattenedHeaders,
  draggingRow,
  hoveredRowIndex,
  isTopHalfOfRow,
}: {
  flattenedHeaders: FlattenedHeader[];
  draggingRow: FlattenedHeader;
  hoveredRowIndex: number;
  isTopHalfOfRow: boolean;
}): number | null => {
  const hoveredRow = flattenedHeaders[hoveredRowIndex];

  if (hoveredRow.depth === draggingRow.depth) {
    if (hoveredRow.parent?.accessor !== draggingRow.parent?.accessor) {
      return null;
    }

    if (isTopHalfOfRow || hoveredRow.header.children) {
      return hoveredRowIndex - 1;
    } else {
      return hoveredRowIndex;
    }
  } else if (draggingRow.depth < hoveredRow.depth) {
    let currentRow = hoveredRow;
    let currentIndex = hoveredRowIndex;

    while (currentRow.parent && currentRow.depth > draggingRow.depth) {
      const parentAccessor = currentRow.parent.accessor;
      const parentIndex = flattenedHeaders.findIndex((fh) => fh.header.accessor === parentAccessor);

      if (parentIndex === -1) break;

      currentRow = flattenedHeaders[parentIndex];
      currentIndex = parentIndex;
    }

    const subtreeStartIndex = currentIndex;
    let subtreeEndIndex = currentIndex;

    for (let i = currentIndex + 1; i < flattenedHeaders.length; i++) {
      if (flattenedHeaders[i].depth <= currentRow.depth) {
        break;
      }
      subtreeEndIndex = i;
    }

    const subtreeSize = subtreeEndIndex - subtreeStartIndex + 1;
    const hoveredPositionInSubtree = hoveredRowIndex - subtreeStartIndex;

    let isInTopHalfOfSubtree = hoveredPositionInSubtree < subtreeSize / 2;

    if (subtreeSize % 2 === 1) {
      const middleIndex = Math.floor(subtreeSize / 2);
      if (hoveredPositionInSubtree === middleIndex) {
        isInTopHalfOfSubtree = isTopHalfOfRow;
      }
    }

    if (isInTopHalfOfSubtree) {
      return currentIndex - 1;
    } else {
      return subtreeEndIndex;
    }
  } else {
    return null;
  }
};
