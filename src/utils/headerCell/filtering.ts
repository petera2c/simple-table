import HeaderObject from "../../types/HeaderObject";
import { HeaderRenderContext } from "./types";
import { createSVGIcon } from "./icons";
import { addTrackedEventListener } from "./eventTracking";

export const createFilterIcon = (
  header: HeaderObject,
  context: HeaderRenderContext,
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
