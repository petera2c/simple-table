import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { PivotConfig, Theme } from "@simple-table/react";
import { pivotDemoConfig } from "./pivot.demo-data";
import type { PivotFact } from "./pivot.demo-data";
import "@simple-table/react/styles.css";

const INITIAL_PIVOT: PivotConfig<PivotFact> = {
  rows: ["region", "product"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
};

const PivotDemo = ({
  height = "500px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [pivotEnabled, setPivotEnabled] = useState(true);
  const [pivot, setPivot] = useState<PivotConfig<PivotFact> | null>(INITIAL_PIVOT);

  const handlePivotEnabledChange = (enabled: boolean) => {
    setPivotEnabled(enabled);
    if (enabled && pivot === null) {
      setPivot(INITIAL_PIVOT);
    }
  };

  return (
    <div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          fontSize: 14,
          color: "#374151",
        }}
      >
        <input
          type="checkbox"
          checked={pivotEnabled}
          onChange={(e) => handlePivotEnabledChange(e.target.checked)}
          aria-label="Pivot mode"
        />
        Pivot mode
      </label>
      <SimpleTable
        columns={pivotDemoConfig.headers}
        rows={pivotDemoConfig.rows}
        autoExpandColumns
        columnResizing
        enableColumnEditor
        enableColumnEditorInitOpen
        enablePivotPanel={pivotEnabled}
        height={height}
        pivot={pivotEnabled ? pivot : null}
        onPivotChange={setPivot}
        selectableCells
        theme={theme}
        getRowId={({ row }) => (row?.id == null ? undefined : String(row.id))}
      />
    </div>
  );
};

export default PivotDemo;
