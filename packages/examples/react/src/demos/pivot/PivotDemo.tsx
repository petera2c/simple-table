import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import { pivotDemoConfig, pivotPresets } from "./pivot.demo-data";
import "@simple-table/react/styles.css";

const PivotDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [activeId, setActiveId] = useState(pivotPresets[0].id);
  const active = pivotPresets.find((p) => p.id === activeId) ?? pivotPresets[0];
  const nestedRows = active.pivot.rows.length > 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {pivotPresets.map((preset) => {
          const selected = preset.id === activeId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActiveId(preset.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                background: selected ? "#2563eb" : "#e5e7eb",
                color: selected ? "#fff" : "#374151",
              }}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <SimpleTable
        columns={pivotDemoConfig.headers}
        rows={pivotDemoConfig.rows}
        pivot={active.pivot}
        columnResizing
        expandAll={nestedRows}
        height={height}
        selectableCells
        theme={theme}
      />
    </div>
  );
};

export default PivotDemo;
