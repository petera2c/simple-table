import { useState, useMemo } from "react";
import {SimpleTable} from "@simple-table/react";import type { Theme, TableFilterState } from "@simple-table/react";
import { externalFilterConfig, matchesFilter } from "./external-filter.demo-data";
import "@simple-table/react/styles.css";

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
        matchesFilter(row[accessor as keyof typeof row] as any, filter)
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
