import { useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, QuickFilterMode } from "@simple-table/react";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const QuickFilterDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [searchText, setSearchText] = useState("");
  const [filterMode, setFilterMode] = useState<QuickFilterMode>("simple");
  const [caseSensitive, setCaseSensitive] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: 13,
            minWidth: 200,
          }}
        />
        <button
          onClick={() => setFilterMode("simple")}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: filterMode === "simple" ? "2px solid #3b82f6" : "1px solid #d1d5db",
            background: filterMode === "simple" ? "#eff6ff" : "#fff",
            color: filterMode === "simple" ? "#1d4ed8" : "#374151",
            fontWeight: filterMode === "simple" ? 600 : 400,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Simple
        </button>
        <button
          onClick={() => setFilterMode("smart")}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: filterMode === "smart" ? "2px solid #3b82f6" : "1px solid #d1d5db",
            background: filterMode === "smart" ? "#eff6ff" : "#fff",
            color: filterMode === "smart" ? "#1d4ed8" : "#374151",
            fontWeight: filterMode === "smart" ? 600 : 400,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Smart
        </button>
        <button
          onClick={() => setCaseSensitive((prev) => !prev)}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: caseSensitive ? "2px solid #3b82f6" : "1px solid #d1d5db",
            background: caseSensitive ? "#eff6ff" : "#fff",
            color: caseSensitive ? "#1d4ed8" : "#374151",
            fontWeight: caseSensitive ? 600 : 400,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Case Sensitive
        </button>
      </div>
      <SimpleTable
        defaultHeaders={quickFilterConfig.headers}
        rows={quickFilterConfig.rows}
        height={height}
        theme={theme}
        quickFilter={{ text: searchText, mode: filterMode, caseSensitive }}
      />
    </div>
  );
};

export default QuickFilterDemo;
