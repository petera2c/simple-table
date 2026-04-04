import { useState } from "react";
import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme, HeaderObject } from "@simple-table/react";
import { columnReorderingConfig } from "./column-reordering.demo-data";
import "@simple-table/react/styles.css";

const ColumnReorderingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [headers, setHeaders] = useState(() =>
    defaultHeadersFromCore([...columnReorderingConfig.headers]),
  );

  const handleColumnOrderChange = (newHeaders: HeaderObject[]) => {
    setHeaders(defaultHeadersFromCore(newHeaders));
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
