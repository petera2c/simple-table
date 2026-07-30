import ColumnDef, { Accessor } from "../types/ColumnDef";
import type { Pinned } from "../types/Pinned";
import { deepClone } from "../utils/generalUtils";
import PreviousValueTracker from "../hooks/previousValue";
import { validateFullHeaderTreeEssentialOrder } from "../utils/pinnedColumnUtils";
import { findParentHeader } from "../utils/collapseUtils";

const REVERT_TO_PREVIOUS_HEADERS_DELAY = 1500;

/** Cleared on the next dragstart so a rapid A→B handoff isn't interrupted by A's dragend commit. */
let dragEndCommitTimeoutId: ReturnType<typeof setTimeout> | null = null;

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

/**
 * Reorder siblings by moving the dragged header to the hovered index
 * (remove + insert), shifting everything in between by one slot.
 *
 * Historically this pairwise-swapped the two headers. That made the hovered
 * (non-dragged) column fly to the dragged slot while intermediates stayed put —
 * which reads as "weird animations on columns that aren't being dragged" when
 * the cursor jumps across several columns.
 */
export function swapHeaders(
  headers: ColumnDef[],
  draggedPath: number[],
  hoveredPath: number[],
): { newHeaders: ColumnDef[]; emergencyBreak: boolean } {
  const newHeaders = deepClone(headers);

  if (draggedPath.length !== hoveredPath.length) {
    return { newHeaders, emergencyBreak: true };
  }
  for (let i = 0; i < draggedPath.length - 1; i++) {
    if (draggedPath[i] !== hoveredPath[i]) {
      return { newHeaders, emergencyBreak: true };
    }
  }

  const fromIndex = draggedPath[draggedPath.length - 1];
  const toIndex = hoveredPath[hoveredPath.length - 1];
  if (fromIndex === toIndex) {
    return { newHeaders, emergencyBreak: false };
  }

  const siblings = getSiblingArray(newHeaders, draggedPath);
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= siblings.length ||
    toIndex >= siblings.length
  ) {
    return { newHeaders, emergencyBreak: true };
  }

  const [removed] = siblings.splice(fromIndex, 1);
  siblings.splice(toIndex, 0, removed);
  return { newHeaders: setSiblingArray(newHeaders, draggedPath, siblings), emergencyBreak: false };
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

export interface DragHandlerManagerConfig {
  headers: ColumnDef[];
  essentialAccessors?: ReadonlySet<string>;
  onTableHeaderDragEnd: (newHeaders: ColumnDef[]) => void;
  onColumnOrderChange?: (newHeaders: ColumnDef[]) => void;
  onHeadersChange?: (newHeaders: ColumnDef[]) => void;
}

export class DragHandlerManager {
  private config: DragHandlerManagerConfig;
  private draggedHeader: ColumnDef | null = null;
  private hoveredHeader: ColumnDef | null = null;
  private prevUpdateTime: number = Date.now();
  private prevDraggingPosition = { screenX: 0, screenY: 0 };
  private prevHeadersTracker: PreviousValueTracker<ColumnDef[] | null>;

  constructor(config: DragHandlerManagerConfig) {
    this.config = config;
    this.prevHeadersTracker = new PreviousValueTracker<ColumnDef[] | null>(config.headers);
  }

  updateConfig(config: Partial<DragHandlerManagerConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.headers) {
      this.prevHeadersTracker.update(config.headers);
    }
  }

  getDraggedHeader(): ColumnDef | null {
    return this.draggedHeader;
  }

  getHoveredHeader(): ColumnDef | null {
    return this.hoveredHeader;
  }

  handleDragStart(header: ColumnDef): void {
    if (dragEndCommitTimeoutId !== null) {
      clearTimeout(dragEndCommitTimeoutId);
      dragEndCommitTimeoutId = null;
    }
    this.draggedHeader = header;
    this.prevUpdateTime = Date.now();
  }

  handleDragOver({
    event,
    hoveredHeader,
  }: {
    event: DragEvent;
    hoveredHeader: ColumnDef;
  }): void {
    event.preventDefault();

    if (!this.config.headers || !this.draggedHeader) return;

    const { screenX, screenY } = event;
    const distance = Math.sqrt(
      Math.pow(screenX - this.prevDraggingPosition.screenX, 2) +
        Math.pow(screenY - this.prevDraggingPosition.screenY, 2),
    );

    this.hoveredHeader = hoveredHeader;

    const draggedHeader = this.draggedHeader;

    const draggedSection = getHeaderSection(draggedHeader, this.config.headers);
    const hoveredSection = getHeaderSection(hoveredHeader, this.config.headers);
    const isCrossSectionDrag = draggedSection !== hoveredSection;

    let newHeaders: ColumnDef[];
    let emergencyBreak = false;

    if (isCrossSectionDrag) {
      const result = insertHeaderAcrossSections({
        headers: this.config.headers,
        draggedHeader,
        hoveredHeader,
      });
      newHeaders = result.newHeaders;
      emergencyBreak = result.emergencyBreak;
    } else {
      const currentHeaders = this.config.headers;

      const draggedHeaderIndexPath = getHeaderIndexPath(currentHeaders, draggedHeader.accessor);
      const hoveredHeaderIndexPath = getHeaderIndexPath(currentHeaders, hoveredHeader.accessor);

      if (!draggedHeaderIndexPath || !hoveredHeaderIndexPath) return;

      const draggedHeaderDepth = draggedHeaderIndexPath.length;
      const hoveredHeaderDepth = hoveredHeaderIndexPath.length;

      let targetHoveredIndexPath = hoveredHeaderIndexPath;

      if (draggedHeaderDepth !== hoveredHeaderDepth) {
        const depthDifference = hoveredHeaderDepth - draggedHeaderDepth;
        if (depthDifference > 0) {
          targetHoveredIndexPath = hoveredHeaderIndexPath.slice(0, -depthDifference);
        }
      }

      const haveSameParent = (path1: number[], path2: number[]): boolean => {
        if (path1.length !== path2.length) return false;
        if (path1.length === 1) return true;
        return path1.slice(0, -1).every((index, i) => index === path2[i]);
      };

      if (!haveSameParent(draggedHeaderIndexPath, targetHoveredIndexPath)) {
        return;
      }

      const result = swapHeaders(currentHeaders, draggedHeaderIndexPath, targetHoveredIndexPath);
      newHeaders = result.newHeaders;
      emergencyBreak = result.emergencyBreak;
    }

    if (
      hoveredHeader.accessor === draggedHeader.accessor ||
      distance < 10 ||
      JSON.stringify(newHeaders) === JSON.stringify(this.config.headers) ||
      emergencyBreak
    )
      return;

    const essentialAccessors = this.config.essentialAccessors;
    if (
      essentialAccessors &&
      essentialAccessors.size > 0 &&
      !validateFullHeaderTreeEssentialOrder(newHeaders, essentialAccessors)
    ) {
      return;
    }

    const now = Date.now();
    const prevHeaders = this.prevHeadersTracker.get();
    const arePreviousHeadersAndNewHeadersTheSame =
      JSON.stringify(newHeaders) === JSON.stringify(prevHeaders);
    const shouldRevertToPreviousHeaders = now - this.prevUpdateTime < REVERT_TO_PREVIOUS_HEADERS_DELAY;

    if (
      arePreviousHeadersAndNewHeadersTheSame &&
      (shouldRevertToPreviousHeaders || distance < 40)
    ) {
      return;
    }

    this.prevUpdateTime = now;
    this.prevDraggingPosition = { screenX, screenY };

    this.config.onTableHeaderDragEnd(newHeaders);
  }

  handleDragEnd(): void {
    this.draggedHeader = null;
    this.hoveredHeader = null;

    if (dragEndCommitTimeoutId !== null) {
      clearTimeout(dragEndCommitTimeoutId);
    }
    dragEndCommitTimeoutId = setTimeout(() => {
      dragEndCommitTimeoutId = null;
      // Skip if a new drag already started (rapid column handoff mid-FLIP).
      if (this.draggedHeader) return;
      if (this.config.onHeadersChange) {
        this.config.onHeadersChange([...this.config.headers]);
      }
      if (this.config.onColumnOrderChange) {
        this.config.onColumnOrderChange(this.config.headers);
      }
    }, 10);
  }

  destroy(): void {
    this.draggedHeader = null;
    this.hoveredHeader = null;
  }
}
