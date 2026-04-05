import { useRef, useEffect, useState } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableAPI, ReactHeaderObject, CellRendererProps } from "@simple-table/react";
import { infrastructureData, INFRA_UPDATE_CONFIG, getInfraMetricColorStyles, getInfraStatusColors } from "./infrastructure.demo-data";
import type { InfrastructureServer } from "./infrastructure.demo-data";
import "@simple-table/react/styles.css";

function getHeaders(currentTheme?: Theme): ReactHeaderObject[] {
  const t = currentTheme || "light";
  return [
    { accessor: "serverId", align: "left", filterable: true, isEditable: false, isSortable: true, label: "Server ID", minWidth: 180, pinned: "left", type: "string", width: "1.2fr", cellRenderer: ({ row: r }: CellRendererProps) => { const { serverId } = r as unknown as InfrastructureServer; return <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{serverId}</span>; } },
    { accessor: "serverName", align: "left", filterable: true, isEditable: false, isSortable: true, label: "Name", minWidth: 200, type: "string", width: "1.5fr" },
    {
      accessor: "performance", label: "Performance Metrics", width: 690, isSortable: false,
      children: [
        { accessor: "cpuHistory", label: "CPU History", width: 150, isSortable: false, filterable: false, isEditable: false, align: "center", type: "lineAreaChart", tooltip: "CPU usage over the last 30 intervals" },
        {
          accessor: "cpuUsage", label: "CPU %", width: 120, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number",
          cellRenderer: ({ row: r, theme }: CellRendererProps) => { const { cpuUsage } = r as unknown as InfrastructureServer; const s = getInfraMetricColorStyles(cpuUsage, theme || t, "cpu"); return <div style={{ display: "flex", justifyContent: "end" }}><div style={{ padding: "3px 6px", borderRadius: "3px", fontWeight: "600", fontSize: "0.8rem", ...s }}>{cpuUsage.toFixed(1)}%</div></div>; },
        },
        {
          accessor: "memoryUsage", label: "Memory %", width: 130, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number",
          cellRenderer: ({ row: r, theme }: CellRendererProps) => { const { memoryUsage } = r as unknown as InfrastructureServer; const s = getInfraMetricColorStyles(memoryUsage, theme || t, "memory"); return <div style={{ display: "flex", justifyContent: "end" }}><div style={{ padding: "3px 6px", borderRadius: "3px", fontWeight: "600", fontSize: "0.8rem", ...s }}>{memoryUsage.toFixed(1)}%</div></div>; },
        },
        { accessor: "diskUsage", label: "Disk %", width: 120, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number", cellRenderer: ({ row: r }: CellRendererProps) => { const { diskUsage } = r as unknown as InfrastructureServer; return `${diskUsage.toFixed(1)}%`; } },
        {
          accessor: "responseTime", label: "Response (ms)", width: 120, isSortable: true, filterable: true, isEditable: true, align: "right", type: "number",
          cellRenderer: ({ row: r, theme }: CellRendererProps) => { const { responseTime } = r as unknown as InfrastructureServer; const s = getInfraMetricColorStyles(responseTime, theme || t, "response"); return <span style={{ fontWeight: "500", ...s }}>{responseTime.toFixed(1)}</span>; },
        },
      ],
    },
    {
      accessor: "status", label: "Status", width: 130, isSortable: true, filterable: true, isEditable: false, align: "center", type: "enum",
      enumOptions: [{ label: "Online", value: "online" }, { label: "Warning", value: "warning" }, { label: "Critical", value: "critical" }, { label: "Maintenance", value: "maintenance" }, { label: "Offline", value: "offline" }],
      valueGetter: ({ row }) => { const m: Record<string, number> = { critical: 1, offline: 2, warning: 3, maintenance: 4, online: 5 }; return m[String(row.status)] || 999; },
      cellRenderer: ({ row: r, theme }: CellRendererProps) => { const { status } = r as unknown as InfrastructureServer; const s = getInfraStatusColors(status, theme || t); return <div style={{ ...s, padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>{status.charAt(0).toUpperCase() + status.slice(1)}</div>; },
    },
  ];
}

const InfrastructureDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  const tableRef = useRef<TableAPI>(null);
  const [isMobile, setIsMobile] = useState(false);
  const data = infrastructureData;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const currentData: InfrastructureServer[] = JSON.parse(JSON.stringify(data));
    const timerMap = new Map<number, ReturnType<typeof setTimeout>>();
    let isActive = true;

    const createRowTimer = (rowId: number) => {
      const scheduleUpdate = () => {
        if (!isActive) return;
        const interval = INFRA_UPDATE_CONFIG.minInterval + Math.random() * (INFRA_UPDATE_CONFIG.maxInterval - INFRA_UPDATE_CONFIG.minInterval);
        const timerId = setTimeout(() => {
          if (!isActive || !tableRef.current) return;
          const idx = currentData.findIndex((r) => r.id === rowId);
          if (idx === -1) return;
          const server = currentData[idx];

          const newCpu = Math.round(Math.min(100, Math.max(0, server.cpuUsage + (Math.random() - 0.5) * 8)) * 10) / 10;
          currentData[idx].cpuUsage = newCpu;
          tableRef.current?.updateData({ accessor: "cpuUsage", rowIndex: idx, newValue: newCpu });
          if (server.cpuHistory.length > 0) {
            const updated = [...server.cpuHistory.slice(1), newCpu];
            currentData[idx].cpuHistory = updated;
            tableRef.current?.updateData({ accessor: "cpuHistory", rowIndex: idx, newValue: updated });
          }

          if (Math.random() < 0.4) { const n = Math.round(Math.min(100, Math.max(0, server.memoryUsage + (Math.random() - 0.5) * 5)) * 10) / 10; currentData[idx].memoryUsage = n; tableRef.current?.updateData({ accessor: "memoryUsage", rowIndex: idx, newValue: n }); }
          if (Math.random() < 0.5) { const n = Math.round(Math.max(10, server.responseTime + (Math.random() - 0.5) * 100) * 10) / 10; currentData[idx].responseTime = n; tableRef.current?.updateData({ accessor: "responseTime", rowIndex: idx, newValue: n }); }
          scheduleUpdate();
        }, interval);
        timerMap.set(rowId, timerId);
      };
      scheduleUpdate();
    };

    const syncTimers = () => {
      if (!tableRef.current) return;
      const visibleRows = tableRef.current.getVisibleRows();
      const visibleIds = new Set(visibleRows.map((vr) => vr.row.id as number));
      timerMap.forEach((tid, rid) => { if (!visibleIds.has(rid)) { clearTimeout(tid); timerMap.delete(rid); } });
      visibleRows.forEach((vr) => { const rid = vr.row.id as number; if (!timerMap.has(rid)) createRowTimer(rid); });
    };

    syncTimers();
    const syncInterval = setInterval(syncTimers, 500);
    return () => { isActive = false; clearInterval(syncInterval); timerMap.forEach((t) => clearTimeout(t)); timerMap.clear(); };
  }, [data]);

  return (
    <SimpleTable
      autoExpandColumns={!isMobile}
      columnReordering
      columnResizing
      defaultHeaders={getHeaders(theme)}
      editColumns
      height={height}
      ref={tableRef}
      rows={data}
      selectableCells
      theme={theme}
    />
  );
};

export default InfrastructureDemo;
