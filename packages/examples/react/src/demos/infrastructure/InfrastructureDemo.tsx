import { useRef, useEffect, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableAPI, ReactColumnDef } from "@simple-table/react";
import {
  infrastructureData,
  getInfraMetricColorStyles,
  getInfraStatusColors,
} from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";
import "@simple-table/react/styles.css";

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
  rowId: number,
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

function getHeaders(currentTheme?: Theme): ReactColumnDef<InfrastructureServer>[] {
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
      width: "1.2fr",
      cellRenderer: ({ row }) => (
        <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{row.serverId}</span>
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
      width: "1.5fr",
    },
    {
      accessor: "performance",
      label: "Performance Metrics",
      width: 690,
      sortable: false,
      children: [
        {
          accessor: "cpuHistory",
          label: "CPU History",
          width: 150,
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
          width: 120,
          sortable: true,
          filterable: true,
          editable: true,
          align: "right",
          type: "number",
          cellRenderer: ({ row, theme }) => {
            const s = getInfraMetricColorStyles(row.cpuUsage, theme || t, "cpu");
            return (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <div
                  style={{
                    padding: "3px 6px",
                    borderRadius: "3px",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                    ...s,
                  }}
                >
                  {row.cpuUsage.toFixed(1)}%
                </div>
              </div>
            );
          },
        },
        {
          accessor: "memoryUsage",
          label: "Memory %",
          width: 130,
          sortable: true,
          filterable: true,
          editable: true,
          align: "right",
          type: "number",
          cellRenderer: ({ row, theme }) => {
            const s = getInfraMetricColorStyles(row.memoryUsage, theme || t, "memory");
            return (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <div
                  style={{
                    padding: "3px 6px",
                    borderRadius: "3px",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                    ...s,
                  }}
                >
                  {row.memoryUsage.toFixed(1)}%
                </div>
              </div>
            );
          },
        },
        {
          accessor: "diskUsage",
          label: "Disk %",
          width: 120,
          sortable: true,
          filterable: true,
          editable: true,
          align: "right",
          type: "number",
          cellRenderer: ({ row }) => `${row.diskUsage.toFixed(1)}%`,
        },
        {
          accessor: "responseTime",
          label: "Response (ms)",
          width: 120,
          sortable: true,
          filterable: true,
          editable: true,
          align: "right",
          type: "number",
          cellRenderer: ({ row, theme }) => {
            const s = getInfraMetricColorStyles(row.responseTime, theme || t, "response");
            return <span style={{ fontWeight: "500", ...s }}>{row.responseTime.toFixed(1)}</span>;
          },
        },
      ],
    },
    {
      accessor: "status",
      label: "Status",
      width: 130,
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
        const m: Record<string, number> = {
          critical: 1,
          offline: 2,
          warning: 3,
          maintenance: 4,
          online: 5,
        };
        return m[row.status] || 999;
      },
      cellRenderer: ({ row, theme }) => {
        const s = getInfraStatusColors(row.status, theme || t);
        return (
          <div style={{ ...s, padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </div>
        );
      },
    },
  ];
}

const InfrastructureDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  const tableRef = useRef<TableAPI<InfrastructureServer>>(null);
  const [isMobile, setIsMobile] = useState(false);
  const data = infrastructureData;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    return startInfraDemoLiveUpdates(() => tableRef.current);
  }, [tableRef]);

  return (
    <SimpleTable
      autoExpandColumns={!isMobile}
      columnReordering
      columnResizing
      columns={getHeaders(theme)}
      enableColumnEditor
      getRowId={({ row }) => row.id}
      height={height}
      ref={tableRef}
      rows={data}
      selectableCells
      theme={theme}
    />
  );
};

export default InfrastructureDemo;
