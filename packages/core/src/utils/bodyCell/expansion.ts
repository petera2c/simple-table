import { AbsoluteBodyCell, CellRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";
import { isRowExpanded } from "../rowUtils";

// Create expand/collapse icon container for row grouping
// Uses the icon from context.icons.expand (configured by user or default)
export const createExpandIcon = (
  cell: AbsoluteBodyCell,
  context: CellRenderContext,
  isExpanded: boolean,
): HTMLElement => {
  // Create outer container with proper classes matching old React implementation
  const outerContainer = document.createElement("div");
  outerContainer.className = `st-icon-container st-expand-icon-container ${
    isExpanded ? "expanded" : "collapsed"
  }`;
  outerContainer.setAttribute("role", "button");
  outerContainer.setAttribute("aria-label", isExpanded ? "Collapse row" : "Expand row");
  outerContainer.setAttribute("tabindex", "0");

  // Use the icon from context (matches React implementation: {icons.expand})
  const icon = context.icons.expand;
  if (icon) {
    if (typeof icon === "string") {
      // If icon is a string (HTML), set as innerHTML
      outerContainer.innerHTML = icon;
    } else if (icon instanceof HTMLElement || icon instanceof SVGSVGElement) {
      // If icon is a DOM element, clone and append it
      outerContainer.appendChild(icon.cloneNode(true) as HTMLElement);
    }
  }

  const handleToggle = (event: Event) => {
    event.stopPropagation();

    const { rowId, depth } = cell;

    // Recalculate current expanded state dynamically to avoid stale closure
    const expandedDepthsSet = new Set(context.expandedDepths);
    const currentExpandedRows = context.getExpandedRows ? context.getExpandedRows() : context.expandedRows;
    const currentCollapsedRows = context.getCollapsedRows ? context.getCollapsedRows() : context.collapsedRows;
    const currentIsExpanded = isRowExpanded(
      rowId,
      depth,
      expandedDepthsSet,
      currentExpandedRows,
      currentCollapsedRows,
    );

    // Determine the new state after toggle
    const willBeExpanded = !currentIsExpanded;

    if (currentIsExpanded) {
      // Collapse
      context.setCollapsedRows((prev) => {
        const next = new Map(prev);
        next.set(rowId, depth);
        return next;
      });
      context.setExpandedRows((prev) => {
        const next = new Map(prev);
        next.delete(rowId);
        return next;
      });
      // Clear row state
      context.setRowStateMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(rowId);
        return newMap;
      });
    } else {
      // Expand
      context.setExpandedRows((prev) => {
        const next = new Map(prev);
        next.set(rowId, depth);
        return next;
      });
      context.setCollapsedRows((prev) => {
        const next = new Map(prev);
        next.delete(rowId);
        return next;
      });
    }

    // Call onRowGroupExpand callback if provided (for both expand and collapse)
    if (context.onRowGroupExpand && cell.tableRow.rowIndexPath && context.rowGrouping) {
      const triggerSection = cell.header.pinned;

      const setLoading = (loading: boolean) => {
        setTimeout(() => {
          context.setRowStateMap((prev) => {
            const newMap = new Map(prev);
            const currentState = newMap.get(rowId) || {};
            newMap.set(rowId, { ...currentState, loading, triggerSection });
            return newMap;
          });
        }, 0);
      };

      const setError = (error: string | null) => {
        context.setRowStateMap((prev) => {
          const newMap = new Map(prev);
          const currentState = newMap.get(rowId) || {};
          newMap.set(rowId, { ...currentState, error, loading: false, triggerSection });
          return newMap;
        });
      };

      const setEmpty = (isEmpty: boolean, message?: string) => {
        context.setRowStateMap((prev) => {
          const newMap = new Map(prev);
          const currentState = newMap.get(rowId) || {};
          newMap.set(rowId, { ...currentState, isEmpty, loading: false, triggerSection });
          return newMap;
        });
      };

      // Create a synthetic event object
      const syntheticEvent = {
        stopPropagation: () => {},
        preventDefault: () => {},
      } as any;

      context.onRowGroupExpand({
        row: cell.row,
        depth,
        event: syntheticEvent,
        groupingKey: context.rowGrouping[depth],
        isExpanded: willBeExpanded,
        rowIndexPath: cell.tableRow.rowIndexPath,
        rowIdPath: cell.tableRow.rowPath,
        groupingKeys: context.rowGrouping,
        setLoading,
        setError,
        setEmpty,
      });
    }
  };

  addTrackedEventListener(outerContainer, "click", handleToggle);

  const handleKeyDown = (event: Event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      handleToggle(event);
    }
  };

  addTrackedEventListener(outerContainer, "keydown", handleKeyDown);

  return outerContainer;
};

/** Update expand/collapse icon direction on an existing cell (e.g. after expand state changes for nested grids). */
export const updateExpandIconState = (cellElement: HTMLElement, isExpanded: boolean): void => {
  const iconContainer = cellElement.querySelector(".st-expand-icon-container");
  if (!iconContainer || !(iconContainer instanceof HTMLElement)) return;
  const currentlyExpanded = iconContainer.classList.contains("expanded");
  if (currentlyExpanded === isExpanded) return;

  // Defer class toggle so the browser paints the current state first, then we apply the new state
  // and the CSS transition runs. Use double rAF so the first paint has committed.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      iconContainer.classList.toggle("expanded", isExpanded);
      iconContainer.classList.toggle("collapsed", !isExpanded);
      iconContainer.setAttribute("aria-label", isExpanded ? "Collapse row" : "Expand row");
    });
  });
};
