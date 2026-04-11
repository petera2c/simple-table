import React from "react";
import { Input, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

interface ThemeInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  tooltip?: string;
}

const ThemeInput: React.FC<ThemeInputProps> = ({ label, value, onChange, tooltip }) => {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1.5">
        <Tooltip className="flex items-center gap-2" title={tooltip}>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" title={label}>
            {label}
          </label>
          {tooltip && <FontAwesomeIcon icon={faInfoCircle} />}
        </Tooltip>
      </div>
      <Input size="small" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

export default ThemeInput;
