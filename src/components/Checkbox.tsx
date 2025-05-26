import { ReactNode } from "react";
import CheckIcon from "../icons/CheckIcon";

interface CheckboxProps {
  checked?: boolean;
  children?: ReactNode;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({ checked = false, children, onChange }: CheckboxProps) => {
  const toggleCheckbox = () => {
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <label className="st-checkbox-label">
      <input
        checked={checked}
        className="st-checkbox-input"
        onChange={toggleCheckbox}
        type="checkbox"
      />
      <span className={`st-checkbox-custom ${checked ? "st-checked" : ""}`}>
        {checked && <CheckIcon className="st-checkbox-checkmark" />}
      </span>
      {children}
    </label>
  );
};

export default Checkbox;
