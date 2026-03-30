import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import type { OnRowGroupExpandProps } from "simple-table-core";
import {
  dynamicNestedTablesConfig,
  dynamicNestedTablesData,
  fetchDivisionsForCompany,
} from "@simple-table/examples-shared";
import type { DynamicCompany } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

export default function DynamicNestedTablesDemo(props: { height?: string | number; theme?: Theme }) {
  const [rows, setRows] = createSignal<DynamicCompany[]>([...dynamicNestedTablesData]);

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
        setRows((prev) => {
          const newRows = [...prev];
          newRows[rowIndexPath[0]] = { ...newRows[rowIndexPath[0]], divisions };
          return newRows;
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load divisions");
    }
  };

  return (
    <SimpleTable
      autoExpandColumns={dynamicNestedTablesConfig.tableProps.autoExpandColumns}
      defaultHeaders={dynamicNestedTablesConfig.headers}
      expandAll={dynamicNestedTablesConfig.tableProps.expandAll}
      height={props.height ?? "500px"}
      rowGrouping={dynamicNestedTablesConfig.tableProps.rowGrouping}
      getRowId={dynamicNestedTablesConfig.tableProps.getRowId}
      rows={rows()}
      onRowGroupExpand={handleCompanyExpand}
      theme={props.theme}
    />
  );
}
