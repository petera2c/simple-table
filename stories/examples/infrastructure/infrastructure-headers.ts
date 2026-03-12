/**
 * Infrastructure example headers – ported from React infrastructure-headers (vanilla-compatible).
 */
import type { HeaderObject } from "../../../src/index";

export const INFRASTRUCTURE_HEADERS: HeaderObject[] = [
  {
    accessor: "serverId",
    align: "left",
    filterable: true,
    isEditable: false,
    isSortable: true,
    label: "Server ID",
    minWidth: 180,
    pinned: "left",
    type: "string",
    width: "1.2fr",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      String(row.serverId ?? ""),
  },
  {
    accessor: "serverName",
    filterable: true,
    isEditable: false,
    isSortable: true,
    label: "Name",
    minWidth: 200,
    type: "string",
    width: "1.5fr",
  },
  {
    accessor: "performance",
    label: "Performance Metrics",
    width: 690,
    isSortable: false,
    pinned: "left",
    children: [
      {
        accessor: "cpuUsage",
        label: "CPU %",
        width: 120,
        isSortable: true,
        filterable: true,
        isEditable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? `${Number(value).toFixed(1)}%` : "—",
      },
      {
        accessor: "memoryUsage",
        label: "Memory %",
        width: 130,
        isSortable: true,
        filterable: true,
        isEditable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? `${Number(value).toFixed(1)}%` : "—",
      },
      {
        accessor: "diskUsage",
        label: "Disk %",
        width: 120,
        isSortable: true,
        filterable: true,
        isEditable: true,
        align: "right",
        type: "number",
        valueFormatter: ({ value }: { value?: unknown }) =>
          value != null ? `${Number(value).toFixed(1)}%` : "—",
      },
      {
        accessor: "responseTime",
        label: "Response (ms)",
        width: 120,
        isSortable: true,
        filterable: true,
        isEditable: true,
        align: "right",
        type: "number",
        cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
          row.responseTime != null ? String(Number(row.responseTime).toFixed(1)) : "—",
      },
    ],
  },
  {
    pinned: "right",
    accessor: "status",
    label: "Status",
    width: 130,
    isSortable: true,
    filterable: true,
    isEditable: false,
    align: "center",
    type: "enum",
    enumOptions: [
      { label: "Online", value: "online" },
      { label: "Warning", value: "warning" },
      { label: "Critical", value: "critical" },
      { label: "Maintenance", value: "maintenance" },
      { label: "Offline", value: "offline" },
    ],
    valueGetter: ({ row }: { row: Record<string, unknown> }) => {
      const status = String(row.status ?? "");
      const severityMap: Record<string, number> = {
        critical: 1,
        offline: 2,
        warning: 3,
        maintenance: 4,
        online: 5,
      };
      return severityMap[status] ?? 999;
    },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const status = String(row.status ?? "");
      return status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";
    },
  },
];
