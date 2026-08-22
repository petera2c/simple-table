import { SimpleTableVanilla } from "simple-table-core";
import type {
  Theme,
  ColumnDef,
  CellRenderer,
  TableAPI,
  GetRowIdParams,
} from "simple-table-core";
import {
  infrastructureData,
  getInfraMetricColorStyles,
  getInfraStatusColors,
} from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";
import "simple-table-core/styles.css";

const INFRA_TICK_MS = 20;
const INFRA_ROWS_PER_TICK = 4;
const INFRA_METRIC_SLOTS = [0, 1, 2, 3, 4, 5, 6] as const;
type InfraMetricSlot = (typeof INFRA_METRIC_SLOTS)[number];

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

function randomInfraMetricSlot(fromIndex = 0): InfraMetricSlot {
  const pool = INFRA_METRIC_SLOTS.slice(fromIndex);
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function infraApplyRowPatch(
  api: TableAPI<InfrastructureServer>,
  rowId: string | number,
  patch: Partial<InfrastructureServer>,
) {
  if (patch.cpuUsage !== undefined) {
    api.updateData({ accessor: "cpuUsage", rowId, newValue: patch.cpuUsage });
  }
  if (patch.cpuHistory !== undefined) {
    api.updateData({ accessor: "cpuHistory", rowId, newValue: patch.cpuHistory });
  }
  if (patch.memoryUsage !== undefined) {
    api.updateData({ accessor: "memoryUsage", rowId, newValue: patch.memoryUsage });
  }
  if (patch.networkIn !== undefined) {
    api.updateData({ accessor: "networkIn", rowId, newValue: patch.networkIn });
  }
  if (patch.networkOut !== undefined) {
    api.updateData({ accessor: "networkOut", rowId, newValue: patch.networkOut });
  }
  if (patch.responseTime !== undefined) {
    api.updateData({ accessor: "responseTime", rowId, newValue: patch.responseTime });
  }
  if (patch.activeConnections !== undefined) {
    api.updateData({ accessor: "activeConnections", rowId, newValue: patch.activeConnections });
  }
  if (patch.requestsPerSec !== undefined) {
    api.updateData({ accessor: "requestsPerSec", rowId, newValue: patch.requestsPerSec });
  }
}

function infraComputeMetricPatch(
  row: InfrastructureServer,
  slot: InfraMetricSlot,
): Partial<InfrastructureServer> | null {
  switch (slot) {
    case 0: {
      const cpuChange = (Math.random() - 0.5) * 8;
      const newCpu = Math.min(100, Math.max(0, row.cpuUsage + cpuChange));
      const newCpuRounded = Math.round(newCpu * 10) / 10;
      if (row.cpuHistory.length > 0) {
        return { cpuUsage: newCpuRounded, cpuHistory: [...row.cpuHistory.slice(1), newCpuRounded] };
      }
      return { cpuUsage: newCpuRounded };
    }
    case 1: {
      const memoryChange = (Math.random() - 0.5) * 5;
      const newMemory = Math.min(100, Math.max(0, row.memoryUsage + memoryChange));
      return { memoryUsage: Math.round(newMemory * 10) / 10 };
    }
    case 2: {
      const netChange = (Math.random() - 0.5) * 100;
      return { networkIn: Math.round(Math.max(0, row.networkIn + netChange) * 100) / 100 };
    }
    case 3: {
      const netChange = (Math.random() - 0.5) * 60;
      return { networkOut: Math.round(Math.max(0, row.networkOut + netChange) * 100) / 100 };
    }
    case 4: {
      const responseChange = (Math.random() - 0.5) * 100;
      return {
        responseTime: Math.round(Math.max(10, row.responseTime + responseChange) * 10) / 10,
      };
    }
    case 5: {
      const connectionChange = Math.floor((Math.random() - 0.5) * 500);
      return { activeConnections: Math.max(0, row.activeConnections + connectionChange) };
    }
    case 6: {
      const requestChange = Math.floor((Math.random() - 0.5) * 2000);
      return { requestsPerSec: Math.max(0, row.requestsPerSec + requestChange) };
    }
    default:
      return null;
  }
}

function startInfraDemoLiveUpdates(
  getApi: () => TableAPI<InfrastructureServer> | null | undefined,
): () => void {
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
      let slot = randomInfraMetricSlot();
      if (slot === 0 && usedCpuSparkline) slot = randomInfraMetricSlot(1);
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
    Object.assign(badge.style, {
      padding: "3px 6px",
      borderRadius: "3px",
      fontWeight: "600",
      fontSize: "0.8rem",
      color: s.color,
      backgroundColor: s.backgroundColor ?? "",
    });
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
    Object.assign(badge.style, {
      padding: "3px 6px",
      borderRadius: "3px",
      fontWeight: "600",
      fontSize: "0.8rem",
      color: s.color,
      backgroundColor: s.backgroundColor ?? "",
    });
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
    Object.assign(span.style, {
      fontWeight: "500",
      color: s.color,
      backgroundColor: s.backgroundColor ?? "",
    });
    span.textContent = rt.toFixed(1);
    return span;
  };

  const statusRenderer: CellRenderer<InfrastructureServer> = ({ row, theme }) => {
    const d = row;
    const status = d.status;
    const s = getInfraStatusColors(status, theme || t);
    const div = document.createElement("div");
    Object.assign(div.style, {
      ...s,
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.75rem",
    });
    div.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    return div;
  };

  return [
    {
      accessor: "serverId",
      align: "left",
      filterable: true,
      editable: false,
      sortable: true,
      label: "Server ID",
      minWidth: 180,
      pinned: "left",
      type: "string",
      width: "auto",
      cellRenderer: serverIdRenderer,
    },
    {
      accessor: "serverName",
      align: "left",
      filterable: true,
      editable: false,
      sortable: true,
      label: "Name",
      minWidth: 200,
      type: "string",
      width: "auto",
    },
    {
      accessor: "performance",
      label: "Performance Metrics",
      width: "auto",
      sortable: false,
      children: [
        {
          accessor: "cpuHistory",
          label: "CPU History",
          width: "auto",
          sortable: false,
          filterable: false,
          editable: false,
          align: "center",
          type: "lineAreaChart",
          tooltip: "CPU usage over the last 30 intervals",
        },
        {
          accessor: "cpuUsage",
          label: "CPU %",
          width: "auto",
          sortable: true,
          filterable: true,
          editable: true,
          align: "right",
          type: "number",
          cellRenderer: cpuRenderer,
        },
        {
          accessor: "memoryUsage",
          label: "Memory %",
          width: "auto",
          sortable: true,
          filterable: true,
          editable: true,
          align: "right",
          type: "number",
          cellRenderer: memoryRenderer,
        },
        {
          accessor: "diskUsage",
          label: "Disk %",
          width: "auto",
          sortable: true,
          filterable: true,
          editable: true,
          align: "right",
          type: "number",
          cellRenderer: diskRenderer,
        },
        {
          accessor: "responseTime",
          label: "Response (ms)",
          width: "auto",
          sortable: true,
          filterable: true,
          editable: true,
          align: "right",
          type: "number",
          cellRenderer: responseRenderer,
        },
      ],
    },
    {
      accessor: "status",
      label: "Status",
      width: "auto",
      sortable: true,
      filterable: true,
      editable: false,
      align: "center",
      type: "enum",
      enumOptions: [
        { label: "Online", value: "online" },
        { label: "Warning", value: "warning" },
        { label: "Critical", value: "critical" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Offline", value: "offline" },
      ],
      valueGetter: ({ row }) => {
        const s = String(row.status);
        const m: Record<string, number> = {
          critical: 1,
          offline: 2,
          warning: 3,
          maintenance: 4,
          online: 5,
        };
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

  const table = new SimpleTableVanilla<InfrastructureServer>(container, {
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
