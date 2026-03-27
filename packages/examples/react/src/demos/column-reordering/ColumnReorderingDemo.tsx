import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import type { HeaderObject } from "simple-table-core";
import { columnReorderingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const ColumnReorderingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [headers, setHeaders] = useState<HeaderObject[]>([...columnReorderingConfig.headers]);

  const handleColumnOrderChange = (newHeaders: HeaderObject[]) => {
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
