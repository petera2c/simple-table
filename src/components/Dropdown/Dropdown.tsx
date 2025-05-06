import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useTableContext } from "../../context/TableContext";

export interface DropdownProps {
  children: ReactNode;
  onClose: () => void;
  open?: boolean;
  setOpen: (open: boolean) => void;
  width?: number;
  containerRef?: React.RefObject<HTMLElement>;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  onClose,
  open,
  setOpen,
  width,
  containerRef,
}) => {
  // Get table context to access mainBodyRef
  const tableContext = useTableContext();
  const mainBodyRef = tableContext?.mainBodyRef;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [calculatedPosition, setCalculatedPosition] = useState<string>("bottom-left");
  const [isPositioned, setIsPositioned] = useState(false);

  // Calculate optimal position when dropdown opens
  useEffect(() => {
    if (open && dropdownRef.current) {
      setIsPositioned(false);

      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        if (!dropdownRef.current) return;

        const dropdownElement = dropdownRef.current;
        const dropdownRect = dropdownElement.getBoundingClientRect();

        // Get dropdown dimensions
        const dropdownHeight = dropdownElement.offsetHeight;
        const dropdownWidth = width || dropdownElement.offsetWidth;

        // Get container boundaries
        let containerRect: DOMRect;
        const parentElement = dropdownElement.parentElement;
        const parentRect = parentElement ? parentElement.getBoundingClientRect() : dropdownRect;

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
        const spaceBottom = containerRect.bottom - parentRect.bottom;
        const spaceTop = parentRect.top - containerRect.top;
        const spaceRight = containerRect.right - parentRect.right;

        // Determine vertical position (top or bottom)
        let verticalPosition = "bottom";

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
        if (dropdownWidth > spaceRight + parentRect.width) {
          horizontalPosition = "right";
        }

        // Set the calculated position
        setCalculatedPosition(`${verticalPosition}-${horizontalPosition}`);
        setIsPositioned(true);
      });
    } else if (!open) {
      setIsPositioned(false);
    }
  }, [open, width, containerRef, mainBodyRef]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        onClose?.();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      style={{
        width: width ? `${width}px` : "auto",
        visibility: isPositioned ? "visible" : "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default Dropdown;
