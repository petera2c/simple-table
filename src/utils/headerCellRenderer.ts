import { MutableRefObject, Dispatch, SetStateAction, RefObject } from "react";
import HeaderObject, { Accessor } from "../types/HeaderObject";
import SortColumn from "../types/SortColumn";
import { TableFilterState, FilterCondition } from "../types/FilterTypes";
import { IconsConfig } from "../types/IconsConfig";
import { getCellId } from "./cellUtils";
import { getHeaderLeafIndices, getColumnRange, getHeaderDescriptionId, getHeaderDescription } from "./headerUtils";
import { calculateHeaderContentWidth } from "./headerWidthUtils";
import { 
  getHeaderIndexPath, 
  getSiblingArray, 
  setSiblingArray, 
  swapHeaders, 
  insertHeaderAcrossSections,
  getHeaderSection 
} from "../hooks/useDragHandler";
import { handleResizeStart } from "./resizeUtils";
import { HandleResizeStartProps } from "../types/HandleResizeStartProps";
import { DRAG_THROTTLE_LIMIT } from "../consts/general-consts";
import { hasCollapsibleChildren } from "./collapseUtils";
import { DEFAULT_SHOW_WHEN } from "../types/HeaderObject";
import Row from "../types/Row";

export interface AbsoluteCell {
  header: HeaderObject;
  left: number;
  top: number;
  width: number;
  height: number;
  colIndex: number;
  parentHeader?: HeaderObject;
}

export interface HeaderRenderContext {
  collapsedHeaders: Set<Accessor>;
  columnBorders: boolean;
  columnReordering: boolean;
  columnResizing: boolean;
  containerWidth: number;
  enableHeaderEditing?: boolean;
  enableRowSelection?: boolean;
  filters: TableFilterState;
  icons: IconsConfig;
  selectedColumns: Set<number>;
  columnsWithSelectedCells: Set<number>;
  sort: SortColumn | null;
  autoExpandColumns?: boolean;
  selectableColumns?: boolean;
  headers: HeaderObject[];
  rows: Row[];
  headerHeight: number;
  onSort: (accessor: Accessor) => void;
  handleApplyFilter: (filter: FilterCondition) => void;
  handleClearFilter: (accessor: Accessor) => void;
  handleSelectAll?: (checked: boolean) => void;
  setCollapsedHeaders: Dispatch<SetStateAction<Set<Accessor>>>;
  setHeaders: Dispatch<SetStateAction<HeaderObject[]>>;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
  onColumnWidthChange?: (headers: HeaderObject[]) => void;
  onColumnOrderChange?: (headers: HeaderObject[]) => void;
  onTableHeaderDragEnd: (headers: HeaderObject[]) => void;
  onHeaderEdit?: (header: HeaderObject, newLabel: string) => void;
  onColumnSelect?: (header: HeaderObject) => void;
  selectColumns?: (columnIndices: number[]) => void;
  setSelectedColumns: Dispatch<SetStateAction<Set<number>>>;
  setSelectedCells: Dispatch<SetStateAction<Set<string>>>;
  setInitialFocusedCell: (cell: any) => void;
  areAllRowsSelected?: () => boolean;
  draggedHeaderRef: MutableRefObject<HeaderObject | null>;
  hoveredHeaderRef: MutableRefObject<HeaderObject | null>;
  headerRegistry?: Map<string, { setEditing: (editing: boolean) => void }>;
  reverse?: boolean;
  pinned?: "left" | "right";
  forceUpdate: () => void;
  mainBodyRef: RefObject<HTMLDivElement>;
  pinnedLeftRef: RefObject<HTMLDivElement>;
  pinnedRightRef: RefObject<HTMLDivElement>;
}

interface EventListenerEntry {
  element: HTMLElement;
  event: string;
  handler: EventListener;
  options?: AddEventListenerOptions;
}

let eventListeners: EventListenerEntry[] = [];
let throttleLastCallTime = 0;
let prevUpdateTime = Date.now();
let prevDraggingPosition = { screenX: 0, screenY: 0 };
let prevHeaders: HeaderObject[] | null = null;

const REVERT_TO_PREVIOUS_HEADERS_DELAY = 1500;

const throttle = (callback: () => void, limit: number) => {
  const now = Date.now();
  if (throttleLastCallTime === 0 || now - throttleLastCallTime >= limit) {
    throttleLastCallTime = now;
    callback();
  }
};

const addTrackedEventListener = (
  element: HTMLElement,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) => {
  element.addEventListener(event, handler, options);
  eventListeners.push({ element, event, handler, options });
};

const cleanupEventListeners = () => {
  eventListeners.forEach(({ element, event, handler, options }) => {
    element.removeEventListener(event, handler, options);
  });
  eventListeners = [];
  throttleLastCallTime = 0;
};

// SVG icon data extracted from icon components
const SVG_ICONS = {
  sortUp: {
    viewBox: "0 0 320 512",
    path: "M298 177.5c3.8-8.8 2-19-4.6-26l-116-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-116 144c-6.6 7-8.4 17.2-4.6 26S34.4 192 44 192l72 0 0 288c0 17.7 14.3 32 32 32l24 0c17.7 0 32-14.3 32-32l0-288 72 0c9.6 0 18.2-5.7 22-14.5z",
    height: "1em",
  },
  sortDown: {
    viewBox: "0 0 320 512",
    path: "M22 334.5c-3.8 8.8-2 19 4.6 26l116 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l116-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L148 0C130.3 0 116 14.3 116 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z",
    height: "1em",
  },
  filter: {
    viewBox: "0 0 512 512",
    path: "M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z",
    height: "1em",
  },
  angleLeft: {
    viewBox: "0 0 24 24",
    path: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
    width: "24",
    height: "24",
  },
  angleRight: {
    viewBox: "0 0 24 24",
    path: "M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z",
    width: "24",
    height: "24",
  },
  check: {
    viewBox: "0 0 448 512",
    path: "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z",
    height: "10px",
  },
};

// Create SVG element from icon data
const createSVGIcon = (iconKey: keyof typeof SVG_ICONS, className?: string, style?: Partial<CSSStyleDeclaration>): SVGSVGElement => {
  const iconData = SVG_ICONS[iconKey];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("role", "img");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", iconData.viewBox);
  
  if (className) {
    svg.setAttribute("class", className);
  }
  
  if ("width" in iconData && iconData.width) {
    svg.style.width = iconData.width;
  }
  if (iconData.height) {
    svg.style.height = iconData.height;
  }
  
  if (style) {
    Object.assign(svg.style, style);
  }
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", iconData.path);
  
  svg.appendChild(path);
  return svg;
};

const createSortIcon = (header: HeaderObject, context: HeaderRenderContext): HTMLElement | null => {
  const { sort } = context;
  
  if (!sort || sort.key.accessor !== header.accessor) return null;
  
  const iconContainer = document.createElement("div");
  iconContainer.className = "st-icon-container";
  iconContainer.setAttribute("role", "button");
  iconContainer.setAttribute("tabindex", "0");
  iconContainer.setAttribute(
    "aria-label",
    `Sort ${header.label} ${sort.direction === "asc" ? "descending" : "ascending"}`
  );
  
  const svg = createSVGIcon(sort.direction === "asc" ? "sortUp" : "sortDown");
  iconContainer.appendChild(svg);
  
  const handleClick = (event: Event) => {
    event.stopPropagation();
    context.onSort(header.accessor);
  };
  
  addTrackedEventListener(iconContainer, "click", handleClick);
  
  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      context.onSort(header.accessor);
    }
  };
  
  addTrackedEventListener(iconContainer, "keydown", handleKeyDown);
  
  return iconContainer;
};

const createFilterIcon = (
  header: HeaderObject,
  context: HeaderRenderContext
): HTMLElement | null => {
  const { filters } = context;
  
  if (!header.filterable) return null;
  
  const currentFilter = filters[header.accessor];
  const iconContainer = document.createElement("div");
  iconContainer.className = "st-icon-container";
  iconContainer.setAttribute("role", "button");
  iconContainer.setAttribute("tabindex", "0");
  iconContainer.setAttribute("aria-label", `Filter ${header.label}`);
  iconContainer.setAttribute("aria-expanded", "false");
  iconContainer.setAttribute("aria-haspopup", "dialog");
  
  const svg = createSVGIcon("filter", undefined, {
    fill: currentFilter
      ? "var(--st-button-active-background-color)"
      : "var(--st-header-icon-color)",
  });
  iconContainer.appendChild(svg);
  
  let isFilterDropdownOpen = false;
  
  const handleFilterIconClick = (event: Event) => {
    event.stopPropagation();
    isFilterDropdownOpen = !isFilterDropdownOpen;
    iconContainer.setAttribute("aria-expanded", String(isFilterDropdownOpen));
    
    // TODO: Handle filter dropdown rendering
    console.log("Filter icon clicked for", header.accessor);
  };
  
  addTrackedEventListener(iconContainer, "click", handleFilterIconClick);
  
  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      handleFilterIconClick(event);
    }
  };
  
  addTrackedEventListener(iconContainer, "keydown", handleKeyDown);
  
  return iconContainer;
};

const createCollapseIcon = (header: HeaderObject, context: HeaderRenderContext): HTMLElement | null => {
  const { collapsedHeaders } = context;
  
  const isCollapsible = hasCollapsibleChildren(header);
  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;
  
  if (!isCollapsible || isSelectionColumn) return null;
  
  const isCollapsed = collapsedHeaders.has(header.accessor);
  const iconContainer = document.createElement("div");
  iconContainer.className = "st-icon-container st-collapse-icon-container";
  iconContainer.setAttribute("role", "button");
  iconContainer.setAttribute("tabindex", "0");
  iconContainer.setAttribute(
    "aria-label",
    `${isCollapsed ? "Expand" : "Collapse"} ${header.label} column`
  );
  iconContainer.setAttribute("aria-expanded", String(!isCollapsed));
  
  const svg = createSVGIcon(isCollapsed ? "angleRight" : "angleLeft");
  iconContainer.appendChild(svg);
  
  const handleCollapseToggle = (event: Event) => {
    event.stopPropagation();
    context.setCollapsedHeaders((prev) => {
      const newSet = new Set(prev);
      if (isCollapsed) {
        newSet.delete(header.accessor);
      } else {
        newSet.add(header.accessor);
      }
      return newSet;
    });
  };
  
  addTrackedEventListener(iconContainer, "click", handleCollapseToggle);
  
  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      handleCollapseToggle(event);
    }
  };
  
  addTrackedEventListener(iconContainer, "keydown", handleKeyDown);
  
  return iconContainer;
};

const createResizeHandle = (
  header: HeaderObject,
  context: HeaderRenderContext,
  isLastHeader: boolean
): HTMLElement | null => {
  const { columnResizing, reverse } = context;
  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;
  
  if (!columnResizing || isSelectionColumn || isLastHeader) return null;
  
  const resizeContainer = document.createElement("div");
  resizeContainer.className = "st-header-resize-handle-container";
  resizeContainer.setAttribute("role", "separator");
  resizeContainer.setAttribute("aria-label", `Resize ${header.label} column`);
  resizeContainer.setAttribute("aria-orientation", "vertical");
  
  const resizeHandle = document.createElement("div");
  resizeHandle.className = "st-header-resize-handle";
  resizeContainer.appendChild(resizeHandle);
  
  const handleMouseDown = (event: MouseEvent) => {
    const startWidth = document.getElementById(
      getCellId({ accessor: header.accessor, rowId: "header" })
    )?.offsetWidth;
    
    throttle(() => {
      handleResizeStart({
        autoExpandColumns: context.autoExpandColumns || false,
        collapsedHeaders: context.collapsedHeaders,
        containerWidth: context.containerWidth,
        event: event,
        forceUpdate: context.forceUpdate,
        header,
        headers: context.headers,
        mainBodyRef: context.mainBodyRef,
        onColumnWidthChange: context.onColumnWidthChange,
        pinnedLeftRef: context.pinnedLeftRef,
        pinnedRightRef: context.pinnedRightRef,
        reverse: reverse || false,
        setHeaders: context.setHeaders,
        setIsResizing: context.setIsResizing,
        startWidth: startWidth || 150,
      });
    }, 10);
  };
  
  addTrackedEventListener(resizeContainer, "mousedown", handleMouseDown as EventListener);
  
  const handleTouchStart = (event: Event) => {
    const touchEvent = event as globalThis.TouchEvent;
    const startWidth = document.getElementById(
      getCellId({ accessor: header.accessor, rowId: "header" })
    )?.offsetWidth;
    
    throttle(() => {
      handleResizeStart({
        autoExpandColumns: context.autoExpandColumns || false,
        collapsedHeaders: context.collapsedHeaders,
        containerWidth: context.containerWidth,
        event: touchEvent as any,
        forceUpdate: context.forceUpdate,
        header,
        headers: context.headers,
        mainBodyRef: context.mainBodyRef,
        onColumnWidthChange: context.onColumnWidthChange,
        pinnedLeftRef: context.pinnedLeftRef,
        pinnedRightRef: context.pinnedRightRef,
        reverse: reverse || false,
        setHeaders: context.setHeaders,
        setIsResizing: context.setIsResizing,
        startWidth: startWidth || 150,
      });
    }, 10);
  };
  
  addTrackedEventListener(resizeContainer, "touchstart", handleTouchStart);
  
  const handleDoubleClick = () => {
    const contentWidth = calculateHeaderContentWidth(header.accessor, {
      rows: context.rows,
      header,
      maxWidth: 500,
      sampleSize: 50,
    });
    
    const path = getHeaderIndexPath(context.headers, header.accessor);
    if (!path) return;
    
    const siblings = getSiblingArray(context.headers, path);
    const headerIndex = path[path.length - 1];
    
    const updatedSiblings = siblings.map((h, i) =>
      i === headerIndex ? { ...h, width: contentWidth } : h
    );
    
    const updatedHeaders = setSiblingArray(context.headers, path, updatedSiblings);
    context.setHeaders(updatedHeaders);
    
    if (context.onColumnWidthChange) {
      context.onColumnWidthChange(updatedHeaders);
    }
  };
  
  addTrackedEventListener(resizeContainer, "dblclick", handleDoubleClick as EventListener);
  
  return resizeContainer;
};

const createSelectionCheckbox = (context: HeaderRenderContext): HTMLElement => {
  const label = document.createElement("label");
  label.className = "st-checkbox-label";
  
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "st-checkbox-input";
  input.setAttribute("aria-label", "Select all rows");
  
  const checked = context.areAllRowsSelected ? context.areAllRowsSelected() : false;
  input.checked = checked;
  input.setAttribute("aria-checked", String(checked));
  
  const customCheckbox = document.createElement("span");
  customCheckbox.className = `st-checkbox-custom ${checked ? "st-checked" : ""}`;
  customCheckbox.setAttribute("aria-hidden", "true");
  
  if (checked) {
    const svg = createSVGIcon("check", "st-checkbox-checkmark");
    customCheckbox.appendChild(svg);
  }
  
  const handleChange = () => {
    const newChecked = !input.checked;
    if (context.handleSelectAll) {
      context.handleSelectAll(newChecked);
    }
  };
  
  addTrackedEventListener(input, "change", handleChange as EventListener);
  
  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === " ") {
      keyEvent.stopPropagation();
    }
  };
  
  addTrackedEventListener(input, "keydown", handleKeyDown);
  
  label.appendChild(input);
  label.appendChild(customCheckbox);
  
  return label;
};

const createEditableInput = (
  header: HeaderObject,
  context: HeaderRenderContext,
  labelContainer: HTMLElement
): HTMLInputElement => {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "st-header-edit-input";
  input.value = header.label || "";
  
  const updateHeaderLabel = (newLabel: string) => {
    const updatedHeaders = context.headers.map((h) =>
      h.accessor === header.accessor ? { ...h, label: newLabel } : h
    );
    context.setHeaders(updatedHeaders);
    
    if (context.onHeaderEdit) {
      context.onHeaderEdit(header, newLabel);
    }
  };
  
  const handleBlur = () => {
    const newLabel = input.value;
    if (newLabel !== header.label) {
      updateHeaderLabel(newLabel);
    }
    
    const textSpan = document.createElement("span");
    textSpan.className = `st-header-label-text ${
      header.align === "right"
        ? "right-aligned"
        : header.align === "center"
          ? "center-aligned"
          : "left-aligned"
    }`;
    textSpan.textContent = newLabel || header.label;
    
    labelContainer.innerHTML = "";
    labelContainer.appendChild(textSpan);
    
    if (context.headerRegistry && !header.isSelectionColumn) {
      const key = String(header.accessor);
      const entry = context.headerRegistry.get(key);
      if (entry) {
        entry.setEditing(false);
      }
    }
  };
  
  addTrackedEventListener(input, "blur", handleBlur as EventListener);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur();
    } else if (event.key === "Escape") {
      event.preventDefault();
      input.value = header.label || "";
      input.blur();
    }
  };
  
  addTrackedEventListener(input, "keydown", handleKeyDown as EventListener);
  
  setTimeout(() => input.focus(), 0);
  
  return input;
};

const createLabelContent = (
  header: HeaderObject,
  context: HeaderRenderContext
): HTMLElement => {
  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;
  
  const labelTextSpan = document.createElement("span");
  labelTextSpan.className = `st-header-label-text ${
    header.align === "right"
      ? "right-aligned"
      : header.align === "center"
        ? "center-aligned"
        : "left-aligned"
  }`;
  
  if (isSelectionColumn) {
    const checkbox = createSelectionCheckbox(context);
    labelTextSpan.appendChild(checkbox);
  } else {
    labelTextSpan.textContent = header.label || "";
  }
  
  if (header.tooltip && !isSelectionColumn) {
    labelTextSpan.setAttribute("title", header.tooltip);
    
    let tooltipElement: HTMLElement | null = null;
    let tooltipTimeout: NodeJS.Timeout | null = null;
    
    const showTooltip = () => {
      tooltipTimeout = setTimeout(() => {
        const rect = labelTextSpan.getBoundingClientRect();
        
        if (rect.width > 0 && rect.height > 0) {
          tooltipElement = document.createElement("div");
          tooltipElement.className = "st-tooltip";
          tooltipElement.textContent = header.tooltip || "";
          tooltipElement.style.position = "fixed";
          tooltipElement.style.zIndex = "10000";
          
          const tooltipWidth = 200;
          const tooltipHeight = 40;
          
          let left = rect.left + rect.width / 2 - tooltipWidth / 2;
          let top = rect.bottom + 8;
          
          if (left < 8) left = 8;
          else if (left + tooltipWidth > window.innerWidth - 8) {
            left = window.innerWidth - tooltipWidth - 8;
          }
          
          if (top + tooltipHeight > window.innerHeight - 8) {
            top = rect.top - tooltipHeight - 8;
          }
          
          tooltipElement.style.top = `${top}px`;
          tooltipElement.style.left = `${left}px`;
          
          document.body.appendChild(tooltipElement);
        }
      }, 500);
    };
    
    const hideTooltip = () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
      }
      if (tooltipElement) {
        document.body.removeChild(tooltipElement);
        tooltipElement = null;
      }
    };
    
    addTrackedEventListener(labelTextSpan, "mouseenter", showTooltip as EventListener);
    addTrackedEventListener(labelTextSpan, "mouseleave", hideTooltip as EventListener);
  }
  
  return labelTextSpan;
};

const handleColumnHeaderClick = (
  event: MouseEvent,
  header: HeaderObject,
  colIndex: number,
  context: HeaderRenderContext
) => {
  if (header.isSelectionColumn) return;
  
  if (context.selectableColumns) {
    const columnsToSelect = getHeaderLeafIndices(header, colIndex);
    
    const isHeaderAlreadySelected = columnsToSelect.some((columnIndex) =>
      context.selectedColumns.has(columnIndex)
    );
    
    if (context.enableHeaderEditing && isHeaderAlreadySelected && !event.shiftKey) {
      const cellElement = document.getElementById(
        getCellId({ accessor: header.accessor, rowId: "header" })
      );
      
      if (cellElement) {
        const labelElement = cellElement.querySelector(".st-header-label") as HTMLElement;
        if (labelElement) {
          const labelTextSpan = labelElement.querySelector(".st-header-label-text") as HTMLElement;
          if (labelTextSpan) {
            labelTextSpan.innerHTML = "";
            const input = createEditableInput(header, context, labelTextSpan);
            labelTextSpan.appendChild(input);
            
            if (context.headerRegistry && !header.isSelectionColumn) {
              const key = String(header.accessor);
              const entry = context.headerRegistry.get(key);
              if (entry) {
                entry.setEditing(true);
              }
            }
          }
        }
      }
      return;
    }
    
    if (event.shiftKey && context.selectColumns) {
      context.setSelectedColumns((prevSelected: Set<number>) => {
        if (prevSelected.size === 0) {
          return new Set(columnsToSelect);
        }
        
        const currentColumnIndex = columnsToSelect[0];
        const selectedIndices = Array.from(prevSelected).sort((a: number, b: number) => a - b);
        
        let nearestIndex = selectedIndices[0];
        let minDistance = Math.abs(currentColumnIndex - nearestIndex);
        
        selectedIndices.forEach((index: number) => {
          const distance = Math.abs(currentColumnIndex - index);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        });
        
        const columnsInRange = getColumnRange(nearestIndex, currentColumnIndex);
        const allColumnsToSelect = [...columnsInRange, ...columnsToSelect];
        
        return new Set([...Array.from(prevSelected), ...allColumnsToSelect]);
      });
    } else if (context.selectColumns) {
      context.selectColumns(columnsToSelect);
    }
    
    context.setSelectedCells(new Set());
    context.setInitialFocusedCell(null);
  }
  
  if (context.onColumnSelect) {
    context.onColumnSelect(header);
  }
  
  if (!context.selectableColumns && header.isSortable) {
    context.onSort(header.accessor);
  }
};

const handleColumnHeaderDoubleClick = (
  event: MouseEvent,
  header: HeaderObject,
  context: HeaderRenderContext
) => {
  if (header.isSelectionColumn) return;
  
  if (context.selectableColumns && header.isSortable) {
    context.onSort(header.accessor);
  }
};

const attachDragHandlers = (
  labelElement: HTMLElement,
  cellElement: HTMLElement,
  header: HeaderObject,
  context: HeaderRenderContext
) => {
  const { columnReordering, draggedHeaderRef, hoveredHeaderRef, headers } = context;
  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;
  
  if (!columnReordering || header.disableReorder || isSelectionColumn) return;
  
  labelElement.setAttribute("draggable", "true");
  
  const handleDragStart = (event: Event) => {
    draggedHeaderRef.current = header;
    prevUpdateTime = Date.now();
    cellElement.classList.add("st-dragging");
  };
  
  addTrackedEventListener(labelElement, "dragstart", handleDragStart);
  
  const handleDragEnd = (event: Event) => {
    event.preventDefault();
    draggedHeaderRef.current = null;
    hoveredHeaderRef.current = null;
    cellElement.classList.remove("st-dragging");
    
    setTimeout(() => {
      context.setHeaders((prev) => [...prev]);
      if (context.onColumnOrderChange) {
        context.onColumnOrderChange(context.headers);
      }
    }, 10);
  };
  
  addTrackedEventListener(labelElement, "dragend", handleDragEnd);
  
  const handleDragOver = (event: Event) => {
    const dragEvent = event as DragEvent;
    dragEvent.preventDefault();
    
    if (!headers || !draggedHeaderRef.current) return;
    
    throttle(() => {
      const animations = cellElement.getAnimations();
      const isAnimating = animations.some((animation) => animation.playState === "running");
      
      const { screenX, screenY } = dragEvent;
      const distance = Math.sqrt(
        Math.pow(screenX - prevDraggingPosition.screenX, 2) +
          Math.pow(screenY - prevDraggingPosition.screenY, 2)
      );
      
      hoveredHeaderRef.current = header;
      
      const draggedHeader = draggedHeaderRef.current;
      if (!draggedHeader) return;
      
      const draggedSection = getHeaderSection(draggedHeader);
      const hoveredSection = getHeaderSection(header);
      const isCrossSectionDrag = draggedSection !== hoveredSection;
      
      let newHeaders: HeaderObject[];
      let emergencyBreak = false;
      
      if (isCrossSectionDrag) {
        const result = insertHeaderAcrossSections({ headers, draggedHeader, hoveredHeader: header });
        newHeaders = result.newHeaders;
        emergencyBreak = result.emergencyBreak;
      } else {
        const draggedHeaderIndexPath = getHeaderIndexPath(headers, draggedHeader.accessor);
        const hoveredHeaderIndexPath = getHeaderIndexPath(headers, header.accessor);
        
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
        
        const result = swapHeaders(headers, draggedHeaderIndexPath, targetHoveredIndexPath);
        newHeaders = result.newHeaders;
        emergencyBreak = result.emergencyBreak;
      }
      
      if (
        isAnimating ||
        header.accessor === draggedHeader.accessor ||
        distance < 10 ||
        JSON.stringify(newHeaders) === JSON.stringify(headers) ||
        emergencyBreak
      ) {
        return;
      }
      
      const now = Date.now();
      const arePreviousHeadersAndNewHeadersTheSame =
        JSON.stringify(newHeaders) === JSON.stringify(prevHeaders);
      const shouldRevertToPreviousHeaders = now - prevUpdateTime < REVERT_TO_PREVIOUS_HEADERS_DELAY;
      
      if (
        arePreviousHeadersAndNewHeadersTheSame &&
        (shouldRevertToPreviousHeaders || distance < 40)
      ) {
        return;
      }
      
      prevUpdateTime = now;
      prevDraggingPosition = { screenX, screenY };
      prevHeaders = headers;
      
      context.onTableHeaderDragEnd(newHeaders);
    }, DRAG_THROTTLE_LIMIT);
  };
  
  addTrackedEventListener(cellElement, "dragover", handleDragOver);
  
  // Prevent drag ghost image
  const handleDragOverPrevention = (event: Event) => {
    event.preventDefault();
    const dragEvent = event as DragEvent;
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.dropEffect = "move";
    }
  };
  
  addTrackedEventListener(document.documentElement, "dragover", handleDragOverPrevention);
};

const createHeaderCellElement = (
  cell: AbsoluteCell,
  context: HeaderRenderContext,
  isLastHeader: boolean
): HTMLElement => {
  const { header, colIndex, parentHeader } = cell;
  const { 
    collapsedHeaders, 
    columnBorders, 
    columnReordering,
    enableHeaderEditing,
    selectedColumns,
    columnsWithSelectedCells,
    draggedHeaderRef,
    hoveredHeaderRef,
    reverse,
    headers,
  } = context;
  
  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;
  const clickable = Boolean(header?.isSortable);
  const isCollapsed = collapsedHeaders.has(header.accessor);
  
  const hasVisibleChildren = (() => {
    if (!header.children || header.children.length === 0) return false;
    
    if (isCollapsed) {
      return header.children.some((child) => {
        const showWhen = child.showWhen || DEFAULT_SHOW_WHEN;
        return showWhen === "parentCollapsed" || showWhen === "always";
      });
    }
    
    return true;
  })();
  
  const isSubHeader = parentHeader?.singleRowChildren;
  const shouldApplyParentClass = hasVisibleChildren && !header.singleRowChildren;
  
  const isLastColumnInSection = (() => {
    if (!columnBorders) return false;
    
    const pinnedLeftColumns = headers.filter((h) => h.pinned === "left");
    const mainColumns = headers.filter((h) => !h.pinned);
    const pinnedRightColumns = headers.filter((h) => h.pinned === "right");
    
    if (header.pinned === "left") {
      return pinnedLeftColumns[pinnedLeftColumns.length - 1]?.accessor === header.accessor;
    } else if (header.pinned === "right") {
      return pinnedRightColumns[pinnedRightColumns.length - 1]?.accessor === header.accessor;
    } else {
      return mainColumns[mainColumns.length - 1]?.accessor === header.accessor;
    }
  })();
  
  const isHeaderSelected = (() => {
    if (!context.selectableColumns || isSelectionColumn) return false;
    
    const columnsToSelect = getHeaderLeafIndices(header, colIndex);
    return columnsToSelect.some((columnIndex) => selectedColumns.has(columnIndex));
  })();
  
  const hasHighlightedCell = (() => {
    if (isSelectionColumn) return false;
    
    const columnsToCheck = getHeaderLeafIndices(header, colIndex);
    return columnsToCheck.some((columnIndex) => columnsWithSelectedCells.has(columnIndex));
  })();
  
  const classNames = [
    "st-header-cell",
    header.accessor === hoveredHeaderRef.current?.accessor ? "st-hovered" : "",
    draggedHeaderRef.current?.accessor === header.accessor ? "st-dragging" : "",
    clickable ? "clickable" : "",
    columnReordering && !clickable ? "columnReordering" : "",
    shouldApplyParentClass ? "parent" : "",
    isSubHeader ? "st-sub-header" : "",
    isLastColumnInSection ? "st-last-column" : "",
    enableHeaderEditing && !isSelectionColumn ? "st-header-editable" : "",
    isHeaderSelected ? "st-header-selected" : "",
    hasHighlightedCell && !isHeaderSelected ? "st-header-has-highlighted-cell" : "",
    isLastHeader ? "st-no-resize" : "",
  ].filter(Boolean).join(" ");
  
  const cellElement = document.createElement("div");
  cellElement.className = classNames;
  cellElement.id = getCellId({ accessor: header.accessor, rowId: "header" });
  cellElement.setAttribute("role", "columnheader");
  cellElement.setAttribute("aria-colindex", String(colIndex + 1));
  
  if (header.isSortable) {
    if (context.sort?.key.accessor === header.accessor) {
      cellElement.setAttribute("aria-sort", context.sort.direction === "asc" ? "ascending" : "descending");
    } else {
      cellElement.setAttribute("aria-sort", "none");
    }
  }
  
  const headerDescription = getHeaderDescription(header, Boolean(header.filterable));
  if (headerDescription) {
    const descriptionId = getHeaderDescriptionId(header.accessor);
    cellElement.setAttribute("aria-describedby", descriptionId);
    
    const descriptionSpan = document.createElement("span");
    descriptionSpan.id = descriptionId;
    descriptionSpan.className = "st-sr-only";
    descriptionSpan.textContent = headerDescription;
    cellElement.appendChild(descriptionSpan);
  }
  
  cellElement.style.position = "absolute";
  cellElement.style.left = `${cell.left}px`;
  cellElement.style.top = `${cell.top}px`;
  cellElement.style.width = `${cell.width}px`;
  cellElement.style.height = `${cell.height}px`;
  
  if (reverse) {
    const resizeHandle = createResizeHandle(header, context, isLastHeader);
    if (resizeHandle) {
      cellElement.appendChild(resizeHandle);
    }
  }
  
  const sortIcon = createSortIcon(header, context);
  const filterIcon = createFilterIcon(header, context);
  const collapseIcon = createCollapseIcon(header, context);
  
  if (!header.headerRenderer && header.align === "right") {
    if (collapseIcon) cellElement.appendChild(collapseIcon);
    if (filterIcon) cellElement.appendChild(filterIcon);
    if (sortIcon) cellElement.appendChild(sortIcon);
  }
  
  const labelElement = document.createElement("div");
  labelElement.className = "st-header-label";
  
  if (header.headerRenderer) {
    const labelContent = createLabelContent(header, context);
    labelElement.appendChild(labelContent);
  } else {
    const labelContent = createLabelContent(header, context);
    labelElement.appendChild(labelContent);
  }
  
  const handleClick = (event: MouseEvent) => {
    if (!isSelectionColumn) {
      handleColumnHeaderClick(event, header, colIndex, context);
    }
  };
  
  addTrackedEventListener(labelElement, "click", handleClick as EventListener);
  
  const handleDoubleClick = (event: MouseEvent) => {
    if (!isSelectionColumn) {
      handleColumnHeaderDoubleClick(event, header, context);
    }
  };
  
  addTrackedEventListener(labelElement, "dblclick", handleDoubleClick as EventListener);
  
  attachDragHandlers(labelElement, cellElement, header, context);
  
  cellElement.appendChild(labelElement);
  
  if (!header.headerRenderer && header.align !== "right") {
    if (sortIcon) cellElement.appendChild(sortIcon);
    if (filterIcon) cellElement.appendChild(filterIcon);
    if (collapseIcon) cellElement.appendChild(collapseIcon);
  }
  
  if (!reverse) {
    const resizeHandle = createResizeHandle(header, context, isLastHeader);
    if (resizeHandle) {
      cellElement.appendChild(resizeHandle);
    }
  }
  
  if (context.headerRegistry && !header.isSelectionColumn) {
    const key = String(header.accessor);
    context.headerRegistry.set(key, {
      setEditing: (editing: boolean) => {
        if (editing) {
          const labelTextSpan = labelElement.querySelector(".st-header-label-text") as HTMLElement;
          if (labelTextSpan) {
            labelTextSpan.innerHTML = "";
            const input = createEditableInput(header, context, labelTextSpan);
            labelTextSpan.appendChild(input);
          }
        }
      },
    });
  }
  
  return cellElement;
};

const getLastHeaderIndex = (absoluteCells: AbsoluteCell[]): number => {
  if (absoluteCells.length === 0) return -1;
  const lastCell = absoluteCells[absoluteCells.length - 1];
  return lastCell.colIndex;
};

export const renderHeaderCells = (
  container: HTMLElement,
  absoluteCells: AbsoluteCell[],
  context: HeaderRenderContext
): void => {
  cleanupEventListeners();
  
  container.innerHTML = "";
  
  const lastHeaderIndex = getLastHeaderIndex(absoluteCells);
  
  absoluteCells.forEach((cell) => {
    const isLastHeader = Boolean(context.autoExpandColumns && !context.pinned && 
      cell.colIndex === lastHeaderIndex);
    
    const cellElement = createHeaderCellElement(cell, context, isLastHeader);
    container.appendChild(cellElement);
  });
};

export const cleanupHeaderCellRendering = cleanupEventListeners;
