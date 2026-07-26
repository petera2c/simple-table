import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { columnSelectionConfig, type TeamMember } from "./column-selection.demo-data";
import "@simple-table/react/styles.css";

const ColumnSelectionDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable<TeamMember>
      columns={columnSelectionConfig.headers}
      rows={columnSelectionConfig.rows}
      height={height}
      theme={theme}
      getRowId={({ row }) => row.id}
      selectableColumns={columnSelectionConfig.tableProps.selectableColumns}
    />
  );
};

export default ColumnSelectionDemo;
