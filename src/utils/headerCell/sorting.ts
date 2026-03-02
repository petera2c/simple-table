import HeaderObject from "../../types/HeaderObject";
import { HeaderRenderContext } from "./types";
import { createSVGIcon } from "./icons";
import { addTrackedEventListener } from "./eventTracking";

export const createSortIcon = (header: HeaderObject, context: HeaderRenderContext): HTMLElement | null => {
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
