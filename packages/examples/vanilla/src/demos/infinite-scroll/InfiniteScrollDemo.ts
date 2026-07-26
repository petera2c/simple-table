import { SimpleTableVanilla } from "simple-table-core";
import type { InfiniteScrollEmployee } from "./infinite-scroll.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { infiniteScrollConfig, generateInfiniteScrollData } from "./infinite-scroll.demo-data";
import "simple-table-core/styles.css";

const MAX_ROWS = 200;
const BATCH_SIZE = 15;


const getRowId = ({ row }: GetRowIdParams<InfiniteScrollEmployee>) => row.id;
export function renderInfiniteScrollDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<InfiniteScrollEmployee> {
  const wrapper = document.createElement("div");

  const status = document.createElement("div");
  Object.assign(status.style, { marginBottom: "8px", fontSize: "13px", color: "#666" });

  wrapper.appendChild(status);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  let rows: InfiniteScrollEmployee[] = generateInfiniteScrollData(0, 30);
  let loading = false;
  let hasMore = true;

  const updateStatus = () => {
    status.textContent = `${rows.length} rows loaded${hasMore ? "" : " (all loaded)"}`;
  };
  updateStatus();

  const table = new SimpleTableVanilla(tableContainer, {
    getRowId,
    columns: infiniteScrollConfig.headers,
    rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    onLoadMore: () => {
      if (loading || !hasMore) return;
      loading = true;
      table.update({ isLoading: true });
      setTimeout(() => {
        const newRows = generateInfiniteScrollData(rows.length, BATCH_SIZE) ;
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
