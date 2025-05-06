import React, { useEffect, useState } from "react";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";

interface EnumDropdownEditProps {
  onBlur: () => void;
  onChange: (value: string) => void;
  open: boolean;
  options: string[];
  setOpen: (open: boolean) => void;
  value: string;
}

const EnumDropdownEdit: React.FC<EnumDropdownEditProps> = ({
  onBlur,
  onChange,
  open,
  options,
  setOpen,
  value,
}) => {
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
    setOpen(false);
    onBlur();
  };

  const handleClose = () => {
    onBlur();
  };

  return (
    <Dropdown open={open} onClose={handleClose} setOpen={setOpen} width={150}>
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
