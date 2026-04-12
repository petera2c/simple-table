import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableAPI, Row, CellValue, SolidHeaderObject } from "@simple-table/solid";
import { infrastructureData, getInfraMetricColorStyles, getInfraStatusColors } from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";
import "@simple-table/solid/styles.css";

const INFRA_TICK_MS = 20;
const INFRA_ROWS_PER_TICK = 4;
type InfraMetricSlot = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function infraPickRandomSubset<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = t;
  }
  return copy.slice(0, Math.min(n, copy.length));
}

function infraApplyRowPatch(api: TableAPI, rowIndex: number, patch: Partial<Row>) {
  for (const accessor of Object.keys(patch)) {
    const newValue = patch[accessor];
    if (newValue === undefined) continue;
    api.updateData({ accessor, rowIndex, newValue: newValue as CellValue });
  }
}

function infraComputeMetricPatch(row: Row, slot: InfraMetricSlot): Partial<Row> | null {
  switch (slot) {
    case 0: {
      const currentCpu = row.cpuUsage as number;
      if (typeof currentCpu !== "number") return null;
      const cpuChange = (Math.random() - 0.5) * 8;
      const newCpu = Math.min(100, Math.max(0, currentCpu + cpuChange));
      const newCpuRounded = Math.round(newCpu * 10) / 10;
      const currentHistory = row.cpuHistory as number[];
      if (Array.isArray(currentHistory) && currentHistory.length > 0) {
        return { cpuUsage: newCpuRounded, cpuHistory: [...currentHistory.slice(1), newCpuRounded] };
      }
      return { cpuUsage: newCpuRounded };
    }
    case 1: {
      const currentMemory = row.memoryUsage as number;
      if (typeof currentMemory !== "number") return null;
      const memoryChange = (Math.random() - 0.5) * 5;
      const newMemory = Math.min(100, Math.max(0, currentMemory + memoryChange));
      return { memoryUsage: Math.round(newMemory * 10) / 10 };
    }
    case 2: {
      const currentNetIn = row.networkIn as number;
      if (typeof currentNetIn !== "number") return null;
      const netChange = (Math.random() - 0.5) * 100;
      return { networkIn: Math.round(Math.max(0, currentNetIn + netChange) * 100) / 100 };
    }
    case 3: {
      const currentNetOut = row.networkOut as number;
      if (typeof currentNetOut !== "number") return null;
      const netChange = (Math.random() - 0.5) * 60;
      return { networkOut: Math.round(Math.max(0, currentNetOut + netChange) * 100) / 100 };
    }
    case 4: {
      const currentResponseTime = row.responseTime as number;
      if (typeof currentResponseTime !== "number") return null;
      const responseChange = (Math.random() - 0.5) * 100;
      return { responseTime: Math.round(Math.max(10, currentResponseTime + responseChange) * 10) / 10 };
    }
    case 5: {
      const currentConnections = row.activeConnections as number;
      if (typeof currentConnections !== "number") return null;
      const connectionChange = Math.floor((Math.random() - 0.5) * 500);
      return { activeConnections: Math.max(0, currentConnections + connectionChange) };
    }
    case 6: {
      const currentRequests = row.requestsPerSec as number;
      if (typeof currentRequests !== "number") return null;
      const requestChange = Math.floor((Math.random() - 0.5) * 2000);
      return { requestsPerSec: Math.max(0, currentRequests + requestChange) };
    }
    default:
      return null;
  }
}

function startInfraDemoLiveUpdates(getApi: () => TableAPI | null | undefined, rows: Row[]): () => void {
  let isActive = true;
  const idToIndex = new Map<string, number>();
  for (let i = 0; i < rows.length; i++) {
    idToIndex.set(String(rows[i]!.id), i);
  }
  const tick = () => {
    if (!isActive) return;
    const api = getApi();
    if (!api) return;
    const visible = api.getVisibleRows();
    if (!visible.length) return;
    const picks = infraPickRandomSubset(visible, INFRA_ROWS_PER_TICK);
    let usedCpuSparkline = false;
    for (const vr of picks) {
      const idx = idToIndex.get(String(vr.row.id));
      if (idx === undefined) continue;
      let slot = Math.floor(Math.random() * 7) as InfraMetricSlot;
      if (slot === 0 && usedCpuSparkline) slot = (1 + Math.floor(Math.random() * 6)) as InfraMetricSlot;
      if (slot === 0) usedCpuSparkline = true;
      const patch = infraComputeMetricPatch(vr.row, slot);
      if (patch) infraApplyRowPatch(api, idx, patch);
    }
  };
  tick();
  const intervalId = setInterval(tick, INFRA_TICK_MS);
  return () => {
    isActive = false;
    clearInterval(intervalId);
  };
}

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
    cleanupFn = startInfraDemoLiveUpdates(() => tableRef, data);
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
