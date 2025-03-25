import React from "react";

interface BooleanSelectProps {
  value: boolean;
  onBlur: () => void;
  onChange: (value: boolean) => void;
}

const BooleanSelect = ({ value, onBlur, onChange }: BooleanSelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "true") {
      onChange(true);
    } else {
      onChange(false);
    }
  };

  return (
    <select value={value.toString()} onBlur={onBlur} onChange={handleChange}>
      <option value="true">True</option>
      <option value="false">False</option>
    </select>
  );
};

export default BooleanSelect;
