import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableAPI, SolidHeaderObject, Row } from "@simple-table/solid";
import {
  infrastructureData,
  INFRA_UPDATE_CONFIG,
  getInfraMetricColorStyles,
  getInfraStatusColors,
} from "@simple-table/examples-shared";
import type { InfrastructureServer } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

function getHeaders(currentTheme?: Theme): SolidHeaderObject[] {
  const t = currentTheme || "light";
  return [
    { accessor: "serverId", align: "left", filterable: true, isEditable: false, isSortable: true, label: "Server ID", minWidth: 180, pinned: "left", type: "string", width: "1.2fr", cellRenderer: ({ row }) => <span style={{ "font-family": "monospace", "font-size": "0.85rem" }}>{(row as unknown as InfrastructureServer).serverId}</span> },
    { accessor: "serverName", align: "left", filterable: true, isEditable: false, isSortable: true, label: "Name", minWidth: 200, type: "string", width: "1.5fr" },
    {
      accessor: "performance", label: "Performance Metrics", width: 690, isSortable: false,
      children: [
        { accessor: "cpuHistory", label: "CPU History", width: 150, isSortable: false, filterable: false, isEditable: false, align: "center", type: "lineAreaChart", tooltip: "CPU usage over the last 30 intervals" },
        {
          accessor: "cpuUsage", label: "CPU %", width: 120, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number",
          cellRenderer: ({ row, theme }) => { const d = row as unknown as InfrastructureServer; const s = getInfraMetricColorStyles(d.cpuUsage, theme || t, "cpu"); return <div style={{ display: "flex", "justify-content": "end" }}><div style={{ padding: "3px 6px", "border-radius": "3px", "font-weight": "600", "font-size": "0.8rem", ...s }}>{d.cpuUsage.toFixed(1)}%</div></div>; },
        },
        {
          accessor: "memoryUsage", label: "Memory %", width: 130, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number",
          cellRenderer: ({ row, theme }) => { const d = row as unknown as InfrastructureServer; const s = getInfraMetricColorStyles(d.memoryUsage, theme || t, "memory"); return <div style={{ display: "flex", "justify-content": "end" }}><div style={{ padding: "3px 6px", "border-radius": "3px", "font-weight": "600", "font-size": "0.8rem", ...s }}>{d.memoryUsage.toFixed(1)}%</div></div>; },
        },
        { accessor: "diskUsage", label: "Disk %", width: 120, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number", cellRenderer: ({ row }) => `${(row as unknown as InfrastructureServer).diskUsage.toFixed(1)}%` },
        {
          accessor: "responseTime", label: "Response (ms)", width: 120, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number",
          cellRenderer: ({ row, theme }) => { const d = row as unknown as InfrastructureServer; const s = getInfraMetricColorStyles(d.responseTime, theme || t, "response"); return <span style={{ "font-weight": "500", ...s }}>{d.responseTime.toFixed(1)}</span>; },
        },
      ],
    },
    {
      accessor: "status", label: "Status", width: 130, isSortable: true, filterable: true, isEditable: false, align: "center", type: "enum",
      enumOptions: [{ label: "Online", value: "online" }, { label: "Warning", value: "warning" }, { label: "Critical", value: "critical" }, { label: "Maintenance", value: "maintenance" }, { label: "Offline", value: "offline" }],
      valueGetter: ({ row }) => { const s = String(row.status); const m: Record<string, number> = { critical: 1, offline: 2, warning: 3, maintenance: 4, online: 5 }; return m[s] || 999; },
      cellRenderer: ({ row, theme }) => { const d = row as unknown as InfrastructureServer; const s = getInfraStatusColors(d.status, theme || t); return <div style={{ ...s, padding: "4px 8px", "border-radius": "4px", "font-size": "0.75rem" }}>{d.status.charAt(0).toUpperCase() + d.status.slice(1)}</div>; },
    },
  ];
}

export default function InfrastructureDemo(props: { height?: string | number; theme?: Theme }) {
  let tableRef: TableAPI | undefined;
  let cleanupFn: (() => void) | undefined;
  const [isMobile, setIsMobile] = createSignal(false);
  const data = infrastructureData;

  createEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    onCleanup(() => window.removeEventListener("resize", check));
  });

  onMount(() => {
    const currentData = JSON.parse(JSON.stringify(data));
    const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
    let isActive = true;

    const createRowTimer = (rowId: string) => {
      const scheduleUpdate = () => {
        if (!isActive) return;
        const interval = INFRA_UPDATE_CONFIG.minInterval + Math.random() * (INFRA_UPDATE_CONFIG.maxInterval - INFRA_UPDATE_CONFIG.minInterval);
        const timerId = setTimeout(() => {
          if (!isActive || !tableRef) return;
          const idx = currentData.findIndex((r: Row) => r.id === rowId);
          if (idx === -1) return;
          const server = currentData[idx] as unknown as InfrastructureServer;

          const cpu = server.cpuUsage;
          if (typeof cpu === "number") {
            const newCpu = Math.round(Math.min(100, Math.max(0, cpu + (Math.random() - 0.5) * 8)) * 10) / 10;
            currentData[idx].cpuUsage = newCpu;
            tableRef.updateData({ accessor: "cpuUsage", rowIndex: idx, newValue: newCpu });
            const hist = server.cpuHistory;
            if (Array.isArray(hist) && hist.length > 0) {
              const updated = [...hist.slice(1), newCpu];
              currentData[idx].cpuHistory = updated;
              tableRef.updateData({ accessor: "cpuHistory", rowIndex: idx, newValue: updated });
            }
          }
          if (Math.random() < 0.4) { const mem = server.memoryUsage; if (typeof mem === "number") { const n = Math.round(Math.min(100, Math.max(0, mem + (Math.random() - 0.5) * 5)) * 10) / 10; currentData[idx].memoryUsage = n; tableRef.updateData({ accessor: "memoryUsage", rowIndex: idx, newValue: n }); } }
          if (Math.random() < 0.5) { const rt = server.responseTime; if (typeof rt === "number") { const n = Math.round(Math.max(10, rt + (Math.random() - 0.5) * 100) * 10) / 10; currentData[idx].responseTime = n; tableRef.updateData({ accessor: "responseTime", rowIndex: idx, newValue: n }); } }
          scheduleUpdate();
        }, interval);
        timerMap.set(rowId, timerId);
      };
      scheduleUpdate();
    };

    const syncTimers = () => {
      if (!tableRef) return;
      const visibleRows = tableRef.getVisibleRows();
      const visibleIds = new Set(visibleRows.map((vr) => String(vr.row.id)));
      timerMap.forEach((tid, rid) => { if (!visibleIds.has(rid)) { clearTimeout(tid); timerMap.delete(rid); } });
      visibleRows.forEach((vr) => { const rid = String(vr.row.id); if (!timerMap.has(rid)) createRowTimer(rid); });
    };

    syncTimers();
    const syncInterval = setInterval(syncTimers, 500);

    cleanupFn = () => { isActive = false; clearInterval(syncInterval); timerMap.forEach((t) => clearTimeout(t)); timerMap.clear(); };
  });

  onCleanup(() => cleanupFn?.());

  return (
    <SimpleTable
      autoExpandColumns={!isMobile()}
      columnReordering
      columnResizing
      defaultHeaders={getHeaders(props.theme)}
      editColumns
      height={props.height ?? "400px"}
      ref={(api) => (tableRef = api)}
      rows={data}
      selectableCells
      theme={props.theme}
    />
  );
}
