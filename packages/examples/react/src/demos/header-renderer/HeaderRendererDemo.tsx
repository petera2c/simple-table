import { useState, useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject, HeaderRendererProps } from "@simple-table/react";
import { headerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

type SortDir = "asc" | "desc" | null;
interface SortState {
  accessor: string;
  direction: SortDir;
}

const CycleOrder: SortDir[] = ["asc", "desc", null];

const HeaderRendererDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [sortState, setSortState] = useState<SortState | null>(null);

  const sortedData = useMemo(() => {
    if (!sortState || !sortState.direction) return [...headerRendererConfig.rows];
    const { accessor, direction } = sortState;
    return [...headerRendererConfig.rows].sort((a, b) => {
      const aVal = a[accessor];
      const bVal = b[accessor];
      if (aVal === bVal) return 0;
      const cmp = typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return direction === "asc" ? cmp : -cmp;
    });
  }, [sortState]);

  const headers: ReactHeaderObject[] = useMemo(
    () =>
      headerRendererConfig.headers.map((h) => ({
        ...h,
        isSortable: false,
        headerRenderer: ({ accessor }: HeaderRendererProps) => {
          const isSorted = sortState?.accessor === accessor;
          const dir = isSorted ? sortState!.direction : null;
          const indicator = dir === "asc" ? " ▲" : dir === "desc" ? " ▼" : "";

          const handleClick = () => {
            if (!isSorted) {
              setSortState({ accessor: accessor as string, direction: "asc" });
              return;
            }
            const idx = CycleOrder.indexOf(dir);
            const next = CycleOrder[(idx + 1) % CycleOrder.length];
            setSortState(next ? { accessor: accessor as string, direction: next } : null);
          };

          return (
            <div
              onClick={handleClick}
              style={{
                cursor: "pointer",
                userSelect: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{h.label}</span>
              {indicator && (
                <span style={{ fontSize: 10, color: "#6366f1" }}>{indicator}</span>
              )}
            </div>
          );
        },
      })),
    [sortState],
  );

  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={sortedData}
      height={height}
      theme={theme}
    />
  );
};

export default HeaderRendererDemo;
