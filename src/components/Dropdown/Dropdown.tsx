import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./dropdown.css";

export interface DropdownProps {
  children: ReactNode;
  onClose?: () => void;
  trigger?: ReactNode;
  isOpen?: boolean;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  width?: number;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  onClose,
  trigger,
  isOpen: controlledIsOpen,
  position = "bottom-left",
  width,
}) => {
  const [isOpen, setIsOpen] = useState(controlledIsOpen || false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Handle controlled vs uncontrolled state
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (!newIsOpen && onClose) {
      onClose();
    }
  };

  return (
    <div className="st-dropdown-container">
      {trigger && (
        <div ref={triggerRef} className="st-dropdown-trigger" onClick={toggleDropdown}>
          {trigger}
        </div>
      )}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`st-dropdown-content st-dropdown-${position}`}
          style={{ width: width ? `${width}px` : "auto" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
