// Base dropdown component for vanilla JS editors
// Handles positioning, click-outside, keyboard events

import { addTrackedEventListener } from "../eventTracking";

export interface DropdownOptions {
  width?: number;
  maxHeight?: number;
  positioning?: "fixed" | "absolute";
  onClose: () => void;
}

export interface DropdownPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

// Calculate optimal dropdown position
export const calculateDropdownPosition = (
  triggerElement: HTMLElement,
  dropdownElement: HTMLElement,
  options: DropdownOptions,
): { position: DropdownPosition; placement: string } => {
  const triggerRect = triggerElement.getBoundingClientRect();
  const dropdownHeight = dropdownElement.offsetHeight;
  const dropdownWidth = options.width || dropdownElement.offsetWidth;

  // Get viewport boundaries
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Calculate space available in each direction
  const spaceBottom = viewportHeight - triggerRect.bottom;
  const spaceTop = triggerRect.top;
  const spaceRight = viewportWidth - triggerRect.left;
  const spaceLeft = triggerRect.right;

  // Determine vertical position
  let verticalPosition: "bottom" | "top" = "bottom";
  if (dropdownHeight > spaceBottom && spaceTop > spaceBottom) {
    verticalPosition = "top";
  }

  // Determine horizontal position
  let horizontalPosition: "left" | "right" = "left";
  if (dropdownWidth > spaceRight && spaceLeft > spaceRight) {
    horizontalPosition = "right";
  }

  // Calculate exact positioning
  const position: DropdownPosition = {};

  if (options.positioning === "fixed") {
    if (verticalPosition === "bottom") {
      position.top = triggerRect.bottom + 4;
    } else {
      position.bottom = viewportHeight - triggerRect.top + 4;
    }

    if (horizontalPosition === "left") {
      position.left = triggerRect.left;
    } else {
      position.right = viewportWidth - triggerRect.right;
    }
  } else {
    // Absolute positioning
    if (verticalPosition === "bottom") {
      position.top = triggerRect.height + 4;
    } else {
      position.bottom = triggerRect.height + 4;
    }

    if (horizontalPosition === "left") {
      position.left = 0;
    } else {
      position.right = 0;
    }
  }

  const placement = `${verticalPosition}-${horizontalPosition}`;
  return { position, placement };
};

// Create dropdown container element
export const createDropdown = (
  triggerElement: HTMLElement,
  content: HTMLElement | DocumentFragment,
  options: DropdownOptions,
): HTMLElement => {
  const dropdown = document.createElement("div");
  dropdown.className = "st-dropdown-content";
  dropdown.style.position = options.positioning || "fixed";
  dropdown.style.zIndex = "1000";
  dropdown.style.visibility = "hidden"; // Hidden until positioned
  dropdown.style.overflow = "auto"; // Default overflow behavior

  if (options.width) {
    dropdown.style.width = `${options.width}px`;
  }

  if (options.maxHeight) {
    dropdown.style.maxHeight = `${options.maxHeight}px`;
  }

  // Copy CSS variables and font from table root to dropdown (since it's appended to body)
  const tableRoot = triggerElement.closest(".simple-table-root") as HTMLElement;
  if (tableRoot) {
    const computedStyle = getComputedStyle(tableRoot);
    
    // Copy CSS variables
    const cssVars = [
      "--st-odd-row-background-color",
      "--st-border-color",
      "--st-border-radius",
      "--st-edit-cell-shadow",
      "--st-cell-color",
      "--st-spacing-small",
      "--st-spacing-medium",
      "--st-button-hover-background-color",
      "--st-selected-cell-background-color",
      "--st-selected-cell-color",
      "--st-transition-duration",
      "--st-transition-ease",
      "--st-border-width",
    ];
    
    cssVars.forEach((varName) => {
      const value = computedStyle.getPropertyValue(varName);
      if (value) {
        dropdown.style.setProperty(varName, value);
      }
    });
    
    // Copy font-family so dropdown inherits table's font
    const fontFamily = computedStyle.fontFamily;
    if (fontFamily) {
      dropdown.style.fontFamily = fontFamily;
    }
  }

  // Append content
  dropdown.appendChild(content);

  // Add to body for fixed positioning, or to trigger parent for absolute
  if (options.positioning === "fixed") {
    document.body.appendChild(dropdown);
  } else {
    triggerElement.appendChild(dropdown);
  }

  // Calculate position after adding to DOM
  requestAnimationFrame(() => {
    const { position, placement } = calculateDropdownPosition(triggerElement, dropdown, options);

    dropdown.className = `st-dropdown-content st-dropdown-${placement}`;

    // Apply calculated position
    Object.entries(position).forEach(([key, value]) => {
      if (value !== undefined) {
        dropdown.style[key as any] = `${value}px`;
      }
    });

    dropdown.style.visibility = "visible";
  });

  // Click outside to close
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (!dropdown.contains(target) && !triggerElement.contains(target)) {
      closeDropdown();
    }
  };

  // ESC key to close
  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
    }
  };

  // Scroll to close
  const handleScroll = (event: Event) => {
    const target = event.target as Node;
    if (!dropdown.contains(target)) {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    dropdown.remove();
    document.removeEventListener("mousedown", handleClickOutside, true);
    document.removeEventListener("keydown", handleEscKey, true);
    window.removeEventListener("scroll", handleScroll, true);
    options.onClose();
  };

  // Add event listeners
  setTimeout(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", handleEscKey, true);
    window.addEventListener("scroll", handleScroll, true);
  }, 0);

  // Prevent clicks inside dropdown from propagating
  addTrackedEventListener(dropdown, "mousedown", (e) => {
    e.stopPropagation();
  });

  return dropdown;
};
