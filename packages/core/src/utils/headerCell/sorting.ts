import HeaderObject from "../../types/HeaderObject";
import { HeaderRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";

export const createSortIcon = (header: HeaderObject, context: HeaderRenderContext): HTMLElement | null => {
  const { sort, icons } = context;
  
  if (!sort || sort.key.accessor !== header.accessor) return null;
  
  const iconContainer = document.createElement("div");
  iconContainer.className = "st-icon-container";
  iconContainer.setAttribute("role", "button");
  iconContainer.setAttribute("tabindex", "0");
  iconContainer.setAttribute(
    "aria-label",
    `Sort ${header.label} ${sort.direction === "asc" ? "descending" : "ascending"}`
  );
  
  // Use resolved icon from context (matches React implementation)
  const icon = sort.direction === "asc" ? icons.sortUp : icons.sortDown;
  if (icon) {
    if (typeof icon === "string") {
      iconContainer.innerHTML = icon;
    } else if (icon instanceof HTMLElement || icon instanceof SVGSVGElement) {
      iconContainer.appendChild(icon.cloneNode(true) as HTMLElement);
    }
  }
  
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
