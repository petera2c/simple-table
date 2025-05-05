import React, { ReactNode, useEffect, useRef } from "react";
import "./dropdown.css";

export interface DropdownProps {
  children: ReactNode;
  onClose: () => void;
  open?: boolean;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  setOpen: (open: boolean) => void;
  width?: number;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  onClose,
  open,
  position = "bottom-left",
  setOpen,
  width,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={dropdownRef}
      className={`st-dropdown-content st-dropdown-${position}`}
      style={{ width: width ? `${width}px` : "auto" }}
    >
      {children}
    </div>
  );
};

export default Dropdown;
