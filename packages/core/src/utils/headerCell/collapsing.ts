import HeaderObject from "../../types/HeaderObject";
import { hasCollapsibleChildren } from "../collapseUtils";
import { updateExpandIconState } from "../bodyCell/expansion";
import { HeaderRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";

/** Use same icon and animation as body row expand/collapse (icons.expand + st-expand-icon-container). */
export const createCollapseIcon = (header: HeaderObject, context: HeaderRenderContext): HTMLElement | null => {
  const { icons } = context;

  const isCollapsible = hasCollapsibleChildren(header);
  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;

  if (!isCollapsible || isSelectionColumn) return null;

  const currentSet = context.getCollapsedHeaders?.() ?? context.collapsedHeaders;
  const isCollapsed = currentSet.has(header.accessor);

  const iconContainer = document.createElement("div");
  iconContainer.className = `st-icon-container st-collapsible-header-icon st-expand-icon-container ${
    isCollapsed ? "collapsed" : "expanded"
  }`;
  iconContainer.setAttribute("role", "button");
  iconContainer.setAttribute("tabindex", "0");
  iconContainer.setAttribute(
    "aria-label",
    `${isCollapsed ? "Expand" : "Collapse"} ${header.label} column`
  );
  iconContainer.setAttribute("aria-expanded", String(!isCollapsed));

  // Same icon as body row expand/collapse (single chevron that rotates)
  const icon = icons.expand;
  if (icon) {
    if (typeof icon === "string") {
      iconContainer.innerHTML = icon;
    } else if (icon instanceof HTMLElement || icon instanceof SVGSVGElement) {
      iconContainer.appendChild(icon.cloneNode(true) as HTMLElement);
    }
  }

  const handleCollapseToggle = (event: Event) => {
    event.stopPropagation();
    const current = context.getCollapsedHeaders?.() ?? context.collapsedHeaders;
    const currentlyCollapsed = current.has(header.accessor);
    context.setCollapsedHeaders((prev) => {
      const newSet = new Set(prev);
      if (currentlyCollapsed) {
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

/** Update header collapse icon direction on an existing cell (delegates to body updateExpandIconState). */
export const updateHeaderCollapseIconState = (
  cellElement: HTMLElement,
  isCollapsed: boolean,
  label?: string
): void => {
  updateExpandIconState(cellElement, !isCollapsed, {
    ariaLabelWhenExpanded: label ? `Collapse ${label} column` : "Collapse column",
    ariaLabelWhenCollapsed: label ? `Expand ${label} column` : "Expand column",
    syncAriaExpanded: true,
  });
};
