import { useState } from "react";
import {SimpleTable} from "@simple-table/react";import type { Theme } from "@simple-table/react";
import { themesConfig, AVAILABLE_THEMES } from "./themes.demo-data";
import "@simple-table/react/styles.css";

const ThemesDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme ?? "light");

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {AVAILABLE_THEMES.map((t) => (
          <button
            key={t.value}
            onClick={() => setSelectedTheme(t.value)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: selectedTheme === t.value ? "2px solid #3b82f6" : "1px solid #d1d5db",
              background: selectedTheme === t.value ? "#eff6ff" : "#fff",
              color: selectedTheme === t.value ? "#1d4ed8" : "#374151",
              fontWeight: selectedTheme === t.value ? 600 : 400,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <SimpleTable
        defaultHeaders={themesConfig.headers}
        rows={themesConfig.rows}
        height={height}
        theme={selectedTheme}
      />
    </div>
  );
};

export default ThemesDemo;
