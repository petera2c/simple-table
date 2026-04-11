import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidHeaderObject, CellRendererProps } from "@simple-table/solid";
import { cellRendererConfig } from "@simple-table/examples-shared";
import type { CellRendererEmployee } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase();

const TeamCell = (props: CellRendererProps) => {
  const members = (props.row as CellRendererEmployee).teamMembers;
  return (
    <div style={{ display: "flex", "align-items": "center", gap: "6px" }}>
      {members.map((m) => (
        <div style={{ display: "flex", "align-items": "center", gap: "4px" }}>
          <div
            style={{
              width: "24px",
              height: "24px",
              "border-radius": "50%",
              background: "#DBEAFE",
              color: "#1E40AF",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              "font-size": "10px",
              "font-weight": "600",
              "flex-shrink": "0",
            }}
          >
            {getInitials(m.name)}
          </div>
          <span style={{ "font-size": "13px", "white-space": "nowrap" }}>{m.name}</span>
        </div>
      ))}
    </div>
  );
};

const WebsiteCell = (props: CellRendererProps) => {
  const url = String(props.value);
  return (
    <span>
      🌐{" "}
      <a
        href={`https://${url}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#2563EB", "text-decoration": "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        {url}
      </a>
    </span>
  );
};

const StatusCell = (props: CellRendererProps) => {
  const status = String(props.value);
  const map: Record<string, { icon: string; color: string }> = {
    active: { icon: "✓", color: "#10B981" },
    inactive: { icon: "✕", color: "#EF4444" },
    pending: { icon: "!", color: "#F59E0B" },
  };
  const { icon, color } = map[status] ?? { icon: "?", color: "#6b7280" };
  return (
    <span style={{ color, "font-weight": "600", "text-transform": "capitalize" }}>
      {icon} {status}
    </span>
  );
};

const ProgressCell = (props: CellRendererProps) => {
  const pct = Number(props.value) || 0;
  const color = pct < 30 ? "#EF4444" : pct < 70 ? "#F59E0B" : "#10B981";
  return (
    <div>
      <div style={{ "font-size": "12px", "margin-bottom": "2px" }}>{pct}%</div>
      <div style={{ height: "10px", background: "#E5E7EB", "border-radius": "5px", overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            "border-radius": "5px",
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
};

const RatingCell = (props: CellRendererProps) => {
  const rating = Number(props.value) || 0;
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.25;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <span style={{ display: "flex", "align-items": "center", gap: "4px" }}>
      <span style={{ color: "#F59E0B", "letter-spacing": "1px" }}>
        {"★".repeat(full)}
        {hasHalf && <span style={{ opacity: "0.5" }}>★</span>}
        {"☆".repeat(Math.max(0, empty))}
      </span>
      <span style={{ "font-size": "12px", color: "#6b7280" }}>{rating}</span>
    </span>
  );
};

const VerifiedCell = (props: CellRendererProps) => {
  const yes = Boolean(props.value);
  return (
    <span style={{ color: yes ? "#10B981" : "#EF4444", "font-weight": "600" }}>
      {yes ? "✓ Yes" : "✕ No"}
    </span>
  );
};

const TagsCell = (props: CellRendererProps) => {
  const tags = Array.isArray(props.value) ? (props.value as string[]) : [];
  return (
    <div style={{ display: "flex", gap: "4px", "flex-wrap": "nowrap", overflow: "hidden" }}>
      {tags.map((tag) => (
        <span
          style={{
            display: "inline-block",
            padding: "2px 8px",
            "border-radius": "4px",
            "font-size": "12px",
            "font-weight": "500",
            background: "#DBEAFE",
            color: "#1E40AF",
            "white-space": "nowrap",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

const HEADERS: SolidHeaderObject[] = cellRendererConfig.headers.map((h) => {
  const renderers: Record<string, (props: CellRendererProps) => any> = {
    teamMembers: TeamCell,
    website: WebsiteCell,
    status: StatusCell,
    progress: ProgressCell,
    rating: RatingCell,
    verified: VerifiedCell,
    tags: TagsCell,
  };
  const cellRenderer = renderers[h.accessor as string];
  return cellRenderer ? { ...h, cellRenderer } : { ...h };
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
