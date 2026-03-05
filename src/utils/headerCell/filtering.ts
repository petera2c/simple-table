import HeaderObject from "../../types/HeaderObject";
import { HeaderRenderContext } from "./types";
import { createSVGIcon } from "./icons";
import { addTrackedEventListener } from "./eventTracking";
import { createFilterDropdown } from "../filters/createFilterDropdown";
import { createDropdown } from "../filters/createDropdown";
import { FilterCondition } from "../../types/FilterTypes";

export const createFilterIcon = (
  header: HeaderObject,
  context: HeaderRenderContext,
): HTMLElement | null => {
  const { filters, handleApplyFilter, handleClearFilter } = context;

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
        
        const updatedSvg = createSVGIcon("filter", undefined, {
          fill: "var(--st-button-active-background-color)",
        });
        svg.replaceWith(updatedSvg);
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
        
        const updatedSvg = createSVGIcon("filter", undefined, {
          fill: "var(--st-header-icon-color)",
        });
        svg.replaceWith(updatedSvg);
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
        width: 280,
      });

      iconContainer.appendChild(dropdownInstance.element);
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
