import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactColumnDef } from "@simple-table/react";
import { animationsConfig } from "./animations.demo-data";
import "@simple-table/react/styles.css";

const AnimationsDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [headers, setHeaders] = useState(() => [...animationsConfig.headers]);

  const handleColumnOrderChange = (newHeaders: ReactColumnDef[]) => {
    setHeaders(newHeaders);
  };

  return (
    <SimpleTable
      columnReordering={animationsConfig.tableProps.columnReordering}
      columns={headers}
      enableColumnEditor={animationsConfig.tableProps.enableColumnEditor}
      enableColumnEditorInitOpen={animationsConfig.tableProps.enableColumnEditorInitOpen}
      rows={animationsConfig.rows}
      height={height}
      theme={theme}
      onColumnOrderChange={handleColumnOrderChange}
    />
  );
};

export default AnimationsDemo;
