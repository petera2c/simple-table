import { useMemo } from "react";
import {SimpleTable} from "@simple-table/react";import type { Theme } from "@simple-table/react";
import { nestedTablesConfig, generateNestedTablesData } from "./nested-tables.demo-data";
import "@simple-table/react/styles.css";

const NestedTablesDemo = ({ height = "500px", theme }: { height?: string | number; theme?: Theme }) => {
  const sampleData = useMemo(() => generateNestedTablesData(25), []);

  return (
    <SimpleTable
      autoExpandColumns={nestedTablesConfig.tableProps.autoExpandColumns}
      defaultHeaders={nestedTablesConfig.headers}
      rows={sampleData}
      rowGrouping={nestedTablesConfig.tableProps.rowGrouping}
      getRowId={nestedTablesConfig.tableProps.getRowId}
      expandAll={nestedTablesConfig.tableProps.expandAll}
      columnResizing={nestedTablesConfig.tableProps.columnResizing}
      height={height}
      theme={theme}
    />
  );
};

export default NestedTablesDemo;
