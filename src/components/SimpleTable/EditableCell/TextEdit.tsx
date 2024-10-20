import React, { useRef } from "react";

interface TextInputProps {
  defaultValue: string;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextEdit = ({ defaultValue, onBlur, onChange }: TextInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <input
      className="editable-cell-input"
      ref={ref}
      autoFocus
      type="text"
      defaultValue={defaultValue}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};

export default TextEdit;
