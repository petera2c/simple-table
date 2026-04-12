import { createMemo } from "solid-js";
import {SimpleTable} from "@simple-table/solid";import type { Theme } from "@simple-table/solid";
import { nestedTablesConfig, generateNestedTablesData } from "./nested-tables.demo-data";
import "@simple-table/solid/styles.css";

export default function NestedTablesDemo(props: { height?: string | number; theme?: Theme }) {
  const sampleData = createMemo(() => generateNestedTablesData(25));

  return (
    <SimpleTable
      autoExpandColumns={nestedTablesConfig.tableProps.autoExpandColumns}
      defaultHeaders={nestedTablesConfig.headers}
      rows={sampleData()}
      rowGrouping={nestedTablesConfig.tableProps.rowGrouping}
      getRowId={nestedTablesConfig.tableProps.getRowId}
      expandAll={nestedTablesConfig.tableProps.expandAll}
      columnResizing={nestedTablesConfig.tableProps.columnResizing}
      height={props.height ?? "500px"}
      theme={props.theme}
    />
  );
}
