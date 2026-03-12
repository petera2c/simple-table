import HeaderObject from "../../types/HeaderObject";
import { ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import {
  areAllChildrenHidden,
  findAndMarkParentsVisible,
  updateParentHeaders,
  buildColumnVisibilityState,
  findClosestValidSeparatorIndex,
  FlattenedHeader,
} from "./columnEditorUtils";
import {
  getSiblingArray,
  setSiblingArray,
  insertHeaderAcrossSections,
} from "../../managers/DragHandlerManager";
import { deepClone } from "../generalUtils";
import { createCheckbox } from "./createCheckbox";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";

const DRAG_ICON_SVG = `<svg
  aria-hidden="true"
  role="img"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 16 10"
  style="height: 10px; width: 16px;"
>
  <circle cx="3" cy="3" r="1.5" fill="currentColor" />
  <circle cx="8" cy="3" r="1.5" fill="currentColor" />
  <circle cx="13" cy="3" r="1.5" fill="currentColor" />
  <circle cx="3" cy="7" r="1.5" fill="currentColor" />
  <circle cx="8" cy="7" r="1.5" fill="currentColor" />
  <circle cx="13" cy="7" r="1.5" fill="currentColor" />
</svg>`;

const EXPAND_ICON_SVG = `<svg
  viewBox="0 0 24 24"
  width="24"
  height="24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
</svg>`;

export interface CreateColumnEditorRowOptions {
  allHeaders: HeaderObject[];
  depth: number;
  doesAnyHeaderHaveChildren: boolean;
  draggingRow: FlattenedHeader | null;
  getDraggingRow?: () => FlattenedHeader | null;
  getHoveredSeparatorIndex?: () => number | null;
  expandedHeaders: Set<string>;
  flattenedHeaders: FlattenedHeader[];
  forceExpanded: boolean;
  header: HeaderObject;
  hoveredSeparatorIndex: number | null;
  rowIndex: number;
  setDraggingRow: (row: FlattenedHeader | null) => void;
  setExpandedHeaders: (headers: Set<string>) => void;
  setHoveredSeparatorIndex: (index: number | null) => void;
  columnEditorConfig: ColumnEditorConfig;
  headers: HeaderObject[];
  setHeaders: (headers: HeaderObject[]) => void;
  onColumnVisibilityChange?: (state: ColumnVisibilityState) => void;
  onColumnOrderChange?: (headers: HeaderObject[]) => void;
}

export const createColumnEditorRow = (options: CreateColumnEditorRowOptions) => {
  const {
    allHeaders,
    depth,
    doesAnyHeaderHaveChildren,
    draggingRow,
    getDraggingRow,
    getHoveredSeparatorIndex,
    expandedHeaders,
    flattenedHeaders,
    forceExpanded,
    header,
    hoveredSeparatorIndex,
    rowIndex,
    setDraggingRow,
    setExpandedHeaders,
    setHoveredSeparatorIndex,
    headers,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
  } = options;

  const fragment = document.createDocumentFragment();
  const paddingLeft = `${depth * 16}px`;
  const hasChildren = header.children && header.children.length > 0;

  const isChecked = !(
    header.hide ||
    (hasChildren && header.children && areAllChildrenHidden(header.children))
  );

  const isExpanded = expandedHeaders.has(header.accessor);
  const shouldExpand = forceExpanded || isExpanded;

  if (rowIndex === 0) {
    const topSeparator = document.createElement("div");
    topSeparator.className = "st-column-editor-drag-separator";
    topSeparator.style.opacity = hoveredSeparatorIndex === -1 ? "1" : "0";
    fragment.appendChild(topSeparator);
  }

  const rowContainer = document.createElement("div");
  rowContainer.className = "st-header-checkbox-item";
  rowContainer.style.paddingLeft = paddingLeft;
  rowContainer.draggable = true;

  const handleCheckboxChange = (checked: boolean) => {
    header.hide = !checked;

    if (!checked) {
      updateParentHeaders(allHeaders);
    } else {
      findAndMarkParentsVisible(allHeaders, header.accessor);

      if (hasChildren && header.children && header.children.length > 0) {
        const allChildrenCurrentlyHidden = header.children.every((child) => child.hide === true);

        if (allChildrenCurrentlyHidden && header.children[0]) {
          header.children[0].hide = false;
          findAndMarkParentsVisible(allHeaders, header.children[0].accessor);
        }
      }
    }

    const updatedHeaders = [...headers];
    setHeaders(deepClone(updatedHeaders));

    if (onColumnVisibilityChange) {
      const visibilityState = buildColumnVisibilityState(updatedHeaders);
      onColumnVisibilityChange(visibilityState);
    }
  };

  const toggleExpanded = (e: Event) => {
    e.stopPropagation();
    if (forceExpanded) return;

    const newExpanded = new Set(expandedHeaders);
    if (isExpanded) {
      newExpanded.delete(header.accessor);
    } else {
      newExpanded.add(header.accessor);
    }
    setExpandedHeaders(newExpanded);
  };

  const onDragStart = (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
    }
    setDraggingRow(flattenedHeaders[rowIndex]);
  };

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault();
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    const currentDraggingRow = getDraggingRow ? getDraggingRow() : draggingRow;

    if (currentDraggingRow) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const mouseY = event.clientY;
      const rowMiddle = rect.top + rect.height / 2;
      const isTopHalfOfRow = mouseY < rowMiddle;

      const validSeparatorIndex = findClosestValidSeparatorIndex({
        flattenedHeaders,
        draggingRow: currentDraggingRow,
        hoveredRowIndex: rowIndex,
        isTopHalfOfRow,
      });

      setHoveredSeparatorIndex(validSeparatorIndex);
    }
  };

  const onDragEnd = () => {
    const currentDraggingRow = getDraggingRow ? getDraggingRow() : draggingRow;
    const currentHoveredSeparatorIndex = getHoveredSeparatorIndex
      ? getHoveredSeparatorIndex()
      : hoveredSeparatorIndex;

    const cancelDrag = () => {
      setDraggingRow(null);
      setHoveredSeparatorIndex(null);
    };

    if (!currentDraggingRow || currentHoveredSeparatorIndex === null) {
      cancelDrag();
      return;
    }

    const targetRowIndex =
      currentDraggingRow.visualIndex >= currentHoveredSeparatorIndex
        ? currentHoveredSeparatorIndex + 1
        : currentHoveredSeparatorIndex;

    let hoveredHeader = flattenedHeaders[targetRowIndex];
    if (!hoveredHeader) {
      cancelDrag();
      return;
    }

    if (currentDraggingRow.depth < hoveredHeader.depth && hoveredHeader.parent) {
      const parentIndex = flattenedHeaders.findIndex(
        (h) => h.header.accessor === hoveredHeader.parent!.accessor,
      );
      if (parentIndex !== -1) {
        hoveredHeader = flattenedHeaders[parentIndex];
      }
    }

    if (currentDraggingRow.header.accessor === hoveredHeader.header.accessor) {
      cancelDrag();
      return;
    }

    const { newHeaders, emergencyBreak } = insertHeaderAcrossSections({
      headers: getSiblingArray(headers, currentDraggingRow.indexPath),
      draggedHeader: currentDraggingRow.header,
      hoveredHeader: hoveredHeader.header,
    });

    if (emergencyBreak) {
      cancelDrag();
      return;
    }

    const updatedHeaders = setSiblingArray(
      deepClone(headers),
      currentDraggingRow.indexPath,
      newHeaders,
    );

    onColumnOrderChange?.(updatedHeaders);
    setHeaders(updatedHeaders);
    cancelDrag();
  };

  rowContainer.addEventListener("dragstart", onDragStart);
  rowContainer.addEventListener("dragenter", onDragEnter);
  rowContainer.addEventListener("dragover", onDragOver);
  rowContainer.addEventListener("dragend", onDragEnd);

  if (doesAnyHeaderHaveChildren) {
    const iconContainer = document.createElement("div");
    iconContainer.className = "st-header-icon-container";

    if (hasChildren) {
      const expandIcon = document.createElement("div");
      expandIcon.className = `st-collapsible-header-icon st-expand-icon-container ${
        shouldExpand ? "expanded" : "collapsed"
      }`;
      expandIcon.innerHTML = EXPAND_ICON_SVG;
      expandIcon.addEventListener("click", toggleExpanded);
      iconContainer.appendChild(expandIcon);
    }

    rowContainer.appendChild(iconContainer);
  }

  const checkboxObj = createCheckbox({
    checked: isChecked,
    onChange: handleCheckboxChange,
  });
  rowContainer.appendChild(checkboxObj.element);

  const dragIcon = document.createElement("div");
  dragIcon.className = "st-drag-icon-container";
  dragIcon.innerHTML = DRAG_ICON_SVG;
  rowContainer.appendChild(dragIcon);

  const label = document.createElement("div");
  label.className = "st-column-label-container";
  label.textContent = header.label;
  rowContainer.appendChild(label);

  fragment.appendChild(rowContainer);

  const bottomSeparator = document.createElement("div");
  bottomSeparator.className = "st-column-editor-drag-separator";
  bottomSeparator.style.opacity = hoveredSeparatorIndex === rowIndex ? "1" : "0";
  fragment.appendChild(bottomSeparator);

  return fragment;
};
