import { useState, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme } from "@simple-table/react";
import type { HeaderObject } from "simple-table-core";
import { columnResizingHeaders, columnResizingData, COLUMN_RESIZING_STORAGE_KEY } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const ColumnResizingDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const [headers, setHeaders] = useState<HeaderObject[]>(columnResizingHeaders);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLUMN_RESIZING_STORAGE_KEY);
      if (saved) {
        const widthMap = JSON.parse(saved);
        setHeaders(
          columnResizingHeaders.map((h) => ({
            ...h,
            width: widthMap[h.accessor] ?? h.width,
          })),
        );
      }
    } catch {
      // ignore
    }
  }, []);

  const handleColumnWidthChange = (updatedHeaders: HeaderObject[]) => {
    try {
      const widthMap = updatedHeaders.reduce(
        (acc, h) => {
          acc[h.accessor] = h.width;
          return acc;
        },
        {} as Record<string, number | string>,
      );
      localStorage.setItem(COLUMN_RESIZING_STORAGE_KEY, JSON.stringify(widthMap));
      setHeaders(updatedHeaders);
      setSaveMessage("Column widths saved!");
      setTimeout(() => setSaveMessage(""), 2000);
    } catch {
      setSaveMessage("Failed to save widths");
      setTimeout(() => setSaveMessage(""), 2000);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {saveMessage && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "#10b981",
            color: "white",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {saveMessage}
        </div>
      )}
      <SimpleTable
        columnResizing
        defaultHeaders={headers}
        rows={columnResizingData}
        height={height}
        theme={theme}
        onColumnWidthChange={handleColumnWidthChange}
      />
    </div>
  );
};

export default ColumnResizingDemo;
