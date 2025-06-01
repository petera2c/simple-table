import React, { useRef } from "react";

interface TextInputProps {
  defaultValue: string | null | undefined;
  onBlur: () => void;
  onChange: (value: string) => void;
}

const StringEdit = ({ defaultValue, onBlur, onChange }: TextInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value);
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
      type="text"
      defaultValue={defaultValue ?? ""}
      onBlur={onBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
    />
  );
};

export default StringEdit;
