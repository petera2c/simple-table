import { AbsoluteBodyCell, CellRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";
import { isRowExpanded, expandStateKey } from "../rowUtils";
import { cellLiveRefMap } from "./styling";

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

    // The `cell` object captured in this closure is from the render that
    // created the DOM node. After a later sort/filter the same cell DOM is
    // reused (via stableRowKey), so the closure's positional `cell.rowId` string
    // can desync from freshly computed rowIds. We read the LIVE `tableRow`
    // from the cell DOM's live ref (updated in `updateBodyCellElement`) and
    // derive the expand-state key with `expandStateKey` so toggles match
    // `flattenRows` / `isRowExpanded` after reorder.
    //
    // We deliberately keep the closure's `row`, `rowIndexPath`, and `rowPath`
    // for the consumer callback below: `rowIndexPath` is documented across
    // every framework demo as the index into the consumer's source-data array
    // (e.g. `rows[rowIndexPath[0]] = { ...rows[rowIndexPath[0]], children }`),
    // and the consumer's array is not reordered by sort. Using the live
    // post-sort positional index here would silently write nested data into
    // the wrong row. The closure still carries the source index because the
    // cell DOM was created during the pre-sort initial render.
    const cellElement = outerContainer.closest<HTMLElement>("[data-row-id]");
    const liveRef = cellElement ? cellLiveRefMap.get(cellElement) : undefined;
    const liveTableRow = liveRef?.tableRow ?? cell.tableRow;
    const expandRowKey = expandStateKey(liveTableRow);
    const depth = liveTableRow.depth;

    const expandedDepthsSet = new Set(context.expandedDepths);
    const currentExpandedRows = context.getExpandedRows ? context.getExpandedRows() : context.expandedRows;
    const currentCollapsedRows = context.getCollapsedRows ? context.getCollapsedRows() : context.collapsedRows;
    const currentIsExpanded = isRowExpanded(
      expandRowKey,
      depth,
      expandedDepthsSet,
      currentExpandedRows,
      currentCollapsedRows,
    );

    const willBeExpanded = !currentIsExpanded;

    if (currentIsExpanded) {
      // Collapse
      context.setCollapsedRows((prev) => {
        const next = new Map(prev);
        next.set(expandRowKey, depth);
        return next;
      });
      context.setExpandedRows((prev) => {
        const next = new Map(prev);
        next.delete(expandRowKey);
        return next;
      });
      // Clear row state
      context.setRowStateMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.delete(expandRowKey);
        return newMap;
      });
    } else {
      // Expand
      context.setExpandedRows((prev) => {
        const next = new Map(prev);
        next.set(expandRowKey, depth);
        return next;
      });
      context.setCollapsedRows((prev) => {
        const next = new Map(prev);
        next.delete(expandRowKey);
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
            const currentState = newMap.get(expandRowKey) || {};
            newMap.set(expandRowKey, { ...currentState, loading, triggerSection });
            return newMap;
          });
        }, 0);
      };

      const setError = (error: string | null) => {
        context.setRowStateMap((prev) => {
          const newMap = new Map(prev);
          const currentState = newMap.get(expandRowKey) || {};
          newMap.set(expandRowKey, { ...currentState, error, loading: false, triggerSection });
          return newMap;
        });
      };

      const setEmpty = (isEmpty: boolean, message?: string) => {
        context.setRowStateMap((prev) => {
          const newMap = new Map(prev);
          const currentState = newMap.get(expandRowKey) || {};
          newMap.set(expandRowKey, { ...currentState, isEmpty, loading: false, triggerSection });
          return newMap;
        });
      };

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

export type UpdateExpandIconStateOptions = {
  /** aria-label when the group is expanded (chevron shows collapse action). */
  ariaLabelWhenExpanded?: string;
  /** aria-label when the group is collapsed (chevron shows expand action). */
  ariaLabelWhenCollapsed?: string;
  /** When true, sets aria-expanded to match isExpanded after the toggle. */
  syncAriaExpanded?: boolean;
};

/** Update expand/collapse icon direction on an existing cell (e.g. after expand state changes for nested grids). */
export const updateExpandIconState = (
  cellElement: HTMLElement,
  isExpanded: boolean,
  options?: UpdateExpandIconStateOptions,
): void => {
  const iconContainer = cellElement.querySelector(".st-expand-icon-container");
  if (!iconContainer || !(iconContainer instanceof HTMLElement)) return;
  const currentlyExpanded = iconContainer.classList.contains("expanded");
  if (currentlyExpanded === isExpanded) return;

  const labelExpanded = options?.ariaLabelWhenExpanded ?? "Collapse row";
  const labelCollapsed = options?.ariaLabelWhenCollapsed ?? "Expand row";

  // Defer class toggle so the browser paints the current state first, then we apply the new state
  // and the CSS transition runs. Use double rAF so the first paint has committed.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      iconContainer.classList.toggle("expanded", isExpanded);
      iconContainer.classList.toggle("collapsed", !isExpanded);
      iconContainer.setAttribute("aria-label", isExpanded ? labelExpanded : labelCollapsed);
      if (options?.syncAriaExpanded) {
        iconContainer.setAttribute("aria-expanded", String(isExpanded));
      }
    });
  });
};
