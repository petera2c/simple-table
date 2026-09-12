import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactColumnDef } from "@simple-table/react";
import { columnReorderingConfig, type CrewMember } from "./column-reordering.demo-data";
import "@simple-table/react/styles.css";

const ColumnReorderingDemo = ({
  height = "400px",
  theme
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [headers, setHeaders] = useState(() => [...columnReorderingConfig.headers]);

  const handleColumnOrderChange = (newHeaders: ReactColumnDef<CrewMember>[]) => {
    setHeaders(newHeaders);
  };

  return (
    <SimpleTable
      columnReordering={columnReorderingConfig.tableProps.columnReordering}
      columns={headers}
      rows={columnReorderingConfig.rows}
      height={height}
      theme={theme}
      getRowId={({ row }) => row.id}
      onColumnOrderChange={handleColumnOrderChange}
    />
  );
};

export default ColumnReorderingDemo;
