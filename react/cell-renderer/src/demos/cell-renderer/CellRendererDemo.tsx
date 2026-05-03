import { useMemo } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, CellRendererProps, ReactHeaderObject } from "@simple-table/react";
import { cellRendererConfig } from "./cell-renderer.demo-data";
import type { CellRendererEmployee } from "./cell-renderer.demo-data";
import "@simple-table/react/styles.css";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const TeamCell = ({ row }: CellRendererProps) => {
  const members = (row as CellRendererEmployee).teamMembers;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {members.map((m) => (
        <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#DBEAFE",
              color: "#1E40AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {getInitials(m.name)}
          </div>
          <span style={{ fontSize: 13, whiteSpace: "nowrap" }}>{m.name}</span>
        </div>
      ))}
    </div>
  );
};

const WebsiteCell = ({ value }: CellRendererProps) => {
  const url = String(value);
  return (
    <span>
      🌐{" "}
      <a
        href={`https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#2563EB", textDecoration: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        {url}
      </a>
    </span>
  );
};

const StatusCell = ({ value }: CellRendererProps) => {
  const status = String(value);
  const map: Record<string, { icon: string; color: string }> = {
    active: { icon: "✓", color: "#10B981" },
    inactive: { icon: "✕", color: "#EF4444" },
    pending: { icon: "!", color: "#F59E0B" },
  };
  const { icon, color } = map[status] ?? { icon: "?", color: "#6b7280" };
  return (
    <span style={{ color, fontWeight: 600, textTransform: "capitalize" }}>
      {icon} {status}
    </span>
  );
};

const ProgressCell = ({ value }: CellRendererProps) => {
  const pct = Number(value) || 0;
  const color = pct < 30 ? "#EF4444" : pct < 70 ? "#F59E0B" : "#10B981";
  return (
    <div>
      <div style={{ fontSize: 12, marginBottom: 2 }}>{pct}%</div>
      <div style={{ height: 10, background: "#E5E7EB", borderRadius: 5, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 5,
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
};

const RatingCell = ({ value }: CellRendererProps) => {
  const rating = Number(value) || 0;
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "#F59E0B", letterSpacing: 1 }}>
        {"★".repeat(full)}
        {hasHalf && <span style={{ opacity: 0.5 }}>★</span>}
        {"☆".repeat(Math.max(0, empty))}
      </span>
      <span style={{ fontSize: 12, color: "#6b7280" }}>{rating}</span>
    </span>
  );
};

const VerifiedCell = ({ value }: CellRendererProps) => {
  const yes = Boolean(value);
  return (
    <span style={{ color: yes ? "#10B981" : "#EF4444", fontWeight: 600 }}>
      {yes ? "✓ Yes" : "✕ No"}
    </span>
  );
};

const TagsCell = ({ value }: CellRendererProps) => {
  const raw = Array.isArray(value) ? value : [];
  const tags = raw.filter((t): t is string => typeof t === "string");
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "nowrap", overflow: "hidden" }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            display: "inline-block",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
            background: "#DBEAFE",
            color: "#1E40AF",
            whiteSpace: "nowrap",
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
  const headers = useMemo(
    () =>
      cellRendererConfig.headers.map((h) => {
        const renderers: Record<string, React.ComponentType<CellRendererProps>> = {
          teamMembers: TeamCell,
          website: WebsiteCell,
          status: StatusCell,
          progress: ProgressCell,
          rating: RatingCell,
          verified: VerifiedCell,
          tags: TagsCell,
        };
        const cellRenderer = renderers[h.accessor as string];
        return cellRenderer ? { ...h, cellRenderer } : h;
      }) as ReactHeaderObject[],
    [],
  );

  return (
    <SimpleTable
      defaultHeaders={headers}
      rows={cellRendererConfig.rows}
      height={height}
      theme={theme}
      selectableCells={cellRendererConfig.tableProps.selectableCells}
      customTheme={cellRendererConfig.tableProps.customTheme}
    />
  );
};

export default CellRendererDemo;
