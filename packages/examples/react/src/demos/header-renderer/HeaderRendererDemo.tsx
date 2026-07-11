import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject, HeaderRendererProps } from "@simple-table/react";
import { headerRendererConfig } from "./header-renderer.demo-data";
import "@simple-table/react/styles.css";

/**
 * Stateful header control. Pin should survive built-in sort/filter icon refreshes.
 * If core remounts the React headerRenderer on sort, the pin snaps back off.
 */
const StatefulHeader = ({ header, components }: HeaderRendererProps) => {
  const [pinned, setPinned] = useState(false);
  const [clicks, setClicks] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        width: "100%",
        minWidth: 0,
        padding: "0 4px",
      }}
    >
      <span
        style={{
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
          flex: 1,
        }}
      >
        {header.label}
      </span>
      <button
        type="button"
        aria-label={pinned ? `Unpin ${header.label}` : `Pin ${header.label}`}
        aria-pressed={pinned}
        title="Toggle pin, then sort — pin should stay on"
        onClick={(event) => {
          event.stopPropagation();
          setPinned((value) => !value);
          setClicks((n) => n + 1);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexShrink: 0,
          height: 22,
          padding: "0 6px",
          border: "1px solid",
          borderColor: pinned ? "#6366f1" : "#d1d5db",
          borderRadius: 6,
          background: pinned ? "#eef2ff" : "#fff",
          color: pinned ? "#4f46e5" : "#6b7280",
          cursor: "pointer",
          fontSize: 12,
          lineHeight: 1,
          fontWeight: 600,
        }}
      >
        {pinned ? "★" : "☆"} {clicks}
      </button>
      {components?.filterIcon}
      {components?.sortIcon}
    </div>
  );
};

const headers: ReactHeaderObject[] = headerRendererConfig.headers.map((h) => ({
  ...h,
  // Keep built-in sorting so sort icon refresh goes through core's header path.
  isSortable: h.isSortable ?? true,
  filterable: h.accessor === "role" || h.accessor === "department",
  headerRenderer: StatefulHeader,
}));

const HeaderRendererDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
      <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.4 }}>
        Click a header ★ to pin it, then sort that column. The pin (and click count) should stay —
        if the header remounts on sort, both reset.
      </p>
      <SimpleTable
        defaultHeaders={headers}
        rows={headerRendererConfig.rows}
        height={height}
        theme={theme}
        columnResizing
        selectableCells
      />
    </div>
  );
};

export default HeaderRendererDemo;
