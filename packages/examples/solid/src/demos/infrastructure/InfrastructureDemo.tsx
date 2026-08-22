import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type {
  Theme,
  TableAPI,
  SolidColumnDef,
  CellRendererProps,
} from "@simple-table/solid";
import {
  infrastructureData,
  getInfraMetricColorStyles,
  getInfraStatusColors,
} from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";
import "@simple-table/solid/styles.css";

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

function getHeaders(currentTheme?: Theme): SolidColumnDef<InfrastructureServer>[] {
  const t = currentTheme || "light";
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
      cellRenderer: ({ row }: CellRendererProps<InfrastructureServer>) => (
        <span style={{ "font-family": "monospace", "font-size": "0.85rem" }}>{row.serverId}</span>
      ),
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
          cellRenderer: ({ row, theme }: CellRendererProps<InfrastructureServer>) => {
            const d = row;
            const s = getInfraMetricColorStyles(d.cpuUsage, theme || t, "cpu");
            return (
              <div style={{ display: "flex", "justify-content": "end" }}>
                <div
                  style={{
                    padding: "3px 6px",
                    "border-radius": "3px",
                    "font-weight": "600",
                    "font-size": "0.8rem",
                    ...s,
                  }}
                >
                  {d.cpuUsage.toFixed(1)}%
                </div>
              </div>
            );
          },
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
          cellRenderer: ({ row, theme }: CellRendererProps<InfrastructureServer>) => {
            const d = row;
            const s = getInfraMetricColorStyles(d.memoryUsage, theme || t, "memory");
            return (
              <div style={{ display: "flex", "justify-content": "end" }}>
                <div
                  style={{
                    padding: "3px 6px",
                    "border-radius": "3px",
                    "font-weight": "600",
                    "font-size": "0.8rem",
                    ...s,
                  }}
                >
                  {d.memoryUsage.toFixed(1)}%
                </div>
              </div>
            );
          },
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
          cellRenderer: ({ row }: CellRendererProps<InfrastructureServer>) =>
            `${row.diskUsage.toFixed(1)}%`,
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
          cellRenderer: ({ row, theme }: CellRendererProps<InfrastructureServer>) => {
            const d = row;
            const s = getInfraMetricColorStyles(d.responseTime, theme || t, "response");
            return <span style={{ "font-weight": "500", ...s }}>{d.responseTime.toFixed(1)}</span>;
          },
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
      cellRenderer: ({ row, theme }: CellRendererProps<InfrastructureServer>) => {
        const d = row;
        const s = getInfraStatusColors(d.status, theme || t);
        return (
          <div style={{ ...s, padding: "4px 8px", "border-radius": "4px", "font-size": "0.75rem" }}>
            {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
          </div>
        );
      },
    },
  ];
}

export default function InfrastructureDemo(props: { height?: string | number; theme?: Theme }) {
  let tableRef: TableAPI<InfrastructureServer> | undefined;
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
    cleanupFn = startInfraDemoLiveUpdates(() => tableRef);
  });

  onCleanup(() => cleanupFn?.());

  return (
    <SimpleTable
      autoExpandColumns={!isMobile()}
      columnReordering
      columnResizing
      columns={getHeaders(props.theme)}
      enableColumnEditor
      getRowId={({ row }) => row.id}
      height={props.height ?? "400px"}
      ref={(api) => (tableRef = api)}
      rows={data}
      selectableCells
      theme={props.theme}
    />
  );
}
