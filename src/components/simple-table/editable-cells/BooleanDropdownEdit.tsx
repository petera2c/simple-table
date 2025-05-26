import React, { useState } from "react";
import Dropdown from "../../dropdown/Dropdown";
import DropdownItem from "../../dropdown/DropdownItem";

interface BooleanDropdownEditProps {
  onBlur: () => void;
  onChange: (value: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  value: boolean;
}

const BooleanDropdownEdit: React.FC<BooleanDropdownEditProps> = ({
  onBlur,
  onChange,
  open,
  setOpen,
  value,
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleSelect = (newValue: boolean) => {
    setCurrentValue(newValue);
    onChange(newValue);
    setOpen(false);
    onBlur();
  };

  const handleClose = () => {
    onBlur();
  };

  return (
    <Dropdown open={open} onClose={handleClose} setOpen={setOpen} width={120}>
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
