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

  return (
    <input
      className="editable-cell-input"
      ref={ref}
      autoFocus
      type="text"
      defaultValue={defaultValue ?? ""}
      onBlur={onBlur}
      onChange={handleChange}
    />
  );
};

export default StringEdit;
