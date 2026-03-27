import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, Row } from "simple-table-core";
import { infiniteScrollConfig, generateInfiniteScrollData } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const MAX_ROWS = 200;
const BATCH_SIZE = 15;

export function renderInfiniteScrollDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const status = document.createElement("div");
  Object.assign(status.style, { marginBottom: "8px", fontSize: "13px", color: "#666" });

  wrapper.appendChild(status);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  let rows: Row[] = generateInfiniteScrollData(0, 30) as Row[];
  let loading = false;
  let hasMore = true;

  const updateStatus = () => {
    status.textContent = `${rows.length} rows loaded${hasMore ? "" : " (all loaded)"}`;
  };
  updateStatus();

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: infiniteScrollConfig.headers,
    rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    onLoadMore: () => {
      if (loading || !hasMore) return;
      loading = true;
      table.update({ isLoading: true });
      setTimeout(() => {
        const newRows = generateInfiniteScrollData(rows.length, BATCH_SIZE) as Row[];
        rows = [...rows, ...newRows];
        if (rows.length >= MAX_ROWS) hasMore = false;
        loading = false;
        table.update({ rows, isLoading: false });
        updateStatus();
      }, 500);
    },
  });

  return table;
}
