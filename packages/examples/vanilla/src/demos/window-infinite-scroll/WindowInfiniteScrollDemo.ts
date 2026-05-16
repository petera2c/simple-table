import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, Row } from "simple-table-core";
import {
  windowScrollHeaders,
  generateWindowScrollRows,
} from "./window-infinite-scroll.demo-data";
import "simple-table-core/styles.css";

const INITIAL_ROWS = 50;
const BATCH_SIZE = 50;
const MAX_ROWS = 5_000;
const LOAD_DELAY_MS = 350;

/**
 * Window-style infinite scroll demo.
 *
 * The table is given no `height` / `maxHeight` — it grows to its natural size
 * inside whatever scroll parent surrounds it. We pass `scrollParent: container`
 * so the table virtualizes rows and triggers `onLoadMore` based on the demo's
 * outer scroll area (which is `<main class="examples-content">` in this shell;
 * in a regular app you'd pass `"window"` instead). As the user scrolls toward
 * the bottom of the page, more rows are appended.
 */
export function renderWindowInfiniteScrollDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  // The `height` URL param doesn't apply to this demo — the whole point is to
  // let the table grow to fit all rows so the parent scrolls. Same for
  // `maxHeight`. We accept the option to match the demo registry signature
  // but intentionally ignore it.
  void options?.height;

  const wrapper = document.createElement("div");
  wrapper.style.maxWidth = "1100px";
  wrapper.style.margin = "0 auto";

  const heading = document.createElement("h1");
  heading.textContent = "Window-Scroll Infinite Loading";
  Object.assign(heading.style, {
    fontSize: "28px",
    margin: "0 0 12px 0",
    color: "#0f172a",
  });
  wrapper.appendChild(heading);

  const intro = document.createElement("p");
  intro.innerHTML =
    "This table has no <code>height</code> or <code>maxHeight</code>. It grows to its natural size inside the page, " +
    "and uses the outer scroll container (<code>scrollParent</code>) to drive both row virtualization and " +
    "<code>onLoadMore</code>. Scroll down — new rows stream in as you approach the bottom.";
  Object.assign(intro.style, {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#475569",
    margin: "0 0 16px 0",
  });
  wrapper.appendChild(intro);

  const status = document.createElement("div");
  Object.assign(status.style, {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    marginBottom: "16px",
    background: "#eef2ff",
    color: "#3730a3",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "500",
  });
  wrapper.appendChild(status);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);

  const footer = document.createElement("p");
  footer.textContent =
    "End of demo content. Keep scrolling near the bottom and onLoadMore will keep firing until the dataset is exhausted.";
  Object.assign(footer.style, {
    fontSize: "13px",
    color: "#94a3b8",
    margin: "24px 0 48px 0",
    textAlign: "center",
  });
  wrapper.appendChild(footer);

  container.appendChild(wrapper);

  let rows: Row[] = generateWindowScrollRows(0, INITIAL_ROWS);
  let loading = false;
  let hasMore = true;

  const updateStatus = () => {
    const dot = '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#6366f1;"></span>';
    const label = loading
      ? "Loading more rows…"
      : hasMore
        ? `${rows.length.toLocaleString()} rows loaded · scroll for more`
        : `${rows.length.toLocaleString()} rows loaded · end of dataset`;
    status.innerHTML = `${dot}<span>${label}</span>`;
  };
  updateStatus();

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: windowScrollHeaders,
    rows,
    theme: options?.theme,
    getRowId: (p) => String((p.row as { id?: number })?.id),
    // Use the demo container as the scroll parent. In a typical app you would
    // pass `"window"` here — the demo shell wraps everything in a scrollable
    // `<main>` so `window` doesn't actually scroll inside this preview.
    scrollParent: container,
    // Fire onLoadMore a bit earlier than the default so new rows appear before
    // the user hits the very bottom.
    infiniteScrollThreshold: 400,
    onLoadMore: () => {
      if (loading || !hasMore) return;
      loading = true;
      updateStatus();

      setTimeout(() => {
        const next = generateWindowScrollRows(rows.length, BATCH_SIZE);
        rows = [...rows, ...next];
        if (rows.length >= MAX_ROWS) {
          hasMore = false;
          rows = rows.slice(0, MAX_ROWS);
        }
        loading = false;
        table.update({ rows });
        updateStatus();
      }, LOAD_DELAY_MS);
    },
  });

  return table;
}
