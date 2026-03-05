import HeaderObject, { Accessor } from "../types/HeaderObject";
import { deepClone } from "../utils/generalUtils";
import PreviousValueTracker from "../hooks/previousValue";

const REVERT_TO_PREVIOUS_HEADERS_DELAY = 1500;

export const getHeaderIndexPath = (
  headers: HeaderObject[],
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

export const getSiblingArray = (headers: HeaderObject[], indexPath: number[]): HeaderObject[] => {
  let current = headers;
  for (let i = 0; i < indexPath.length - 1; i++) {
    current = current[indexPath[i]].children!;
  }
  return current;
};

export const setSiblingArray = (
  headers: HeaderObject[],
  indexPath: number[],
  newSiblings: HeaderObject[],
): HeaderObject[] => {
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

export const getHeaderSection = (header: HeaderObject): "left" | "main" | "right" => {
  if (header.pinned === "left") return "left";
  if (header.pinned === "right") return "right";
  return "main";
};

export const updateHeaderPinnedProperty = (
  header: HeaderObject,
  targetSection: "left" | "main" | "right",
): HeaderObject => {
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
  headers: HeaderObject[],
  draggedPath: number[],
  hoveredPath: number[],
): { newHeaders: HeaderObject[]; emergencyBreak: boolean } {
  const newHeaders = deepClone(headers);
  let emergencyBreak = false;

  function getHeaderAtPath(headers: HeaderObject[], path: number[]): HeaderObject {
    let current = headers;
    let header: HeaderObject | undefined;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].children!;
    }
    header = current[path[path.length - 1]];
    return header;
  }

  function setHeaderAtPath(headers: HeaderObject[], path: number[], value: HeaderObject): void {
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
  headers: HeaderObject[];
  draggedHeader: HeaderObject;
  hoveredHeader: HeaderObject;
}): { newHeaders: HeaderObject[]; emergencyBreak: boolean } {
  const newHeaders = deepClone(headers);
  let emergencyBreak = false;

  try {
    const hoveredSection = getHeaderSection(hoveredHeader);

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
  headers: HeaderObject[];
  onTableHeaderDragEnd: (newHeaders: HeaderObject[]) => void;
  onColumnOrderChange?: (newHeaders: HeaderObject[]) => void;
  onHeadersChange?: (newHeaders: HeaderObject[]) => void;
}

export class DragHandlerManager {
  private config: DragHandlerManagerConfig;
  private draggedHeader: HeaderObject | null = null;
  private hoveredHeader: HeaderObject | null = null;
  private prevUpdateTime: number = Date.now();
  private prevDraggingPosition = { screenX: 0, screenY: 0 };
  private prevHeadersTracker: PreviousValueTracker<HeaderObject[] | null>;

  constructor(config: DragHandlerManagerConfig) {
    this.config = config;
    this.prevHeadersTracker = new PreviousValueTracker<HeaderObject[] | null>(config.headers);
  }

  updateConfig(config: Partial<DragHandlerManagerConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.headers) {
      this.prevHeadersTracker.update(config.headers);
    }
  }

  getDraggedHeader(): HeaderObject | null {
    return this.draggedHeader;
  }

  getHoveredHeader(): HeaderObject | null {
    return this.hoveredHeader;
  }

  handleDragStart(header: HeaderObject): void {
    this.draggedHeader = header;
    this.prevUpdateTime = Date.now();
  }

  handleDragOver({
    event,
    hoveredHeader,
  }: {
    event: DragEvent;
    hoveredHeader: HeaderObject;
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

    const draggedSection = getHeaderSection(draggedHeader);
    const hoveredSection = getHeaderSection(hoveredHeader);
    const isCrossSectionDrag = draggedSection !== hoveredSection;

    let newHeaders: HeaderObject[];
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

    setTimeout(() => {
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
