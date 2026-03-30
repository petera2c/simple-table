import { createSignal, onMount, onCleanup } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, HeaderObject } from "@simple-table/solid";
import { columnResizingHeaders, columnResizingData, COLUMN_RESIZING_STORAGE_KEY } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

export default function ColumnResizingDemo(props: { height?: string | number; theme?: Theme }) {
  const [headers, setHeaders] = createSignal<HeaderObject[]>([...columnResizingHeaders]);
  const [saveMessage, setSaveMessage] = createSignal("");

  let messageTimer: ReturnType<typeof setTimeout> | undefined;

  const clearMessageTimer = () => {
    if (messageTimer !== undefined) {
      clearTimeout(messageTimer);
      messageTimer = undefined;
    }
  };

  onMount(() => {
    try {
      const saved = localStorage.getItem(COLUMN_RESIZING_STORAGE_KEY);
      if (saved) {
        const widthMap = JSON.parse(saved) as Record<string, number | string | undefined>;
        setHeaders(columnResizingHeaders.map((h) => ({ ...h, width: widthMap[h.accessor] ?? h.width })));
      }
    } catch {
      /* ignore */
    }
  });

  onCleanup(() => {
    clearMessageTimer();
  });

  const handleColumnWidthChange = (updatedHeaders: HeaderObject[]) => {
    try {
      const widthMap: Record<string, unknown> = {};
      for (const h of updatedHeaders) widthMap[h.accessor] = h.width;
      localStorage.setItem(COLUMN_RESIZING_STORAGE_KEY, JSON.stringify(widthMap));
      setHeaders(updatedHeaders);
      setSaveMessage("Column widths saved!");
      clearMessageTimer();
      messageTimer = setTimeout(() => setSaveMessage(""), 2000);
    } catch {
      setSaveMessage("Failed to save widths");
      clearMessageTimer();
      messageTimer = setTimeout(() => setSaveMessage(""), 2000);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {saveMessage() && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "#10b981",
            color: "white",
            padding: "8px 16px",
            "border-radius": "6px",
            "font-size": "14px",
            "font-weight": "500",
            "z-index": 1000,
            "box-shadow": "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {saveMessage()}
        </div>
      )}
      <SimpleTable
        columnResizing
        defaultHeaders={headers()}
        rows={columnResizingData}
        height={props.height ?? "400px"}
        theme={props.theme}
        onColumnWidthChange={handleColumnWidthChange}
      />
    </div>
  );
}
