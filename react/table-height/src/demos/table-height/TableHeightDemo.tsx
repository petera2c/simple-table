import { useState } from "react";
import {SimpleTable} from "@simple-table/react";import type { Theme } from "@simple-table/react";
import { tableHeightConfig } from "./table-height.demo-data";
import "@simple-table/react/styles.css";

const heights = ["200px", "300px", "400px"] as const;

const TableHeightDemo = ({
  height: _height,
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [selectedHeight, setSelectedHeight] = useState<string>("400px");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {heights.map((h) => (
          <button
            key={h}
            onClick={() => setSelectedHeight(h)}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "1px solid #ccc",
              background: selectedHeight === h ? "#3b82f6" : "#f3f4f6",
              color: selectedHeight === h ? "#fff" : "#374151",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {h}
          </button>
        ))}
      </div>
      <SimpleTable
        defaultHeaders={tableHeightConfig.headers}
        rows={tableHeightConfig.rows}
        height={selectedHeight}
        theme={theme}
      />
    </div>
  );
};

export default TableHeightDemo;
