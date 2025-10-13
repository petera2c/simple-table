import React, { useState, useRef, useEffect } from "react";
import SelectIcon from "../../../icons/SelectIcon";
import Dropdown from "../../dropdown/Dropdown";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  disabled = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) => {
            const nextIndex = prev < options.length - 1 ? prev + 1 : 0;
            return nextIndex;
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) => {
            const nextIndex = prev > 0 ? prev - 1 : options.length - 1;
            return nextIndex;
          });
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0) {
            onChange(options[focusedIndex].value);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, focusedIndex, options, onChange]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Set focus to current selected option when opening
      const currentIndex = options.findIndex((option) => option.value === value);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    } else {
      setFocusedIndex(-1);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  return (
    <div
      ref={selectRef}
      className={`st-custom-select ${className} ${disabled ? "st-custom-select-disabled" : ""} ${
        isOpen ? "st-custom-select-open" : ""
      }`.trim()}
    >
      <button
        type="button"
        className="st-custom-select-trigger"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
      >
        <span className="st-custom-select-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <SelectIcon />
      </button>

      <Dropdown
        open={isOpen}
        setOpen={setIsOpen}
        onClose={handleClose}
        positioning="absolute"
        overflow="auto"
      >
        <div className="st-custom-select-options" role="listbox">
          {options.map((option, index) => (
            <div
              key={index}
              className={`st-custom-select-option ${
                option.value === value ? "st-custom-select-option-selected" : ""
              } ${index === focusedIndex ? "st-custom-select-option-focused" : ""}`.trim()}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};

export default CustomSelect;
