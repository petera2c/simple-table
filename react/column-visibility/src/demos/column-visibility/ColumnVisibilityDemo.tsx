import {
  SimpleTable,
  type ColumnEditorRowRendererProps,
  type ColumnVisibilityState,
  type Theme,
} from "@simple-table/react";
import { useMemo, useCallback } from "react";
import {
  columnVisibilityConfig,
  getColumnVisibilityDemoHeaders,
  loadColumnVisibilityDemoSaved,
  saveColumnVisibilityDemoState,
} from "./column-visibility.demo-data";
import "@simple-table/react/styles.css";

const ColumnVisibilityDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const headers = useMemo(
    () => getColumnVisibilityDemoHeaders(loadColumnVisibilityDemoSaved()),
    [],
  );

  const onColumnVisibilityChange = useCallback((state: ColumnVisibilityState) => {
    saveColumnVisibilityDemoState(state);
  }, []);

  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={columnVisibilityConfig.rows}
      editColumns
      editColumnsInitOpen
      height={height}
      theme={theme}
      onColumnVisibilityChange={onColumnVisibilityChange}
      columnEditorConfig={{
        ...columnVisibilityConfig.tableProps.columnEditorConfig,
        rowRenderer: ({ components }: ColumnEditorRowRendererProps) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              paddingRight: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {components?.expandIcon}
              {components?.checkbox}
              {components?.labelContent}
            </div>
            <div>{components?.dragIcon}</div>
          </div>
        ),
      }}
    />
  );
};

export default ColumnVisibilityDemo;
