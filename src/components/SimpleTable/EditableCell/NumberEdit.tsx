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

  return (
    <input
      className="editable-cell-input"
      ref={ref}
      autoFocus
      defaultValue={defaultValue.toString()}
      onBlur={onBlur}
      onChange={handleChange}
    />
  );
};

export default NumberEdit;
