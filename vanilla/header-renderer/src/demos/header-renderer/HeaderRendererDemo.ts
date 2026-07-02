import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject, Row } from "simple-table-core";
import { headerRendererConfig } from "./header-renderer.demo-data";
import "simple-table-core/styles.css";

type SortDir = "asc" | "desc" | null;
const CYCLE: SortDir[] = ["asc", "desc", null];

export function renderHeaderRendererDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let sortAccessor: string | null = null;
  let sortDirection: SortDir = null;

  function getSortedData(): Row[] {
    if (!sortAccessor || !sortDirection) return [...headerRendererConfig.rows];
    const acc = sortAccessor;
    const dir = sortDirection;
    return [...headerRendererConfig.rows].sort((a, b) => {
      const aVal = a[acc];
      const bVal = b[acc];
      if (aVal === bVal) return 0;
      const cmp = typeof aVal === "number" && typeof bVal === "number"
        ? (aVal as number) - (bVal as number)
        : String(aVal).localeCompare(String(bVal));
      return dir === "asc" ? cmp : -cmp;
    });
  }

  function buildHeaders(): HeaderObject[] {
    return headerRendererConfig.headers.map((h) => ({
      ...h,
      isSortable: false,
      headerRenderer: () => {
        const isSorted = sortAccessor === h.accessor;
        const dir = isSorted ? sortDirection : null;
        const indicator = dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "";

        const wrapper = document.createElement("div");
        Object.assign(wrapper.style, {
          cursor: "pointer",
          userSelect: "none",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        });
        wrapper.addEventListener("click", () => {
          if (!isSorted) {
            sortAccessor = h.accessor as string;
            sortDirection = "asc";
          } else {
            const idx = CYCLE.indexOf(dir);
            const next = CYCLE[(idx + 1) % CYCLE.length];
            if (next) {
              sortAccessor = h.accessor as string;
              sortDirection = next;
            } else {
              sortAccessor = null;
              sortDirection = null;
            }
          }
          table.update({ defaultHeaders: buildHeaders(), rows: getSortedData() });
        });

        const label = document.createElement("span");
        label.textContent = h.label;
        wrapper.appendChild(label);

        if (indicator) {
          const ind = document.createElement("span");
          Object.assign(ind.style, { fontSize: "10px", color: "#6366f1" });
          ind.textContent = indicator;
          wrapper.appendChild(ind);
        }

        return wrapper;
      },
    }));
  }

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: buildHeaders(),
    rows: getSortedData(),
    height: options?.height ?? "400px",
    theme: options?.theme,
  });

  return table;
}
