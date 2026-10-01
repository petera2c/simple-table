import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, ColumnEditorRowRendererProps, ColumnVisibilityState, GetRowIdParams } from "simple-table-core";
import {
  columnVisibilityConfig,
  getColumnVisibilityDemoHeaders,
  loadColumnVisibilityDemoSaved,
  saveColumnVisibilityDemoState,
} from "./column-visibility.demo-data";
import type { VisibilityEmployee } from "./column-visibility.demo-data";
import "simple-table-core/styles.css";

function attachSlot(slot: unknown, host: HTMLElement): void {
  host.replaceChildren();
  if (slot == null) return;
  if (typeof slot === "string") {
    host.textContent = slot;
  } else if (slot instanceof Node) {
    host.appendChild(slot);
  }
}

function buildMarketingStyleColumnEditorRowRenderer({
  components,
}: ColumnEditorRowRendererProps): HTMLElement {
  const row = document.createElement("div");
  Object.assign(row.style, {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    paddingRight: "8px",
  });

  const left = document.createElement("div");
  Object.assign(left.style, { display: "flex", alignItems: "center", gap: "8px" });

  for (const slot of [components.expandIcon, components.checkbox, components.labelContent]) {
    const host = document.createElement("span");
    attachSlot(slot, host);
    left.appendChild(host);
  }

  row.appendChild(left);

  const dragHost = document.createElement("span");
  attachSlot(components.dragIcon, dragHost);
  row.appendChild(dragHost);

  return row;
}

const getRowId = ({ row }: GetRowIdParams<VisibilityEmployee>) => row.id;

export function renderColumnVisibilityDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<VisibilityEmployee> {
  return new SimpleTableVanilla(container, {
    getRowId,
    columns: getColumnVisibilityDemoHeaders(loadColumnVisibilityDemoSaved()),
    rows: columnVisibilityConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    enableColumnEditor: columnVisibilityConfig.tableProps.enableColumnEditor,
    enableColumnEditorInitOpen: columnVisibilityConfig.tableProps.enableColumnEditorInitOpen,
    onColumnVisibilityChange: (state: ColumnVisibilityState) => {
      saveColumnVisibilityDemoState(state);
    },
    columnEditorConfig: {
      ...columnVisibilityConfig.tableProps.columnEditorConfig,
      rowRenderer: buildMarketingStyleColumnEditorRowRenderer,
    },
  });
}
