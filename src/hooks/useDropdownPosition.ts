import { useState, useEffect, useRef } from "react";

interface DropdownPosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface UseDropdownPositionOptions {
  isOpen: boolean;
  estimatedHeight?: number;
  estimatedWidth?: number;
  margin?: number;
}

interface UseDropdownPositionReturn {
  triggerRef: React.RefObject<HTMLDivElement>;
  position: DropdownPosition;
}

/**
 * Custom hook for calculating dropdown position relative to a trigger element
 * Uses fixed positioning to work properly in overflow containers
 */
export const useDropdownPosition = ({
  isOpen,
  estimatedHeight = 200,
  estimatedWidth = 250,
  margin = 4,
}: UseDropdownPositionOptions): UseDropdownPositionReturn => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<DropdownPosition>({});

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const calculatePosition = () => {
        if (!triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();

        // Calculate space available in each direction
        const spaceBottom = window.innerHeight - triggerRect.bottom;
        const spaceTop = triggerRect.top;
        const spaceRight = window.innerWidth - triggerRect.right;

        // Determine vertical position (top or bottom)
        let verticalPosition = "bottom";
        let newPosition: DropdownPosition = {};

        // If there's not enough space below and more space above
        if (estimatedHeight > spaceBottom && estimatedHeight <= spaceTop) {
          verticalPosition = "top";
        }

        // Determine horizontal position (left or right)
        let horizontalPosition = "left";

        // If there's not enough space to the right, position to the left
        if (estimatedWidth > spaceRight + triggerRect.width) {
          horizontalPosition = "right";
        }

        // Calculate exact positioning for fixed positioning
        if (verticalPosition === "bottom") {
          newPosition.top = triggerRect.bottom + margin;
        } else {
          newPosition.bottom = window.innerHeight - triggerRect.top + margin;
        }

        if (horizontalPosition === "left") {
          newPosition.left = triggerRect.left;
        } else {
          newPosition.right = window.innerWidth - triggerRect.right;
        }

        setPosition(newPosition);
      };

      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(calculatePosition);

      // Recalculate on window resize or scroll
      const handleResize = () => requestAnimationFrame(calculatePosition);
      const handleScroll = () => requestAnimationFrame(calculatePosition);

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    } else {
      // Reset position when closed
      setPosition({});
    }
  }, [isOpen, estimatedHeight, estimatedWidth, margin]);

  return { triggerRef, position };
};

export default useDropdownPosition;
