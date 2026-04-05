import HeaderObject from "../../types/HeaderObject";
import { HeaderRenderContext } from "./types";
import { addTrackedEventListener } from "./eventTracking";
import { createFilterDropdown } from "../filters/createFilterDropdown";
import { createDropdown } from "../filters/createDropdown";
import { FilterCondition } from "../../types/FilterTypes";

export const createFilterIcon = (
  header: HeaderObject,
  context: HeaderRenderContext,
): HTMLElement | null => {
  const { filters, handleApplyFilter, handleClearFilter, icons } = context;

  if (!header.filterable) return null;

  const currentFilter = filters[header.accessor];
  const iconContainer = document.createElement("div");
  iconContainer.className = "st-icon-container";
  iconContainer.setAttribute("role", "button");
  iconContainer.setAttribute("tabindex", "0");
  iconContainer.setAttribute("aria-label", `Filter ${header.label}`);
  iconContainer.setAttribute("aria-expanded", "false");
  iconContainer.setAttribute("aria-haspopup", "dialog");

  // Use resolved icon from context and apply dynamic styling
  const icon = icons.filter;
  let svgElement: SVGSVGElement | null = null;
  
  if (icon) {
    if (typeof icon === "string") {
      iconContainer.innerHTML = icon;
      svgElement = iconContainer.querySelector("svg");
    } else if (icon instanceof HTMLElement || icon instanceof SVGSVGElement) {
      const clonedIcon = icon.cloneNode(true) as SVGSVGElement;
      iconContainer.appendChild(clonedIcon);
      svgElement = clonedIcon;
    }
  }
  
  // Apply fill color to the SVG
  if (svgElement) {
    svgElement.style.fill = currentFilter
      ? "var(--st-button-active-background-color)"
      : "var(--st-header-icon-color)";
  }

  let isFilterDropdownOpen = false;
  let filterDropdownInstance: ReturnType<typeof createFilterDropdown> | null = null;
  let dropdownInstance: ReturnType<typeof createDropdown> | null = null;

  const handleFilterIconClick = (event: Event) => {
    event.stopPropagation();
    isFilterDropdownOpen = !isFilterDropdownOpen;
    iconContainer.setAttribute("aria-expanded", String(isFilterDropdownOpen));

    if (isFilterDropdownOpen) {
      const onApplyFilter = (filter: FilterCondition) => {
        handleApplyFilter(filter);
        isFilterDropdownOpen = false;
        iconContainer.setAttribute("aria-expanded", "false");
        if (dropdownInstance) {
          dropdownInstance.destroy();
          dropdownInstance = null;
        }
        if (filterDropdownInstance) {
          filterDropdownInstance.destroy();
          filterDropdownInstance = null;
        }
        
        // Update icon color to show active state
        if (svgElement) {
          svgElement.style.fill = "var(--st-button-active-background-color)";
        }
      };

      const onClearFilter = () => {
        handleClearFilter(header.accessor);
        isFilterDropdownOpen = false;
        iconContainer.setAttribute("aria-expanded", "false");
        if (dropdownInstance) {
          dropdownInstance.destroy();
          dropdownInstance = null;
        }
        if (filterDropdownInstance) {
          filterDropdownInstance.destroy();
          filterDropdownInstance = null;
        }
        
        // Update icon color to show inactive state
        if (svgElement) {
          svgElement.style.fill = "var(--st-header-icon-color)";
        }
      };

      const containerElement = context.mainBodyRef.current || undefined;

      filterDropdownInstance = createFilterDropdown({
        header,
        currentFilter,
        onApplyFilter,
        onClearFilter,
        containerRef: containerElement,
        mainBodyRef: containerElement,
      });

      dropdownInstance = createDropdown({
        children: filterDropdownInstance.element,
        containerRef: containerElement,
        mainBodyRef: containerElement,
        anchorElement: iconContainer,
        onClose: () => {
          isFilterDropdownOpen = false;
          iconContainer.setAttribute("aria-expanded", "false");
          if (filterDropdownInstance) {
            filterDropdownInstance.destroy();
            filterDropdownInstance = null;
          }
        },
        open: true,
        overflow: "auto",
        positioning: "fixed",
        maxWidth: 280,
      });
    } else {
      if (dropdownInstance) {
        dropdownInstance.destroy();
        dropdownInstance = null;
      }
      if (filterDropdownInstance) {
        filterDropdownInstance.destroy();
        filterDropdownInstance = null;
      }
    }
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
