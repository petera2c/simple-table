import { createSignal } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { PivotConfig, Theme } from "@simple-table/solid";
import { pivotDemoConfig } from "./pivot.demo-data";
import "@simple-table/solid/styles.css";

const INITIAL_PIVOT: PivotConfig = {
  rows: ["region", "product"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
};

export default function PivotDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [pivotEnabled, setPivotEnabled] = createSignal(true);
  const [pivot, setPivot] = createSignal<PivotConfig | null>(INITIAL_PIVOT);

  const handlePivotEnabledChange = (enabled: boolean) => {
    setPivotEnabled(enabled);
    if (enabled && pivot() === null) {
      setPivot(INITIAL_PIVOT);
    }
  };

  return (
    <div>
      <label
        style={{
          display: "flex",
          "align-items": "center",
          gap: "8px",
          "margin-bottom": "12px",
          "font-size": "14px",
          color: "#374151",
        }}
      >
        <input
          type="checkbox"
          checked={pivotEnabled()}
          onChange={(e) => handlePivotEnabledChange(e.currentTarget.checked)}
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
        enablePivotPanel={pivotEnabled()}
        height={props.height ?? "500px"}
        pivot={pivotEnabled() ? pivot() : null}
        onPivotChange={setPivot}
        selectableCells
        theme={props.theme}
        getRowId={({ row }) => (row?.id == null ? undefined : String(row.id))}
      />
    </div>
  );
}
