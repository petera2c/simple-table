import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem } from "../../Dropdown";

interface BooleanDropdownEditProps {
  value: boolean;
  onChange: (value: boolean) => void;
  onBlur: () => void;
}

const BooleanDropdownEdit: React.FC<BooleanDropdownEditProps> = ({ value, onChange, onBlur }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentValue, setCurrentValue] = useState(value);

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

  const handleSelect = (newValue: boolean) => {
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
      trigger={<div className="st-boolean-dropdown-trigger">{currentValue ? "True" : "False"}</div>}
      position="bottom-left"
      width={120}
    >
      <DropdownItem isSelected={currentValue === true} onClick={() => handleSelect(true)}>
        True
      </DropdownItem>
      <DropdownItem isSelected={currentValue === false} onClick={() => handleSelect(false)}>
        False
      </DropdownItem>
    </Dropdown>
  );
};

export default BooleanDropdownEdit;
