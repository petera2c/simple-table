import { SimpleTable, defaultHeadersFromCore, type ColumnEditorRowRendererProps, type ColumnVisibilityState, type Theme } from "@simple-table/solid";
import { createEffect } from "solid-js";
import {
  buildMarketingStyleColumnEditorRowRenderer,
  columnVisibilityConfig,
  getColumnVisibilityDemoHeaders,
  loadColumnVisibilityDemoSaved,
  saveColumnVisibilityDemoState,
} from "./column-visibility.demo-data";
import "@simple-table/solid/styles.css";

/** Same column-editor row layout as the marketing site; Solid cannot render core DOM nodes as JSX children. */
function MarketingColumnEditorRow(props: ColumnEditorRowRendererProps) {
  let anchor: HTMLDivElement | undefined;
  createEffect(() => {
    const el = anchor;
    if (!el) return;
    el.replaceChildren(buildMarketingStyleColumnEditorRowRenderer(props));
  });
  return <div ref={(e) => (anchor = e)} style={{ display: "contents" }} />;
}

export default function ColumnVisibilityDemo(props: { height?: string | number; theme?: Theme }) {
  const headers = () => defaultHeadersFromCore(getColumnVisibilityDemoHeaders(loadColumnVisibilityDemoSaved()));

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
