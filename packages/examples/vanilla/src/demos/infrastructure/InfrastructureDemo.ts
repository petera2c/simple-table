import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, ColumnDef, CellRenderer, TableAPI, Row, CellValue, GetRowIdParams } from "simple-table-core";
import { infrastructureData, getInfraMetricColorStyles, getInfraStatusColors } from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";
import "simple-table-core/styles.css";

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

function infraApplyRowPatch(api: TableAPI, rowId: string | number, patch: Partial<InfrastructureServer>) {
  for (const accessor of Object.keys(patch) as Array<keyof InfrastructureServer>) {
    const newValue = patch[accessor];
    if (newValue === undefined) continue;
    api.updateData({ accessor, rowId, newValue: newValue as CellValue });
  }
}

function infraComputeMetricPatch(row: Row, slot: InfraMetricSlot): Partial<InfrastructureServer> | null {
  switch (slot) {
    case 0: {
      if (typeof row.cpuUsage !== "number") return null;
      const cpuChange = (Math.random() - 0.5) * 8;
      const newCpu = Math.min(100, Math.max(0, row.cpuUsage + cpuChange));
      const newCpuRounded = Math.round(newCpu * 10) / 10;
      const history = row.cpuHistory;
      if (Array.isArray(history) && history.length > 0) {
        return { cpuUsage: newCpuRounded, cpuHistory: [...history.slice(1), newCpuRounded] };
      }
      return { cpuUsage: newCpuRounded };
    }
    case 1: {
      if (typeof row.memoryUsage !== "number") return null;
      const memoryChange = (Math.random() - 0.5) * 5;
      const newMemory = Math.min(100, Math.max(0, row.memoryUsage + memoryChange));
      return { memoryUsage: Math.round(newMemory * 10) / 10 };
    }
    case 2: {
      if (typeof row.networkIn !== "number") return null;
      const netChange = (Math.random() - 0.5) * 100;
      return { networkIn: Math.round(Math.max(0, row.networkIn + netChange) * 100) / 100 };
    }
    case 3: {
      if (typeof row.networkOut !== "number") return null;
      const netChange = (Math.random() - 0.5) * 60;
      return { networkOut: Math.round(Math.max(0, row.networkOut + netChange) * 100) / 100 };
    }
    case 4: {
      if (typeof row.responseTime !== "number") return null;
      const responseChange = (Math.random() - 0.5) * 100;
      return { responseTime: Math.round(Math.max(10, row.responseTime + responseChange) * 10) / 10 };
    }
    case 5: {
      if (typeof row.activeConnections !== "number") return null;
      const connectionChange = Math.floor((Math.random() - 0.5) * 500);
      return { activeConnections: Math.max(0, row.activeConnections + connectionChange) };
    }
    case 6: {
      if (typeof row.requestsPerSec !== "number") return null;
      const requestChange = Math.floor((Math.random() - 0.5) * 2000);
      return { requestsPerSec: Math.max(0, row.requestsPerSec + requestChange) };
    }
    default:
      return null;
  }
}

function startInfraDemoLiveUpdates(getApi: () => TableAPI | null | undefined): () => void {
  let isActive = true;
  const tick = () => {
    if (!isActive) return;
    const api = getApi();
    if (!api) return;
    const visible = api.getVisibleRows();
    if (!visible.length) return;
    const picks = infraPickRandomSubset(visible, INFRA_ROWS_PER_TICK);
    let usedCpuSparkline = false;
    for (const vr of picks) {
      const rowId = vr.row.id;
      if (typeof rowId !== "string" && typeof rowId !== "number") continue;
      if (rowId === "") continue;
      let slot = Math.floor(Math.random() * 7) as InfraMetricSlot;
      if (slot === 0 && usedCpuSparkline) slot = (1 + Math.floor(Math.random() * 6)) as InfraMetricSlot;
      if (slot === 0) usedCpuSparkline = true;
      const patch = infraComputeMetricPatch(vr.row, slot);
      if (patch) infraApplyRowPatch(api, rowId, patch);
    }
  };
  tick();
  const intervalId = setInterval(tick, INFRA_TICK_MS);
  return () => {
    isActive = false;
    clearInterval(intervalId);
  };
}

function getHeaders(currentTheme?: Theme): ColumnDef<InfrastructureServer>[] {
  const t = currentTheme || "light";

  const serverIdRenderer: CellRenderer<InfrastructureServer> = ({ row }) => {
    const d = row;
    const span = document.createElement("span");
    Object.assign(span.style, { fontFamily: "monospace", fontSize: "0.85rem" });
    span.textContent = d.serverId;
    return span;
  };

  const cpuRenderer: CellRenderer<InfrastructureServer> = ({ row, theme }) => {
    const d = row;
    const cpu = d.cpuUsage;
    const s = getInfraMetricColorStyles(cpu, theme || t, "cpu");
    const outer = document.createElement("div");
    outer.style.display = "flex";
    outer.style.justifyContent = "end";
    const badge = document.createElement("div");
    Object.assign(badge.style, { padding: "3px 6px", borderRadius: "3px", fontWeight: "600", fontSize: "0.8rem", color: s.color, backgroundColor: s.backgroundColor ?? "" });
    badge.textContent = `${cpu.toFixed(1)}%`;
    outer.appendChild(badge);
    return outer;
  };

  const memoryRenderer: CellRenderer<InfrastructureServer> = ({ row, theme }) => {
    const d = row;
    const mem = d.memoryUsage;
    const s = getInfraMetricColorStyles(mem, theme || t, "memory");
    const outer = document.createElement("div");
    outer.style.display = "flex";
    outer.style.justifyContent = "end";
    const badge = document.createElement("div");
    Object.assign(badge.style, { padding: "3px 6px", borderRadius: "3px", fontWeight: "600", fontSize: "0.8rem", color: s.color, backgroundColor: s.backgroundColor ?? "" });
    badge.textContent = `${mem.toFixed(1)}%`;
    outer.appendChild(badge);
    return outer;
  };

  const diskRenderer: CellRenderer<InfrastructureServer> = ({ row }) => {
    const d = row;
    return `${d.diskUsage.toFixed(1)}%`;
  };

  const responseRenderer: CellRenderer<InfrastructureServer> = ({ row, theme }) => {
    const d = row;
    const rt = d.responseTime;
    const s = getInfraMetricColorStyles(rt, theme || t, "response");
    const span = document.createElement("span");
    Object.assign(span.style, { fontWeight: "500", color: s.color, backgroundColor: s.backgroundColor ?? "" });
    span.textContent = rt.toFixed(1);
    return span;
  };

  const statusRenderer: CellRenderer<InfrastructureServer> = ({ row, theme }) => {
    const d = row;
    const status = d.status;
    const s = getInfraStatusColors(status, theme || t);
    const div = document.createElement("div");
    Object.assign(div.style, { ...s, padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" });
    div.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    return div;
  };

  return [
    { accessor: "serverId", align: "left", filterable: true, editable: false, sortable: true, label: "Server ID", minWidth: 180, pinned: "left", type: "string", width: "1.2fr", cellRenderer: serverIdRenderer },
    { accessor: "serverName", align: "left", filterable: true, editable: false, sortable: true, label: "Name", minWidth: 200, type: "string", width: "1.5fr" },
    {
      accessor: "performance", label: "Performance Metrics", width: 690, sortable: false,
      children: [
        { accessor: "cpuHistory", label: "CPU History", width: 150, sortable: false, filterable: false, editable: false, align: "center", type: "lineAreaChart", tooltip: "CPU usage over the last 30 intervals" },
        { accessor: "cpuUsage", label: "CPU %", width: 120, sortable: true, filterable: true, editable: true, align: "right", type: "number", cellRenderer: cpuRenderer },
        { accessor: "memoryUsage", label: "Memory %", width: 130, sortable: true, filterable: true, editable: true, align: "right", type: "number", cellRenderer: memoryRenderer },
        { accessor: "diskUsage", label: "Disk %", width: 120, sortable: true, filterable: true, editable: true, align: "right", type: "number", cellRenderer: diskRenderer },
        { accessor: "responseTime", label: "Response (ms)", width: 120, sortable: true, filterable: true, editable: true, align: "right", type: "number", cellRenderer: responseRenderer },
      ],
    },
    {
      accessor: "status", label: "Status", width: 130, sortable: true, filterable: true, editable: false, align: "center", type: "enum",
      enumOptions: [{ label: "Online", value: "online" }, { label: "Warning", value: "warning" }, { label: "Critical", value: "critical" }, { label: "Maintenance", value: "maintenance" }, { label: "Offline", value: "offline" }],
      valueGetter: ({ row }) => {
        const s = String(row.status);
        const m: Record<string, number> = { critical: 1, offline: 2, warning: 3, maintenance: 4, online: 5 };
        return m[s] || 999;
      },
      cellRenderer: statusRenderer,
    },
  ];
}

export function renderInfrastructureDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<InfrastructureServer> {
  const data = infrastructureData;
  let stopLiveUpdates: (() => void) | undefined;

  const table = new SimpleTableVanilla(container, {
    autoExpandColumns: true,
    columnReordering: true,
    columnResizing: true,
    columns: getHeaders(options?.theme),
    enableColumnEditor: true,
    getRowId: ({ row }: GetRowIdParams<InfrastructureServer>) => row.id,
    height: options?.height ?? "400px",
    rows: data,
    selectableCells: true,
    theme: options?.theme,
  });

  const originalDestroy = table.destroy.bind(table);
  table.destroy = () => {
    stopLiveUpdates?.();
    originalDestroy();
  };

  const originalMount = table.mount.bind(table);
  table.mount = () => {
    originalMount();
    stopLiveUpdates = startInfraDemoLiveUpdates(() => table.getAPI());
  };

  return table;
}
