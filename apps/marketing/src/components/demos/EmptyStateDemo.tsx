import { SimpleTable } from "@simple-table/react";
import type { ReactHeaderObject, Theme } from "@simple-table/react";
import "@simple-table/react/styles.css";

const HEADERS: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: "1fr", minWidth: 150, type: "string" },
  { accessor: "email", label: "Email", width: 220, type: "string" },
  { accessor: "department", label: "Department", width: 150, type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
];

const EmptyStateDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const emptyState = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        gap: "12px",
      }}
    >
      <svg
        style={{ width: 48, height: 48, color: "#9ca3af" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#6b7280" }}>
        No data available
      </p>
    </div>
  );

  return (
    <SimpleTable
      defaultHeaders={HEADERS}
      height={height}
      rows={[]}
      tableEmptyStateRenderer={emptyState}
      theme={theme}
    />
  );
};

export default EmptyStateDemo;
