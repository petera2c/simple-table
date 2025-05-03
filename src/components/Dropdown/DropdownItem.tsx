import React, { ReactNode } from "react";

export interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  className?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  isSelected = false,
  disabled = false,
  className = "",
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`st-dropdown-item ${isSelected ? "selected" : ""} ${
        disabled ? "disabled" : ""
      } ${className}`}
      onClick={handleClick}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
};

export default DropdownItem;
