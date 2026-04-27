import HeaderObject from "../../types/HeaderObject";
import { ColumnEditorConfig } from "../../types/ColumnEditorConfig";
import { ColumnEditorRowRendererComponents } from "../../types/ColumnEditorRowRendererProps";
import {
  areAllChildrenHidden,
  findAndMarkParentsVisible,
  updateParentHeaders,
  buildColumnVisibilityState,
  findClosestValidSeparatorIndex,
  FlattenedHeader,
} from "./columnEditorUtils";
import { swapHeaders } from "../../managers/DragHandlerManager";
import { deepClone } from "../generalUtils";
import { createCheckbox } from "./createCheckbox";
import { ColumnVisibilityState } from "../../types/ColumnVisibilityTypes";
import {
  isHeaderEssential,
  moveRootColumnPinSide,
  validateFullHeaderTreeEssentialOrder,
  PanelSection,
} from "../pinnedColumnUtils";
import { createAngleRightIcon } from "../../icons";
import { updateExpandIconState } from "../bodyCell/expansion";

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

export interface CreateColumnEditorRowOptions {
  allHeaders: HeaderObject[];
  clearHoverSeparator?: () => void;
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
  panelSection?: PanelSection;
  rowIndex: number;
  setDraggingRow: (row: FlattenedHeader | null) => void;
  setExpandedHeaders: (headers: Set<string>) => void;
  setHoveredSeparatorIndex: (index: number | null) => void;
  columnEditorConfig: ColumnEditorConfig;
  essentialAccessors?: ReadonlySet<string>;
  headers: HeaderObject[];
  setHeaders: (headers: HeaderObject[]) => void;
  onColumnVisibilityChange?: (state: ColumnVisibilityState) => void;
  onColumnOrderChange?: (headers: HeaderObject[]) => void;
  /** When set (e.g. after expand toggle), used with updateExpandIconState so the chevron animates like table cells. */
  previousExpandedHeaders?: ReadonlySet<string>;
}

export interface CreateColumnEditorRowResult {
  fragment: DocumentFragment;
  /** Run after the row fragment is connected to the document (e.g. listEl.appendChild). */
  scheduleExpandIconAnimation?: () => void;
}

export const createColumnEditorRow = (options: CreateColumnEditorRowOptions): CreateColumnEditorRowResult => {
  const {
    allHeaders,
    clearHoverSeparator,
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
    panelSection,
    rowIndex,
    setDraggingRow,
    setExpandedHeaders,
    setHoveredSeparatorIndex,
    headers,
    setHeaders,
    onColumnVisibilityChange,
    onColumnOrderChange,
    previousExpandedHeaders,
  } = options;

  const essentialAccessors: ReadonlySet<string> = options.essentialAccessors ?? new Set();
  const allowColumnPinning = options.columnEditorConfig.allowColumnPinning !== false;
  const isEssential = isHeaderEssential(header, essentialAccessors);
  const canToggleVisibility = !isEssential;

  const fragment = document.createDocumentFragment();
  const paddingLeft = `${depth * 16}px`;
  const hasChildren = header.children && header.children.length > 0;

  const isChecked = !(
    header.hide ||
    (hasChildren && header.children && areAllChildrenHidden(header.children))
  );

  const isExpanded = expandedHeaders.has(header.accessor);
  const shouldExpand = forceExpanded || isExpanded;

  let scheduleExpandIconAnimation: (() => void) | undefined;

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

  const applyHeaderOrder = (updatedHeaders: HeaderObject[]): boolean => {
    if (
      essentialAccessors.size > 0 &&
      !validateFullHeaderTreeEssentialOrder(updatedHeaders, essentialAccessors)
    ) {
      return false;
    }
    onColumnOrderChange?.(updatedHeaders);
    setHeaders(updatedHeaders);
    return true;
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (!canToggleVisibility) return;

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
    clearHoverSeparator?.();
    setDraggingRow(flattenedHeaders[rowIndex]);
  };

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault();
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    const currentDraggingRow = getDraggingRow ? getDraggingRow() : draggingRow;

    if (currentDraggingRow && currentDraggingRow.panelSection === panelSection) {
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

    if (
      !currentDraggingRow ||
      currentHoveredSeparatorIndex === null ||
      currentDraggingRow.panelSection !== panelSection
    ) {
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

    const haveSameParent =
      currentDraggingRow.indexPath.length === hoveredHeader.indexPath.length &&
      (currentDraggingRow.indexPath.length === 1 ||
        currentDraggingRow.indexPath
          .slice(0, -1)
          .every((idx, i) => idx === hoveredHeader.indexPath[i]));

    if (!haveSameParent) {
      cancelDrag();
      return;
    }

    let updatedHeaders: HeaderObject[];

    if (currentDraggingRow.indexPath.length === 1) {
      // Root-level drag within the same panel section: use swapHeaders
      const { newHeaders, emergencyBreak } = swapHeaders(
        headers,
        currentDraggingRow.indexPath,
        hoveredHeader.indexPath,
      );
      if (emergencyBreak) {
        cancelDrag();
        return;
      }
      updatedHeaders = newHeaders;
    } else {
      // Nested drag: swap siblings
      const { newHeaders, emergencyBreak } = swapHeaders(
        headers,
        currentDraggingRow.indexPath,
        hoveredHeader.indexPath,
      );
      if (emergencyBreak) {
        cancelDrag();
        return;
      }
      updatedHeaders = newHeaders;
    }

    applyHeaderOrder(updatedHeaders);
    cancelDrag();
  };

  rowContainer.addEventListener("dragstart", onDragStart);
  rowContainer.addEventListener("dragenter", onDragEnter);
  rowContainer.addEventListener("dragover", onDragOver);
  rowContainer.addEventListener("dragend", onDragEnd);

  // Build expand icon (if applicable)
  let expandIconEl: HTMLElement | undefined;
  if (doesAnyHeaderHaveChildren) {
    const iconContainer = document.createElement("div");
    iconContainer.className = "st-header-icon-container";

    if (hasChildren) {
      const wasExpandedForIcon =
        previousExpandedHeaders !== undefined
          ? forceExpanded || previousExpandedHeaders.has(header.accessor)
          : shouldExpand;
      const shouldAnimateExpandIcon =
        !forceExpanded &&
        previousExpandedHeaders !== undefined &&
        wasExpandedForIcon !== shouldExpand;

      const iconShowsExpanded = shouldAnimateExpandIcon ? wasExpandedForIcon : shouldExpand;

      const expandIcon = document.createElement("div");
      // NOTE: deliberately not using `st-collapsible-header-icon` here. That class
      // applies a 180° rotation when expanded (used for in-table column-group
      // collapsing where siblings sit horizontally). In the popout, children
      // appear vertically below the parent, so we want the generic
      // `.st-expand-icon-container.expanded` 90° rotation (chevron points down)
      // — same behavior as body-row expand icons.
      expandIcon.className = `st-column-editor-expand-icon st-expand-icon-container ${
        iconShowsExpanded ? "expanded" : "collapsed"
      }`;
      expandIcon.setAttribute("role", "button");
      expandIcon.setAttribute("tabindex", "0");
      expandIcon.setAttribute("aria-expanded", String(iconShowsExpanded));
      expandIcon.setAttribute(
        "aria-label",
        iconShowsExpanded ? `Collapse ${header.label} column` : `Expand ${header.label} column`,
      );
      expandIcon.appendChild(createAngleRightIcon("st-expand-icon"));
      expandIcon.addEventListener("click", toggleExpanded);
      expandIcon.addEventListener("keydown", (event: Event) => {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === "Enter" || keyEvent.key === " ") {
          keyEvent.preventDefault();
          toggleExpanded(event);
        }
      });
      iconContainer.appendChild(expandIcon);
      expandIconEl = expandIcon;

      if (shouldAnimateExpandIcon) {
        scheduleExpandIconAnimation = () => {
          updateExpandIconState(rowContainer, shouldExpand, {
            ariaLabelWhenExpanded: `Collapse ${header.label} column`,
            ariaLabelWhenCollapsed: `Expand ${header.label} column`,
            syncAriaExpanded: true,
          });
        };
      }
    }

    if (!options.columnEditorConfig.rowRenderer) {
      rowContainer.appendChild(iconContainer);
    }
  }

  const checkboxObj = createCheckbox({
    checked: isChecked,
    onChange: handleCheckboxChange,
  });
  if (!canToggleVisibility) {
    checkboxObj.element.classList.add("st-checkbox-disabled");
    checkboxObj.element.style.pointerEvents = "none";
  }

  const dragIcon = document.createElement("div");
  dragIcon.className = "st-drag-icon-container";
  dragIcon.innerHTML = DRAG_ICON_SVG;

  const label = document.createElement("div");
  label.className = "st-column-label-container";
  label.textContent = header.label;

  // Pin controls — only for root-level columns (depth === 0) when pinning is enabled
  const pinnedSide = header.pinned === "left" || header.pinned === "right" ? header.pinned : null;
  const canUnpin = Boolean(pinnedSide) && !isEssential;
  const canPinLeft = !pinnedSide && panelSection === "main";
  const canPinRight = !pinnedSide && panelSection === "main";

  const pinLeft = () => {
    const next = moveRootColumnPinSide(headers, header.accessor, "left", essentialAccessors);
    if (next) applyHeaderOrder(next);
  };

  const pinRight = () => {
    const next = moveRootColumnPinSide(headers, header.accessor, "right", essentialAccessors);
    if (next) applyHeaderOrder(next);
  };

  const unpin = () => {
    const next = moveRootColumnPinSide(headers, header.accessor, "main", essentialAccessors);
    if (next) applyHeaderOrder(next);
  };

  const { rowRenderer } = options.columnEditorConfig;
  if (rowRenderer) {
    // Delegate full row layout to the custom renderer
    const components: ColumnEditorRowRendererComponents = {
      expandIcon: expandIconEl,
      checkbox: checkboxObj.element as HTMLElement,
      dragIcon: dragIcon as HTMLElement,
      labelContent: label as HTMLElement,
    };
    const rendered = rowRenderer({
      accessor: header.accessor,
      header,
      components,
      panelSection,
      isEssential,
      canToggleVisibility,
      allowColumnPinning,
      pinControl: allowColumnPinning && depth === 0
        ? { pinnedSide, canPinLeft, canPinRight, canUnpin, pinLeft, pinRight, unpin }
        : undefined,
    });
    if (rendered instanceof HTMLElement) {
      rowContainer.appendChild(rendered);
    } else if (typeof rendered === "string") {
      rowContainer.innerHTML = rendered;
    }
  } else {
    // Default layout
    rowContainer.appendChild(checkboxObj.element);
    rowContainer.appendChild(dragIcon);
    rowContainer.appendChild(label);

    if (allowColumnPinning && depth === 0) {
      const pinGroup = document.createElement("div");
      pinGroup.className = "st-column-pin-side-group";
      // Same as checkbox: row is draggable; stop mousedown/dragstart so L/R clicks register.
      pinGroup.addEventListener("mousedown", (e: MouseEvent) => {
        e.stopPropagation();
      });
      pinGroup.addEventListener("dragstart", (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      });

      if (pinnedSide) {
        const pinnedMark = document.createElement("div");
        const isPinnedEssential = isEssential;
        pinnedMark.className = `st-column-pin-btn st-column-pin-side st-column-pin-pinned-active${
          isPinnedEssential ? " st-column-pin-pinned-essential" : ""
        }`;
        pinnedMark.textContent = pinnedSide === "left" ? "L" : "R";
        pinnedMark.title = isPinnedEssential
          ? "Essential column — cannot be unpinned"
          : `Unpin column`;
        if (canUnpin) {
          pinnedMark.addEventListener("click", (e) => {
            e.stopPropagation();
            unpin();
          });
        }
        pinGroup.appendChild(pinnedMark);
      } else {
        if (canPinLeft) {
          const pinLeftBtn = document.createElement("button");
          pinLeftBtn.type = "button";
          pinLeftBtn.className = "st-column-pin-btn st-column-pin-side st-column-pin-side-option";
          pinLeftBtn.textContent = "L";
          pinLeftBtn.title = "Pin column to left";
          pinLeftBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            pinLeft();
          });
          pinGroup.appendChild(pinLeftBtn);
        }

        if (canPinRight) {
          const pinRightBtn = document.createElement("button");
          pinRightBtn.type = "button";
          pinRightBtn.className = "st-column-pin-btn st-column-pin-side st-column-pin-side-option";
          pinRightBtn.textContent = "R";
          pinRightBtn.title = "Pin column to right";
          pinRightBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            pinRight();
          });
          pinGroup.appendChild(pinRightBtn);
        }
      }

      rowContainer.appendChild(pinGroup);
    }
  }

  fragment.appendChild(rowContainer);

  const bottomSeparator = document.createElement("div");
  bottomSeparator.className = "st-column-editor-drag-separator";
  bottomSeparator.style.opacity = hoveredSeparatorIndex === rowIndex ? "1" : "0";
  fragment.appendChild(bottomSeparator);

  return { fragment, scheduleExpandIconAnimation };
};
