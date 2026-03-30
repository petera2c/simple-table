<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, HeaderObject, CellRenderer, Row } from "@simple-table/svelte";
  import { onMount } from "svelte";
  import {
    infrastructureData,
    INFRA_UPDATE_CONFIG,
    getInfraMetricColorStyles,
    getInfraStatusColors,
  } from "@simple-table/examples-shared";
  import type { InfrastructureServer } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let data = $state(JSON.parse(JSON.stringify(infrastructureData)) as Row[]);
  let tableRef: any;

  function getHeaders(currentTheme?: Theme): HeaderObject[] {
    const t = currentTheme || "light";

    const serverIdRenderer: CellRenderer = ({ row }) => {
      const d = row as unknown as InfrastructureServer;
      const span = document.createElement("span");
      Object.assign(span.style, { fontFamily: "monospace", fontSize: "0.85rem" });
      span.textContent = d.serverId;
      return span;
    };

    const cpuRenderer: CellRenderer = ({ row, theme: cellTheme }) => {
      const d = row as unknown as InfrastructureServer;
      const cpu = d.cpuUsage;
      const s = getInfraMetricColorStyles(cpu, cellTheme || t, "cpu");
      const outer = document.createElement("div");
      outer.style.display = "flex";
      outer.style.justifyContent = "end";
      const badge = document.createElement("div");
      Object.assign(badge.style, { padding: "3px 6px", borderRadius: "3px", fontWeight: "600", fontSize: "0.8rem", color: s.color, backgroundColor: s.backgroundColor ?? "" });
      badge.textContent = `${cpu.toFixed(1)}%`;
      outer.appendChild(badge);
      return outer;
    };

    const memoryRenderer: CellRenderer = ({ row, theme: cellTheme }) => {
      const d = row as unknown as InfrastructureServer;
      const mem = d.memoryUsage;
      const s = getInfraMetricColorStyles(mem, cellTheme || t, "memory");
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

    const responseRenderer: CellRenderer = ({ row, theme: cellTheme }) => {
      const d = row as unknown as InfrastructureServer;
      const rt = d.responseTime;
      const s = getInfraMetricColorStyles(rt, cellTheme || t, "response");
      const span = document.createElement("span");
      Object.assign(span.style, { fontWeight: "500", color: s.color, backgroundColor: s.backgroundColor ?? "" });
      span.textContent = rt.toFixed(1);
      return span;
    };

    const statusRenderer: CellRenderer = ({ row, theme: cellTheme }) => {
      const d = row as unknown as InfrastructureServer;
      const status = d.status;
      const s = getInfraStatusColors(status, cellTheme || t);
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

  onMount(() => {
    const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
    let isActive = true;

    const createRowTimer = (rowId: string) => {
      const scheduleUpdate = () => {
        if (!isActive) return;
        const interval = INFRA_UPDATE_CONFIG.minInterval + Math.random() * (INFRA_UPDATE_CONFIG.maxInterval - INFRA_UPDATE_CONFIG.minInterval);
        const timerId = setTimeout(() => {
          if (!isActive) return;
          const api = tableRef?.getAPI?.();
          if (!api) return;
          const idx = data.findIndex((r: Row) => r.id === rowId);
          if (idx === -1) return;
          const server = data[idx];
          const d = server as unknown as InfrastructureServer;

          const cpu = d.cpuUsage;
          if (typeof cpu === "number") {
            const newCpu = Math.round(Math.min(100, Math.max(0, cpu + (Math.random() - 0.5) * 8)) * 10) / 10;
            data[idx].cpuUsage = newCpu;
            api.updateData({ accessor: "cpuUsage", rowIndex: idx, newValue: newCpu });
            const hist = d.cpuHistory;
            if (Array.isArray(hist) && hist.length > 0) {
              const updated = [...hist.slice(1), newCpu];
              data[idx].cpuHistory = updated;
              api.updateData({ accessor: "cpuHistory", rowIndex: idx, newValue: updated });
            }
          }
          if (Math.random() < 0.4) {
            const mem = d.memoryUsage;
            if (typeof mem === "number") {
              const n = Math.round(Math.min(100, Math.max(0, mem + (Math.random() - 0.5) * 5)) * 10) / 10;
              data[idx].memoryUsage = n;
              api.updateData({ accessor: "memoryUsage", rowIndex: idx, newValue: n });
            }
          }
          if (Math.random() < 0.5) {
            const rt = d.responseTime;
            if (typeof rt === "number") {
              const n = Math.round(Math.max(10, rt + (Math.random() - 0.5) * 100) * 10) / 10;
              data[idx].responseTime = n;
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
      const api = tableRef?.getAPI?.();
      if (!api) return;
      const visibleRows = api.getVisibleRows();
      const visibleIds = new Set(visibleRows.map((vr: any) => vr.row.id as string));
      timerMap.forEach((tid, rid) => {
        if (!visibleIds.has(rid)) {
          clearTimeout(tid);
          timerMap.delete(rid);
        }
      });
      visibleRows.forEach((vr: any) => {
        const rid = vr.row.id as string;
        if (!timerMap.has(rid)) createRowTimer(rid);
      });
    };

    syncTimers();
    const syncInt = setInterval(syncTimers, 500);

    return () => {
      isActive = false;
      clearInterval(syncInt);
      timerMap.forEach((t) => clearTimeout(t));
      timerMap.clear();
    };
  });
</script>

<SimpleTable
  bind:this={tableRef}
  autoExpandColumns={true}
  columnReordering={true}
  columnResizing={true}
  defaultHeaders={getHeaders(theme)}
  editColumns={true}
  {height}
  rows={data}
  selectableCells={true}
  {theme}
/>
