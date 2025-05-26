import React from "react";

interface FilterActionsProps {
  onApply: () => void;
  onClear?: () => void;
  canApply: boolean;
  showClear: boolean;
}

const FilterActions: React.FC<FilterActionsProps> = ({ onApply, onClear, canApply, showClear }) => {
  return (
    <div className="st-filter-actions">
      <button
        onClick={onApply}
        disabled={!canApply}
        className={`st-filter-button st-filter-button-apply ${
          !canApply ? "st-filter-button-disabled" : ""
        }`}
      >
        Apply
      </button>

      {showClear && onClear && (
        <button onClick={onClear} className="st-filter-button st-filter-button-clear">
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterActions;
