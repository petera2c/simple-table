import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import {
  columnAlignmentConfig,
  type ColumnAlignmentPlayer
} from "./column-alignment.demo-data";
import "@simple-table/react/styles.css";

const ColumnAlignmentDemo = ({
  height = "400px",
  theme
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      columns={columnAlignmentConfig.headers}
      getRowId={({ row }) => row.id}
      rows={columnAlignmentConfig.rows}
      height={height}
      theme={theme}
    />
  );
};

export default ColumnAlignmentDemo;
