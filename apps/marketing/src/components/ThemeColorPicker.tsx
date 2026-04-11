import React from "react";
import { ColorPicker, Tooltip } from "antd";
import type { Color } from "antd/es/color-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

interface ThemeColorPickerProps {
  label: string;
  value: string;
  onChange: (color: Color) => void;
  tooltip?: string;
}

const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ label, value, onChange, tooltip }) => {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1.5">
        <Tooltip className="flex items-center gap-2" title={tooltip}>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300" title={label}>
            {label}
          </label>
          {tooltip && <FontAwesomeIcon icon={faInfoCircle} />}
        </Tooltip>
        <div className="text-xs text-gray-500 dark:text-gray-400">{value}</div>
      </div>
      <div className="flex items-center gap-2">
        <ColorPicker size="small" value={value} onChange={onChange} />
        <div
          className="w-full h-6 rounded border border-gray-200 dark:border-gray-700"
          style={{ backgroundColor: value }}
          title={value}
        />
      </div>
    </div>
  );
};

export default ThemeColorPicker;
