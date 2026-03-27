import { SimpleTable } from "@simple-table/solid";
import type { Theme } from "@simple-table/solid";
import { externalFilterConfig } from "@simple-table/examples-shared";
import { createSignal, createMemo } from "solid-js";
import "simple-table-core/styles.css";

export default function ExternalFilterDemo(props: {
  height?: string | number;
  theme?: Theme;
}) {
  const [filterText, setFilterText] = createSignal("");

  const filteredRows = createMemo(() => {
    const text = filterText().toLowerCase();
    if (!text) return externalFilterConfig.rows;
    return externalFilterConfig.rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(text)
      )
    );
  });

  return (
    <div>
      <div style={{ "margin-bottom": "8px" }}>
        <input
          type="text"
          placeholder="Filter rows..."
          value={filterText()}
          onInput={(e) => setFilterText(e.currentTarget.value)}
          style={{ padding: "4px 8px" }}
        />
      </div>
      <SimpleTable
        defaultHeaders={externalFilterConfig.headers}
        rows={filteredRows()}
        height={props.height ?? "400px"}
        theme={props.theme}
      />
    </div>
  );
}
