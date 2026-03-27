import { useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableFilterState, CellValue } from "@simple-table/react";
import { externalFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

function matchesFilter(
  value: CellValue,
  filter: TableFilterState[string]
): boolean {
  const { operator } = filter;

  switch (operator) {
    case "equals":
      return value === filter.value;
    case "notEquals":
      return value !== filter.value;
    case "contains":
      return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
    case "notContains":
      return !String(value).toLowerCase().includes(String(filter.value).toLowerCase());
    case "startsWith":
      return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
    case "endsWith":
      return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
    case "greaterThan":
      return Number(value) > Number(filter.value);
    case "lessThan":
      return Number(value) < Number(filter.value);
    case "greaterThanOrEqual":
      return Number(value) >= Number(filter.value);
    case "lessThanOrEqual":
      return Number(value) <= Number(filter.value);
    case "between":
      return (
        filter.values != null &&
        Number(value) >= Number(filter.values[0]) &&
        Number(value) <= Number(filter.values[1])
      );
    case "in":
      return filter.values != null && filter.values.includes(value);
    case "notIn":
      return filter.values != null && !filter.values.includes(value);
    case "isEmpty":
      return value == null || value === "";
    case "isNotEmpty":
      return value != null && value !== "";
    default:
      return true;
  }
}

const ExternalFilterDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [filters, setFilters] = useState<TableFilterState>({});

  const filteredData = useMemo(() => {
    const filterEntries = Object.entries(filters);
    if (filterEntries.length === 0) return externalFilterConfig.rows;

    return externalFilterConfig.rows.filter((row) =>
      filterEntries.every(([accessor, filter]) =>
        matchesFilter(row[accessor as keyof typeof row] as CellValue, filter)
      )
    );
  }, [filters]);

  return (
    <SimpleTable
      defaultHeaders={externalFilterConfig.headers}
      rows={filteredData}
      onFilterChange={setFilters}
      externalFilterHandling
      columnResizing
      height={height}
      theme={theme}
    />
  );
};

export default ExternalFilterDemo;
