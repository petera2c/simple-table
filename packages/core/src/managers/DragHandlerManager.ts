import ColumnDef, { Accessor } from "../types/ColumnDef";
import type { Pinned } from "../types/Pinned";
import { deepClone } from "../utils/generalUtils";
import { findParentHeader } from "../utils/collapseUtils";

export const getHeaderIndexPath = (
  headers: ColumnDef[],
  targetAccessor: Accessor,
  currentPath: number[] = [],
): number[] | null => {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (header.accessor === targetAccessor) {
      return [...currentPath, i];
    }
    if (header.children && header.children.length > 0) {
      const path = getHeaderIndexPath(header.children, targetAccessor, [...currentPath, i]);
      if (path) return path;
    }
  }
  return null;
};

export const getSiblingArray = (headers: ColumnDef[], indexPath: number[]): ColumnDef[] => {
  let current = headers;
  for (let i = 0; i < indexPath.length - 1; i++) {
    current = current[indexPath[i]].children!;
  }
  return current;
};

export const setSiblingArray = (
  headers: ColumnDef[],
  indexPath: number[],
  newSiblings: ColumnDef[],
): ColumnDef[] => {
  if (indexPath.length === 1) {
    return newSiblings;
  }
  let current = headers;
  for (let i = 0; i < indexPath.length - 2; i++) {
    current = current[indexPath[i]].children!;
  }
  current[indexPath[indexPath.length - 2]].children = newSiblings;
  return headers;
};

/** Pinned side of the root column that owns this header (nested leaves inherit parent pin). */
const getRootPinnedForSection = (
  header: ColumnDef,
  rootHeaders: ColumnDef[],
): Pinned | undefined => {
  if (header.pinned) return header.pinned;
  const parent = findParentHeader(rootHeaders, header.accessor);
  return parent ? getRootPinnedForSection(parent, rootHeaders) : undefined;
};

export const getHeaderSection = (
  header: ColumnDef,
  rootHeaders: ColumnDef[],
): "left" | "main" | "right" => {
  const p = getRootPinnedForSection(header, rootHeaders);
  if (p === "left") return "left";
  if (p === "right") return "right";
  return "main";
};

export const updateHeaderPinnedProperty = (
  header: ColumnDef,
  targetSection: "left" | "main" | "right",
): ColumnDef => {
  const updatedHeader = { ...header };
  if (targetSection === "left") {
    updatedHeader.pinned = "left";
  } else if (targetSection === "right") {
    updatedHeader.pinned = "right";
  } else {
    delete updatedHeader.pinned;
  }
  return updatedHeader;
};

export function swapHeaders(
  headers: ColumnDef[],
  draggedPath: number[],
  hoveredPath: number[],
): { newHeaders: ColumnDef[]; emergencyBreak: boolean } {
  const newHeaders = deepClone(headers);
  let emergencyBreak = false;

  function getHeaderAtPath(headers: ColumnDef[], path: number[]): ColumnDef {
    let current = headers;
    let header: ColumnDef | undefined;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].children!;
    }
    header = current[path[path.length - 1]];
    return header;
  }

  function setHeaderAtPath(headers: ColumnDef[], path: number[], value: ColumnDef): void {
    let current = headers;
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]].children) {
        current = current[path[i]].children!;
      } else {
        emergencyBreak = true;
        break;
      }
    }
    current[path[path.length - 1]] = value;
  }

  const draggedHeader = getHeaderAtPath(newHeaders, draggedPath);
  const hoveredHeader = getHeaderAtPath(newHeaders, hoveredPath);

  setHeaderAtPath(newHeaders, draggedPath, hoveredHeader);
  setHeaderAtPath(newHeaders, hoveredPath, draggedHeader);

  return { newHeaders, emergencyBreak };
}

export function insertHeaderAcrossSections({
  headers,
  draggedHeader,
  hoveredHeader,
}: {
  headers: ColumnDef[];
  draggedHeader: ColumnDef;
  hoveredHeader: ColumnDef;
}): { newHeaders: ColumnDef[]; emergencyBreak: boolean } {
  const newHeaders = deepClone(headers);
  let emergencyBreak = false;

  try {
    const hoveredSection = getHeaderSection(hoveredHeader, newHeaders);

    const draggedIndex = newHeaders.findIndex((h) => h.accessor === draggedHeader.accessor);
    const hoveredIndex = newHeaders.findIndex((h) => h.accessor === hoveredHeader.accessor);

    if (draggedIndex === -1 || hoveredIndex === -1) {
      emergencyBreak = true;
      return { newHeaders, emergencyBreak };
    }

    const [removedHeader] = newHeaders.splice(draggedIndex, 1);
    const updatedDraggedHeader = updateHeaderPinnedProperty(removedHeader, hoveredSection);

    let insertionIndex = hoveredIndex;

    if (draggedIndex < hoveredIndex) {
      // Keep the original hovered index to place dragged at target's original position
    } else {
      // Dragged was after hovered, hovered position is unchanged after removal
    }

    newHeaders.splice(insertionIndex, 0, updatedDraggedHeader);
  } catch (error) {
    console.error("Error in insertHeaderAcrossSections:", error);
    emergencyBreak = true;
  }

  return { newHeaders, emergencyBreak };
}

