import {SimpleTable} from "@simple-table/react";import type { Theme } from "@simple-table/react";
import { emptyStateConfig } from "./empty-state.demo-data";
import "@simple-table/react/styles.css";

const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
    <path d="M16 3H8L3 7h18l-5-4z" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

const tableEmptyState = (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      color: "#64748b",
      gap: 12,
    }}
  >
    <EmptyIcon />
    <div style={{ fontSize: 16, fontWeight: 600 }}>No data available</div>
    <div style={{ fontSize: 13 }}>Try adjusting your filters or adding new records.</div>
  </div>
);

const EmptyStateDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <SimpleTable
      defaultHeaders={emptyStateConfig.headers}
      rows={emptyStateConfig.rows}
      tableEmptyStateRenderer={tableEmptyState}
      height={height}
      theme={theme}
    />
  );
};

export default EmptyStateDemo;
