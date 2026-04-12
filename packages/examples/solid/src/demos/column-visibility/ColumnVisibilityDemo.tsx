import {
  SimpleTable,
  type ColumnVisibilityState,
  type Theme,
} from "@simple-table/solid";
import {
  columnVisibilityConfig,
  getColumnVisibilityDemoHeaders,
  loadColumnVisibilityDemoSaved,
  saveColumnVisibilityDemoState,
} from "./column-visibility.demo-data";
import MarketingColumnEditorRow from "./MarketingColumnEditorRow";
import "@simple-table/solid/styles.css";

export default function ColumnVisibilityDemo(props: { height?: string | number; theme?: Theme }) {
  const headers = () => getColumnVisibilityDemoHeaders(loadColumnVisibilityDemoSaved());

  const onColumnVisibilityChange = (state: ColumnVisibilityState) => {
    saveColumnVisibilityDemoState(state);
  };

  return (
    <SimpleTable
      defaultHeaders={headers()}
      rows={columnVisibilityConfig.rows}
      editColumns
      editColumnsInitOpen
      height={props.height ?? "400px"}
      theme={props.theme}
      onColumnVisibilityChange={onColumnVisibilityChange}
      columnEditorConfig={{
        ...columnVisibilityConfig.tableProps.columnEditorConfig,
        rowRenderer: MarketingColumnEditorRow,
      }}
    />
  );
}
