import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useTableContext } from "../../context/TableContext";

export interface DropdownProps {
  children: ReactNode;
  containerRef?: React.MutableRefObject<HTMLElement>;
  onClose: () => void;
  open?: boolean;
  overflow?: "auto" | "visible";
  setOpen: (open: boolean) => void;
  width?: number;
  positioning?: "fixed" | "absolute";
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  onClose,
  open,
  overflow = "auto",
  setOpen,
  width,
  containerRef,
  positioning = "fixed",
}) => {
  // Get table context to access mainBodyRef
  const { mainBodyRef } = useTableContext();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [calculatedPosition, setCalculatedPosition] = useState<string>("bottom-left");
  const [fixedPosition, setFixedPosition] = useState<{
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  }>({});
  const [isPositioned, setIsPositioned] = useState(false);

  // Calculate optimal position when dropdown opens
  useEffect(() => {
    if (open && dropdownRef.current) {
      setIsPositioned(false);

      // Store the trigger element (parent of dropdown)
      if (!triggerRef.current && dropdownRef.current.parentElement) {
        triggerRef.current = dropdownRef.current.parentElement;
      }

      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        if (!dropdownRef.current || !triggerRef.current) return;

        const dropdownElement = dropdownRef.current;
        const triggerRect = triggerRef.current.getBoundingClientRect();

        // Get dropdown dimensions
        const dropdownHeight = dropdownElement.offsetHeight;
        const dropdownWidth = width || dropdownElement.offsetWidth;

        // Get container boundaries
        let containerRect: DOMRect;

        // Use containerRef from props if provided, otherwise use mainBodyRef
        if (containerRef?.current) {
          containerRect = containerRef.current.getBoundingClientRect();
        } else if (mainBodyRef?.current) {
          containerRect = mainBodyRef.current.getBoundingClientRect();
        } else {
          // Fallback to viewport
          containerRect = {
            top: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            x: 0,
            y: 0,
            toJSON: () => {},
          };
        }

        // Calculate space available in each direction
        const spaceBottom = containerRect.bottom - triggerRect.bottom;
        const spaceTop = triggerRect.top - containerRect.top;
        const spaceRight = containerRect.right - triggerRect.right;

        // Determine vertical position (top or bottom)
        let verticalPosition = "bottom";
        let newFixedPosition: { top?: number; left?: number; right?: number; bottom?: number } = {};

        // If there's not enough space below and more space above
        if (dropdownHeight > spaceBottom && dropdownHeight <= spaceTop) {
          verticalPosition = "top";
        }
        // If there's not enough space below or above, use the direction with more space
        else if (dropdownHeight > spaceBottom && spaceTop > spaceBottom) {
          verticalPosition = "top";
        }

        // Determine horizontal position (left or right)
        let horizontalPosition = "left";

        // If there's not enough space to the right, try to position to the left
        if (dropdownWidth > spaceRight + triggerRect.width) {
          horizontalPosition = "right";
        }

        // Calculate exact positioning based on positioning type
        if (positioning === "fixed") {
          if (verticalPosition === "bottom") {
            newFixedPosition.top = triggerRect.bottom + 4; // Add margin
          } else {
            newFixedPosition.bottom = window.innerHeight - triggerRect.top + 4; // Add margin
          }

          if (horizontalPosition === "left") {
            newFixedPosition.left = triggerRect.left;
          } else {
            newFixedPosition.right = window.innerWidth - triggerRect.right;
          }
        } else {
          // Absolute positioning - relative to the trigger element
          if (verticalPosition === "bottom") {
            newFixedPosition.top = triggerRect.height + 4; // Add margin
          } else {
            newFixedPosition.bottom = triggerRect.height + 4; // Add margin
          }

          if (horizontalPosition === "left") {
            newFixedPosition.left = 0;
          } else {
            newFixedPosition.right = 0;
          }
        }

        // Set the calculated position
        setCalculatedPosition(`${verticalPosition}-${horizontalPosition}`);
        setFixedPosition(newFixedPosition);
        setIsPositioned(true);
      });
    } else if (!open) {
      setIsPositioned(false);
    }
  }, [open, width, containerRef, mainBodyRef, positioning]);

  // Handle scroll events to close dropdown
  useEffect(() => {
    const handleScroll = (event: Event) => {
      if (!open || !dropdownRef.current) return;

      // Close the dropdown if the scroll event is not from the dropdown itself or its children
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpen(false);
        onClose?.();
      }
    };

    if (open) {
      // Use capture phase to catch all scroll events
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, onClose, setOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | KeyboardEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Also check if the click is within the parent element (which contains the trigger)
        const parentElement = dropdownRef.current.parentElement;
        if (parentElement && !parentElement.contains(event.target as Node)) {
          setOpen(false);
          onClose?.();
        }
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleClickOutside(event);
      }
    };

    if (open) {
      // Use capture phase to ensure this runs before other handlers
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("keydown", handleKeyDown, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [onClose, open, setOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        onClose?.();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose, open, setOpen]);

  if (!open) return null;

  // Render a hidden div for position calculation, then show actual content when positioned
  return (
    <div
      ref={dropdownRef}
      className={`st-dropdown-content st-dropdown-${calculatedPosition}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      style={{
        position: positioning,
        width: width ? `${width}px` : "auto",
        visibility: isPositioned ? "visible" : "hidden",
        ...fixedPosition,
        overflow,
      }}
    >
      {children}
    </div>
  );
};

export default Dropdown;
