import React from "react";
import { useTableContext } from "../../context/TableContext";
import { FILTER_OPERATOR_LABELS, FilterCondition } from "../../types/FilterTypes";

const FilterBar = () => {
  const { filters, handleClearFilter, headersRef } = useTableContext();

  const activeFilters = Object.values(filters);

  if (activeFilters.length === 0) {
    return null;
  }

  const getFilterDisplayText = (filter: FilterCondition) => {
    const header = headersRef.current.find((h) => h.accessor === filter.accessor);
    const columnName = header?.label || filter.accessor;
    const operatorLabel = FILTER_OPERATOR_LABELS[filter.operator];

    let valueText = "";

    if (filter.value !== undefined) {
      if (typeof filter.value === "boolean") {
        valueText = filter.value ? "True" : "False";
      } else {
        valueText = String(filter.value);
      }
    } else if (filter.values && Array.isArray(filter.values)) {
      if (filter.operator === "between" || filter.operator === "notBetween") {
        valueText = `${filter.values[0]} - ${filter.values[1]}`;
      } else if (filter.operator === "in" || filter.operator === "notIn") {
        valueText = filter.values.join(", ");
      }
    }

    if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
      return `${columnName}: ${operatorLabel}`;
    }

    return `${columnName}: ${operatorLabel} ${valueText}`;
  };

  return (
    <div className="st-filter-bar">
      <div className="st-filter-bar-content">
        <span className="st-filter-bar-label">Filters:</span>
        <div className="st-filter-chips">
          {activeFilters.map((filter) => (
            <div key={filter.accessor} className="st-filter-chip">
              <span className="st-filter-chip-text">{getFilterDisplayText(filter)}</span>
              <button
                className="st-filter-chip-remove"
                onClick={() => handleClearFilter(filter.accessor)}
                aria-label={`Remove filter for ${filter.accessor}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
