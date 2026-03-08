import { AbsoluteBodyCell, CellRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";
import { createSVGIcon } from "./icons";

// Create expand/collapse icon for row grouping
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

  // Create inner icon span
  const iconSpan = document.createElement("span");
  iconSpan.className = "st-expand-icon";
  
  const icon = createSVGIcon(isExpanded ? "chevronDown" : "chevronRight");
  iconSpan.appendChild(icon);
  outerContainer.appendChild(iconSpan);

  const handleToggle = (event: Event) => {
    event.stopPropagation();

    const { rowId, depth } = cell;
    const rowIdStr = String(rowId);

    if (isExpanded) {
      // Collapse
      context.setCollapsedRows((prev) => {
        const next = new Map(prev);
        next.set(rowIdStr, depth);
        return next;
      });
      context.setExpandedRows((prev) => {
        const next = new Map(prev);
        next.delete(rowIdStr);
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
        next.set(rowIdStr, depth);
        return next;
      });
      context.setCollapsedRows((prev) => {
        const next = new Map(prev);
        next.delete(rowIdStr);
        return next;
      });

      // Call onRowGroupExpand callback if provided
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
          isExpanded: false,
          rowIndexPath: cell.tableRow.rowIndexPath,
          rowIdPath: cell.tableRow.rowPath,
          groupingKeys: context.rowGrouping,
          setLoading,
          setError,
          setEmpty,
        });
      }
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
