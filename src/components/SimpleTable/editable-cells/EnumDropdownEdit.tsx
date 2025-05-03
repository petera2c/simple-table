import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem } from "../../Dropdown";

interface EnumDropdownEditProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onBlur: () => void;
}

const EnumDropdownEdit: React.FC<EnumDropdownEditProps> = ({
  value,
  options,
  onChange,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentValue, setCurrentValue] = useState<string>(value || "");

  // Auto-focus on mount
  useEffect(() => {
    // Set focus to the dropdown container
    const timerId = setTimeout(() => {
      const dropdownContainer = document.querySelector(".st-dropdown-container");
      if (dropdownContainer instanceof HTMLElement) {
        dropdownContainer.focus();
      }
    }, 0);

    return () => clearTimeout(timerId);
  }, []);

  const handleSelect = (newValue: string) => {
    setCurrentValue(newValue);
    onChange(newValue);
    setIsOpen(false);
    onBlur();
  };

  const handleClose = () => {
    onBlur();
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={handleClose}
      trigger={<div className="st-enum-dropdown-trigger">{currentValue}</div>}
      position="bottom-left"
      width={150}
    >
      <div className="st-enum-dropdown-content">
        {options.map((option) => (
          <DropdownItem
            key={option}
            isSelected={currentValue === option}
            onClick={() => handleSelect(option)}
          >
            {option}
          </DropdownItem>
        ))}
      </div>
    </Dropdown>
  );
};

export default EnumDropdownEdit;
