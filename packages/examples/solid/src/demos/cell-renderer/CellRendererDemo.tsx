import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidHeaderObject, CellRendererProps } from "@simple-table/solid";
import { cellRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const StatusCell = (props: CellRendererProps) => {
  const v = props.value as string;
  const color = v === "active" ? "#22c55e" : v === "pending" ? "#f59e0b" : "#94a3b8";
  return <span style={{ color, "font-weight": "600" }}>{v === "active" ? "\u25CF" : "\u25CB"} {v}</span>;
};

const ProgressCell = (props: CellRendererProps) => {
  const pct = props.value as number;
  return <span>{pct}%</span>;
};

const RatingCell = (props: CellRendererProps) => {
  const n = props.value as number;
  return <span style={{ color: "#f59e0b" }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
};

const VerifiedCell = (props: CellRendererProps) => {
  const ok = props.value as boolean;
  return <span style={{ color: ok ? "#22c55e" : "#94a3b8" }}>{ok ? "✓ Yes" : "✗ No"}</span>;
};

const TagsCell = (props: CellRendererProps) => {
  const tags = props.row.tags as string[];
  return (
    <span>
      {tags.map((t) => (
        <span style={{
          display: "inline-block",
          padding: "1px 6px",
          margin: "0 2px",
          "border-radius": "3px",
          "background": "#e2e8f0",
          "font-size": "11px",
        }}>{t}</span>
      ))}
    </span>
  );
};

const HEADERS: SolidHeaderObject[] = cellRendererConfig.headers.map((h) => {
  switch (h.accessor) {
    case "status": return { ...h, cellRenderer: StatusCell };
    case "progress": return { ...h, cellRenderer: ProgressCell };
    case "rating": return { ...h, cellRenderer: RatingCell };
    case "verified": return { ...h, cellRenderer: VerifiedCell };
    case "tags": return { ...h, cellRenderer: TagsCell };
    default: return h;
  }
});

export default function CellRendererDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable
      defaultHeaders={HEADERS}
      rows={cellRendererConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
      selectableCells={cellRendererConfig.tableProps.selectableCells}
      customTheme={cellRendererConfig.tableProps.customTheme}
    />
  );
}
