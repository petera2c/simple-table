import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject } from "@simple-table/react";
import { columnReorderingConfig } from "./column-reordering.demo-data";
import "@simple-table/react/styles.css";

const ColumnReorderingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [headers, setHeaders] = useState(() => [...columnReorderingConfig.headers]);

  const handleColumnOrderChange = (newHeaders: ReactHeaderObject[]) => {
    setHeaders(newHeaders);
  };

  return (
    <SimpleTable
      columnReordering={columnReorderingConfig.tableProps.columnReordering}
      defaultHeaders={headers}
      rows={columnReorderingConfig.rows}
      height={height}
      theme={theme}
      onColumnOrderChange={handleColumnOrderChange}
    />
  );
};

export default ColumnReorderingDemo;
