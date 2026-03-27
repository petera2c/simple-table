import { useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject, CellRendererProps } from "@simple-table/react";
import { cellRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const StatusCell = ({ value }: CellRendererProps) => {
  const status = String(value);
  const map: Record<string, { icon: string; color: string }> = {
    active: { icon: "✓", color: "#16a34a" },
    inactive: { icon: "✕", color: "#dc2626" },
    pending: { icon: "!", color: "#ca8a04" },
  };
  const { icon, color } = map[status] ?? { icon: "?", color: "#6b7280" };
  return <span style={{ color, fontWeight: 600 }}>{icon} {status}</span>;
};

const ProgressCell = ({ value }: CellRendererProps) => {
  const pct = Number(value) || 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: pct >= 80 ? "#16a34a" : pct >= 50 ? "#ca8a04" : "#dc2626",
            borderRadius: 4,
            transition: "width 0.3s",
          }}
        />
      </div>
      <span style={{ fontSize: 12, minWidth: 32, textAlign: "right" }}>{pct}%</span>
    </div>
  );
};

const RatingCell = ({ value }: CellRendererProps) => {
  const n = Number(value) || 0;
  return (
    <span style={{ color: "#f59e0b", letterSpacing: 2 }}>
      {"★".repeat(n)}{"☆".repeat(Math.max(0, 5 - n))}
    </span>
  );
};

const VerifiedCell = ({ value }: CellRendererProps) => {
  const yes = Boolean(value);
  return (
    <span style={{ color: yes ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
      {yes ? "✓ Yes" : "✕ No"}
    </span>
  );
};

const TagsCell = ({ value }: CellRendererProps) => {
  const tags = Array.isArray(value) ? value : [];
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {tags.map((tag: string) => (
        <span
          key={tag}
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 500,
            background: "#e0e7ff",
            color: "#3730a3",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

const CellRendererDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const headers: ReactHeaderObject[] = useMemo(
    () =>
      cellRendererConfig.headers.map((h) => {
        const renderers: Record<string, React.ComponentType<CellRendererProps>> = {
          status: StatusCell,
          progress: ProgressCell,
          rating: RatingCell,
          verified: VerifiedCell,
          tags: TagsCell,
        };
        const cellRenderer = renderers[h.accessor as string];
        return cellRenderer ? { ...h, cellRenderer } : { ...h };
      }),
    [],
  );

  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={cellRendererConfig.rows}
      height={height}
      theme={theme}
    />
  );
};

export default CellRendererDemo;
