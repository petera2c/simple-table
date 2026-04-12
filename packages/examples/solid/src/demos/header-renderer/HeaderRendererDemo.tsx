import { createSignal, createMemo } from "solid-js";
import {SimpleTable} from "@simple-table/solid";import type { Theme, SolidHeaderObject, HeaderRendererProps } from "@simple-table/solid";
import { headerRendererConfig } from "./header-renderer.demo-data";
import "@simple-table/solid/styles.css";

type SortDir = "asc" | "desc" | null;
const CycleOrder: SortDir[] = ["asc", "desc", null];

export default function HeaderRendererDemo(props: { height?: string | number; theme?: Theme }) {
  const [sortAccessor, setSortAccessor] = createSignal<string | null>(null);
  const [sortDirection, setSortDirection] = createSignal<SortDir>(null);

  const sortedData = createMemo(() => {
    const acc = sortAccessor();
    const dir = sortDirection();
    if (!acc || !dir) return [...headerRendererConfig.rows];
    return [...headerRendererConfig.rows].sort((a, b) => {
      const aVal = a[acc];
      const bVal = b[acc];
      if (aVal === bVal) return 0;
      const cmp = typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return dir === "asc" ? cmp : -cmp;
    });
  });

  const headers = createMemo((): SolidHeaderObject[] =>
    headerRendererConfig.headers.map((h) => ({
      ...h,
      isSortable: false,
      headerRenderer: ({ accessor }: HeaderRendererProps) => {
        const isSorted = sortAccessor() === accessor;
        const dir = isSorted ? sortDirection() : null;
        const indicator = dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "";

        const handleClick = () => {
          if (!isSorted) {
            setSortAccessor(accessor as string);
            setSortDirection("asc");
            return;
          }
          const idx = CycleOrder.indexOf(dir);
          const next = CycleOrder[(idx + 1) % CycleOrder.length];
          setSortAccessor(next ? (accessor as string) : null);
          setSortDirection(next);
        };

        return (
          <div
            onClick={handleClick}
            style={{
              cursor: "pointer",
              "user-select": "none",
              "font-weight": "600",
              display: "flex",
              "align-items": "center",
              gap: "4px",
            }}
          >
            <span>{h.label}</span>
            {indicator && (
              <span style={{ "font-size": "10px", color: "#6366f1" }}>{indicator}</span>
            )}
          </div>
        );
      },
    }))
  );

  return (
    <SimpleTable
      defaultHeaders={headers()}
      rows={sortedData()}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
