import React, { useState } from "react";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";
import EnumOption from "../../../types/EnumOption";

interface EnumDropdownEditProps {
  onBlur: () => void;
  onChange: (value: string) => void;
  open: boolean;
  options: EnumOption[];
  setOpen: (open: boolean) => void;
  value: string;
}

const EnumDropdownEdit = ({
  onBlur,
  onChange,
  open,
  options,
  setOpen,
  value,
}: EnumDropdownEditProps) => {
  const [currentValue, setCurrentValue] = useState<string>(value || "");

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
            key={option.value}
            isSelected={currentValue === option.value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </DropdownItem>
        ))}
      </div>
    </Dropdown>
  );
};

export default EnumDropdownEdit;
