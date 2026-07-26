import {SimpleTable} from "@simple-table/react";import type { Theme } from "@simple-table/react";
import { nestedHeadersConfig, type StudentScores } from "./nested-headers.demo-data";
import "@simple-table/react/styles.css";

const NestedHeadersDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable<StudentScores>
      columns={nestedHeadersConfig.headers}
      rows={nestedHeadersConfig.rows}
      height={height}
      theme={theme}
      columnResizing={nestedHeadersConfig.tableProps.columnResizing}
      getRowId={({ row }) => row.id}
    />
  );
};

export default NestedHeadersDemo;
