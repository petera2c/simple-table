import { ReactNode } from "react";
import { CheckIcon } from "../icons";

interface CheckboxProps {
  checked?: boolean;
  children?: ReactNode;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

const Checkbox = ({ checked = false, children, onChange, ariaLabel }: CheckboxProps) => {
  const toggleCheckbox = () => {
    if (onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent Space key from bubbling up and triggering parent handlers
    if (e.key === " ") {
      e.stopPropagation();
    }
  };

  return (
    <label className="st-checkbox-label">
      <input
        checked={checked}
        className="st-checkbox-input"
        onChange={toggleCheckbox}
        onKeyDown={handleKeyDown}
        type="checkbox"
        aria-label={ariaLabel}
        aria-checked={checked}
      />
      <span className={`st-checkbox-custom ${checked ? "st-checked" : ""}`} aria-hidden="true">
        {checked && <CheckIcon className="st-checkbox-checkmark" />}
      </span>
      {children}
    </label>
  );
};

export default Checkbox;
