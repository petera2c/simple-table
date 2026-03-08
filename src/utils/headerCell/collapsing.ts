import HeaderObject from "../../types/HeaderObject";
import { hasCollapsibleChildren } from "../collapseUtils";
import { HeaderRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";

export const createCollapseIcon = (header: HeaderObject, context: HeaderRenderContext): HTMLElement | null => {
  const { collapsedHeaders, icons } = context;
  
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
  
  // Use resolved icon from context (matches React implementation)
  const icon = isCollapsed ? icons.headerCollapse : icons.headerExpand;
  if (icon) {
    if (typeof icon === "string") {
      iconContainer.innerHTML = icon;
    } else if (icon instanceof HTMLElement || icon instanceof SVGSVGElement) {
      iconContainer.appendChild(icon.cloneNode(true) as HTMLElement);
    }
  }
  
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
