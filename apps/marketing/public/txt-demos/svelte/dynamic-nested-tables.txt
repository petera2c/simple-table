<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme, OnRowGroupExpandProps } from "@simple-table/svelte";
  import {
    dynamicNestedTablesConfig,
    dynamicNestedTablesData,
    fetchDivisionsForCompany,
  } from "./dynamic-nested-tables.demo-data";
  import type { DynamicCompany } from "./dynamic-nested-tables.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "500px", theme }: { height?: string | number; theme?: Theme } = $props();

  let rows = $state<DynamicCompany[]>([...dynamicNestedTablesData]);

  async function handleCompanyExpand({
    row,
    groupingKey,
    isExpanded,
    rowIndexPath,
    setLoading,
    setError,
    setEmpty,
  }: OnRowGroupExpandProps) {
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
        const newRows = [...rows];
        newRows[rowIndexPath[0]] = { ...newRows[rowIndexPath[0]], divisions };
        rows = newRows;
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load divisions");
    }
  }
</script>

<SimpleTable
  autoExpandColumns={dynamicNestedTablesConfig.tableProps.autoExpandColumns}
  defaultHeaders={defaultHeadersFromCore(dynamicNestedTablesConfig.headers)}
  expandAll={dynamicNestedTablesConfig.tableProps.expandAll}
  {height}
  rowGrouping={dynamicNestedTablesConfig.tableProps.rowGrouping}
  getRowId={dynamicNestedTablesConfig.tableProps.getRowId}
  rows={rows}
  onRowGroupExpand={handleCompanyExpand}
  {theme}
/>
