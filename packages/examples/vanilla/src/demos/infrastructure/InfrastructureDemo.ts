import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject, CellRenderer } from "simple-table-core";
import type { Row } from "simple-table-core";
import { infrastructureData, INFRA_UPDATE_CONFIG, getInfraMetricColorStyles, getInfraStatusColors } from "@simple-table/examples-shared";
import type { InfrastructureServer } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

function getHeaders(currentTheme?: Theme): HeaderObject[] {
  const t = currentTheme || "light";

  const serverIdRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as InfrastructureServer;
    const span = document.createElement("span");
    Object.assign(span.style, { fontFamily: "monospace", fontSize: "0.85rem" });
    span.textContent = d.serverId;
    return span;
  };

  const cpuRenderer: CellRenderer = ({ row, theme }) => {
    const d = row as unknown as InfrastructureServer;
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

  const memoryRenderer: CellRenderer = ({ row, theme }) => {
    const d = row as unknown as InfrastructureServer;
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

  const diskRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as InfrastructureServer;
    return `${d.diskUsage.toFixed(1)}%`;
  };

  const responseRenderer: CellRenderer = ({ row, theme }) => {
    const d = row as unknown as InfrastructureServer;
    const rt = d.responseTime;
    const s = getInfraMetricColorStyles(rt, theme || t, "response");
    const span = document.createElement("span");
    Object.assign(span.style, { fontWeight: "500", color: s.color, backgroundColor: s.backgroundColor ?? "" });
    span.textContent = rt.toFixed(1);
    return span;
  };

  const statusRenderer: CellRenderer = ({ row, theme }) => {
    const d = row as unknown as InfrastructureServer;
    const status = d.status;
    const s = getInfraStatusColors(status, theme || t);
    const div = document.createElement("div");
    Object.assign(div.style, { ...s, padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" });
    div.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    return div;
  };

  return [
    { accessor: "serverId", align: "left", filterable: true, isEditable: false, isSortable: true, label: "Server ID", minWidth: 180, pinned: "left", type: "string", width: "1.2fr", cellRenderer: serverIdRenderer },
    { accessor: "serverName", align: "left", filterable: true, isEditable: false, isSortable: true, label: "Name", minWidth: 200, type: "string", width: "1.5fr" },
    {
      accessor: "performance", label: "Performance Metrics", width: 690, isSortable: false,
      children: [
        { accessor: "cpuHistory", label: "CPU History", width: 150, isSortable: false, filterable: false, isEditable: false, align: "center", type: "lineAreaChart", tooltip: "CPU usage over the last 30 intervals" },
        { accessor: "cpuUsage", label: "CPU %", width: 120, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number", cellRenderer: cpuRenderer },
        { accessor: "memoryUsage", label: "Memory %", width: 130, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number", cellRenderer: memoryRenderer },
        { accessor: "diskUsage", label: "Disk %", width: 120, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number", cellRenderer: diskRenderer },
        { accessor: "responseTime", label: "Response (ms)", width: 120, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number", cellRenderer: responseRenderer },
      ],
    },
    {
      accessor: "status", label: "Status", width: 130, isSortable: true, filterable: true, isEditable: false, align: "center", type: "enum",
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
): SimpleTableVanilla {
  const data = infrastructureData;
  const currentData = JSON.parse(JSON.stringify(data));
  const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
  let isActive = true;

  const table = new SimpleTableVanilla(container, {
    autoExpandColumns: true,
    columnReordering: true,
    columnResizing: true,
    defaultHeaders: getHeaders(options?.theme),
    editColumns: true,
    height: options?.height ?? "400px",
    rows: data,
    selectableCells: true,
    theme: options?.theme,
  });

  const createRowTimer = (rowId: string) => {
    const scheduleUpdate = () => {
      if (!isActive) return;
      const interval = INFRA_UPDATE_CONFIG.minInterval + Math.random() * (INFRA_UPDATE_CONFIG.maxInterval - INFRA_UPDATE_CONFIG.minInterval);
      const timerId = setTimeout(() => {
        if (!isActive) return;
        const api = table.getAPI();
        const idx = currentData.findIndex((r: Row) => r.id === rowId);
        if (idx === -1) return;
        const d = currentData[idx] as unknown as InfrastructureServer;

        const cpu = d.cpuUsage;
        if (typeof cpu === "number") {
          const newCpu = Math.round(Math.min(100, Math.max(0, cpu + (Math.random() - 0.5) * 8)) * 10) / 10;
          currentData[idx].cpuUsage = newCpu;
          api.updateData({ accessor: "cpuUsage", rowIndex: idx, newValue: newCpu });
          const hist = d.cpuHistory;
          if (Array.isArray(hist) && hist.length > 0) {
            const updated = [...hist.slice(1), newCpu];
            currentData[idx].cpuHistory = updated;
            api.updateData({ accessor: "cpuHistory", rowIndex: idx, newValue: updated });
          }
        }
        if (Math.random() < 0.4) {
          const mem = d.memoryUsage;
          if (typeof mem === "number") {
            const n = Math.round(Math.min(100, Math.max(0, mem + (Math.random() - 0.5) * 5)) * 10) / 10;
            currentData[idx].memoryUsage = n;
            api.updateData({ accessor: "memoryUsage", rowIndex: idx, newValue: n });
          }
        }
        if (Math.random() < 0.5) {
          const rt = d.responseTime;
          if (typeof rt === "number") {
            const n = Math.round(Math.max(10, rt + (Math.random() - 0.5) * 100) * 10) / 10;
            currentData[idx].responseTime = n;
            api.updateData({ accessor: "responseTime", rowIndex: idx, newValue: n });
          }
        }
        scheduleUpdate();
      }, interval);
      timerMap.set(rowId, timerId);
    };
    scheduleUpdate();
  };

  const syncTimers = () => {
    const api = table.getAPI();
    const visibleRows = api.getVisibleRows();
    const visibleIds = new Set(visibleRows.map((vr) => String(vr.row.id)));
    timerMap.forEach((tid, rid) => {
      if (!visibleIds.has(rid)) {
        clearTimeout(tid);
        timerMap.delete(rid);
      }
    });
    visibleRows.forEach((vr) => {
      const rid = String(vr.row.id);
      if (!timerMap.has(rid)) createRowTimer(rid);
    });
  };

  const syncInt = setInterval(syncTimers, 500);

  const originalDestroy = table.destroy.bind(table);
  table.destroy = () => {
    isActive = false;
    clearInterval(syncInt);
    timerMap.forEach((t) => clearTimeout(t));
    timerMap.clear();
    originalDestroy();
  };

  const originalMount = table.mount.bind(table);
  table.mount = () => {
    originalMount();
    syncTimers();
  };

  return table;
}
