import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { collapsibleColumnsConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const CollapsibleColumnsDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={collapsibleColumnsConfig.headers}
      rows={collapsibleColumnsConfig.rows}
      columnResizing
      height={height}
      theme={theme}
    />
  );
};

export default CollapsibleColumnsDemo;
