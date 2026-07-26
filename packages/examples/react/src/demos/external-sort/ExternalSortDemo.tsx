import { useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, SortColumn } from "@simple-table/react";
import { externalSortConfig, type SortableEmployee } from "./external-sort.demo-data";
import "@simple-table/react/styles.css";

const ExternalSortDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [sortConfig, setSortConfig] = useState<SortColumn | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return externalSortConfig.rows;
    const sorted = [...externalSortConfig.rows].sort((a, b) => {
      const key = sortConfig.key.accessor as keyof SortableEmployee;
      const aVal = a[key];
      const bVal = b[key];
      if (aVal === bVal) return 0;
      const cmp =
        sortConfig.key.type === "number"
          ? (aVal as number) - (bVal as number)
          : String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [sortConfig]);

  return (
    <SimpleTable<SortableEmployee>
      columns={externalSortConfig.headers}
      rows={sortedData}
      onSortChange={setSortConfig}
      externalSortHandling
      columnResizing
      height={height}
      theme={theme}
      getRowId={({ row }) => row.id}
    />
  );
};

export default ExternalSortDemo;
