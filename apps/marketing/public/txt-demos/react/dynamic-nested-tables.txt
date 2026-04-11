import { useState, useCallback } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import type { OnRowGroupExpandProps } from "simple-table-core";
import {
  dynamicNestedTablesConfig,
  dynamicNestedTablesData,
  fetchDivisionsForCompany,
} from "@simple-table/examples-shared";
import type { DynamicCompany } from "@simple-table/examples-shared";
import "@simple-table/react/styles.css";

const DynamicNestedTablesDemo = ({ height = "500px", theme }: { height?: string | number; theme?: Theme }) => {
  const [rows, setRows] = useState<DynamicCompany[]>([...dynamicNestedTablesData]);

  const handleCompanyExpand = useCallback(
    async ({ row, groupingKey, isExpanded, rowIndexPath, setLoading, setError, setEmpty }: OnRowGroupExpandProps) => {
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
          setRows((prevRows) => {
            const newRows = [...prevRows];
            const companyIndex = rowIndexPath[0];
            newRows[companyIndex] = { ...newRows[companyIndex], divisions };
            return newRows;
          });
        }
      } catch (error) {
        setLoading(false);
        setError(error instanceof Error ? error.message : "Failed to load divisions");
      }
    },
    [],
  );

  return (
    <SimpleTable
      autoExpandColumns={dynamicNestedTablesConfig.tableProps.autoExpandColumns}
      defaultHeaders={dynamicNestedTablesConfig.headers}
      expandAll={dynamicNestedTablesConfig.tableProps.expandAll}
      height={height}
      rowGrouping={dynamicNestedTablesConfig.tableProps.rowGrouping}
      getRowId={dynamicNestedTablesConfig.tableProps.getRowId}
      rows={rows}
      onRowGroupExpand={handleCompanyExpand}
      theme={theme}
    />
  );
};

export default DynamicNestedTablesDemo;
