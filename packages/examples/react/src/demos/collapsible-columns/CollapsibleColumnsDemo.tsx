import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import {
  collapsibleColumnsConfig,
  type CollapsibleSalesRep,
} from "./collapsible-columns.demo-data";
import "@simple-table/react/styles.css";

const CollapsibleColumnsDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable<CollapsibleSalesRep>
      columns={collapsibleColumnsConfig.headers}
      getRowId={({ row }) => row.id}
      rows={collapsibleColumnsConfig.rows}
      columnResizing
      enableColumnEditor
      selectableCells
      columnReordering
      height={height}
      theme={theme}
    />
  );
};

export default CollapsibleColumnsDemo;
