import React, { ReactNode, useState } from "react";

interface CheckboxProps {
  checked?: boolean;
  children?: ReactNode;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({ checked = false, children, onChange }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const toggleCheckbox = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  return (
    <label className="st-checkbox-label">
      <input
        checked={isChecked}
        className="st-checkbox-input"
        onChange={toggleCheckbox}
        type="checkbox"
      />
      <span className={`st-checkbox-custom ${isChecked ? "st-checked" : ""}`}>
        {isChecked && <span className="st-checkbox-checkmark" />}
      </span>
      {children}
    </label>
  );
};

export default Checkbox;
