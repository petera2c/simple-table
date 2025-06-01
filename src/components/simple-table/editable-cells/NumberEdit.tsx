import React, { useRef } from "react";

interface NumberInputProps {
  defaultValue: number;
  onBlur: () => void;
  onChange: (value: string) => void;
}

const NumberEdit = ({ defaultValue, onBlur, onChange }: NumberInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Stop propagation to prevent table navigation
    e.stopPropagation();

    // Close on Enter or Escape
    if (e.key === "Enter" || e.key === "Escape") {
      onBlur();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    // Stop propagation to prevent cell deselection
    e.stopPropagation();
  };

  return (
    <input
      className="editable-cell-input"
      ref={ref}
      autoFocus
      defaultValue={defaultValue.toString()}
      onBlur={onBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
    />
  );
};

export default NumberEdit;
