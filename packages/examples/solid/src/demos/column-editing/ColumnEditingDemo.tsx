import { createSignal, createMemo } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, HeaderObject } from "@simple-table/solid";
import { columnEditingData, columnEditingHeaders } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

export default function ColumnEditingDemo(props: { height?: string | number; theme?: Theme }) {
  const [additionalColumns, setAdditionalColumns] = createSignal<HeaderObject[]>([]);
  const [lastAdded, setLastAdded] = createSignal("");

  const addColumn = () => {
    const n = additionalColumns().length + 1;
    const col: HeaderObject = { accessor: `custom-${n}`, label: `Custom ${n}`, width: 120, type: "string" };
    setAdditionalColumns([...additionalColumns(), col]);
    setLastAdded(col.label);
  };

  const headers = createMemo(() => [...columnEditingHeaders, ...additionalColumns()]);

  return (
    <div>
      <div style={{ "margin-bottom": "12px" }}>
        <button
          type="button"
          onClick={addColumn}
          style={{
            "background-color": "#007bff",
            color: "white",
            border: "none",
            padding: "6px 14px",
            "border-radius": "4px",
            cursor: "pointer",
            "font-size": "13px",
          }}
        >
          + Add Column
        </button>
        {lastAdded() && (
          <span style={{ "margin-left": "12px", color: "#64748b", "font-size": "13px" }}>Added: {lastAdded()}</span>
        )}
      </div>
      <SimpleTable
        defaultHeaders={headers()}
        rows={columnEditingData}
        height={props.height ?? "400px"}
        theme={props.theme}
        enableHeaderEditing
        selectableColumns
        onHeaderEdit={(_header, newLabel) => setLastAdded(`Renamed to: ${newLabel}`)}
      />
    </div>
  );
}
