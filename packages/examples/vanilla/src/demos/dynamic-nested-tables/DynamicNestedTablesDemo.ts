import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, OnRowGroupExpandProps } from "simple-table-core";
import {
  dynamicNestedTablesConfig,
  dynamicNestedTablesData,
  fetchDivisionsForCompany,
} from "@simple-table/examples-shared";
import type { DynamicCompany } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderDynamicNestedTablesDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let rows: DynamicCompany[] = [...dynamicNestedTablesData];

  const handleCompanyExpand = async ({
    row,
    groupingKey,
    isExpanded,
    rowIndexPath,
    setLoading,
    setError,
    setEmpty,
  }: OnRowGroupExpandProps) => {
    if (!isExpanded) return;
    try {
      if (groupingKey === "divisions") {
        const company = row as DynamicCompany;
        if (company.divisions && company.divisions.length > 0) return;
        setLoading(true);
        const divisions = await fetchDivisionsForCompany(company.id);
        if (divisions.length === 0) {
          setEmpty(true, "No divisions found for this company");
          return;
        }
        rows[rowIndexPath[0]] = { ...rows[rowIndexPath[0]], divisions };
        table.updateConfig({ rows: [...rows] });
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load divisions");
    }
  };

  const table = new SimpleTableVanilla(container, {
    autoExpandColumns: dynamicNestedTablesConfig.tableProps.autoExpandColumns,
    defaultHeaders: dynamicNestedTablesConfig.headers,
    expandAll: dynamicNestedTablesConfig.tableProps.expandAll,
    height: options?.height ?? "500px",
    rowGrouping: dynamicNestedTablesConfig.tableProps.rowGrouping,
    getRowId: dynamicNestedTablesConfig.tableProps.getRowId,
    rows: rows,
    onRowGroupExpand: handleCompanyExpand,
    theme: options?.theme,
  });

  return table;
}
