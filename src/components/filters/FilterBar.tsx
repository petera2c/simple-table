import React from "react";
import { useTableContext } from "../../context/TableContext";
import { FILTER_OPERATOR_LABELS, FilterCondition } from "../../types/FilterTypes";
import { HeaderObject } from "../..";

const getFilterDisplayText = (filter: FilterCondition, currentHeaders: HeaderObject[]) => {
  const header = currentHeaders.find((h) => h.accessor === filter.accessor);
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

const FilterBar = () => {
  const { filters, handleClearFilter, headersRef } = useTableContext();

  const activeFilters = Object.values(filters);

  if (activeFilters.length === 0 || activeFilters.length > 0) {
    return null;
  }

  return (
    <div className="st-filter-bar">
      <div className="st-filter-bar-content">
        <div className="st-filter-chips">
          {activeFilters.map((filter) => (
            <div key={filter.accessor} className="st-filter-chip">
              <span className="st-filter-chip-text">
                {getFilterDisplayText(filter, headersRef.current)}
              </span>
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
