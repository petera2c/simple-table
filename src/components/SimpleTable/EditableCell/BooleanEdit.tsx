import React from "react";

interface BooleanSelectProps {
  value: boolean;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const BooleanSelect = ({ value, onBlur, onChange }: BooleanSelectProps) => (
  <select value={value.toString()} onBlur={onBlur} onChange={onChange}>
    <option value="true">True</option>
    <option value="false">False</option>
  </select>
);

export default BooleanSelect;
