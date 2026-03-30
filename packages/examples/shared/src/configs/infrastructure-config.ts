import type { HeaderObject, Row } from "simple-table-core";
import type { InfrastructureServer } from "../types/infrastructure";

const SERVER_PREFIXES = [
  "web",
  "api",
  "db",
  "cache",
  "worker",
  "proxy",
  "auth",
  "search",
  "queue",
  "storage",
];
const SERVER_NAMES = [
  "Production Primary",
  "Production Replica",
  "Staging",
  "Development",
  "Analytics",
  "Load Balancer",
  "CDN Edge",
  "Backup Primary",
  "Monitoring",
  "Gateway",
];
const STATUSES: Array<InfrastructureServer["status"]> = [
  "online",
  "warning",
  "critical",
  "maintenance",
  "offline",
];

export function generateInfrastructureData(count: number = 50): Row[] {
  return Array.from({ length: count }, (_, i) => {
    const prefix = SERVER_PREFIXES[i % SERVER_PREFIXES.length];
    const num = String(i + 1).padStart(3, "0");
    const cpu = Math.round((20 + Math.random() * 70) * 10) / 10;
    return {
      id: i + 1,
      serverId: `${prefix}-${num}`,
      serverName: SERVER_NAMES[i % SERVER_NAMES.length],
      cpuUsage: cpu,
      cpuHistory: Array.from({ length: 30 }, () => Math.round((20 + Math.random() * 70) * 10) / 10),
      memoryUsage: Math.round((30 + Math.random() * 60) * 10) / 10,
      diskUsage: Math.round((10 + Math.random() * 80) * 10) / 10,
      responseTime: Math.round((20 + Math.random() * 400) * 10) / 10,
      networkIn: Math.round(Math.random() * 1000 * 100) / 100,
      networkOut: Math.round(Math.random() * 600 * 100) / 100,
      activeConnections: Math.floor(Math.random() * 5000),
      requestsPerSec: Math.floor(Math.random() * 10000),
      status: STATUSES[i % 5 === 4 ? 4 : i % 7 === 0 ? 2 : i % 5 === 0 ? 1 : i % 9 === 0 ? 3 : 0],
    };
  });
}

export const infrastructureData = generateInfrastructureData(50);

export const infrastructureHeaders: HeaderObject[] = [
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
  },
  {
    accessor: "serverName",
    align: "left",
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
    children: [
      {
        accessor: "cpuHistory",
        label: "CPU History",
        width: 150,
        isSortable: false,
        filterable: false,
        isEditable: false,
        align: "center",
        type: "lineAreaChart",
        tooltip: "CPU usage over the last 30 intervals",
      },
      {
        accessor: "cpuUsage",
        label: "CPU %",
        width: 120,
        isSortable: true,
        filterable: true,
        isEditable: true,
        align: "right",
        type: "number",
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
      },
    ],
  },
  {
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
    valueGetter: ({ row }) => {
      const severityMap: Record<string, number> = {
        critical: 1,
        offline: 2,
        warning: 3,
        maintenance: 4,
        online: 5,
      };
      return severityMap[String(row.status)] || 999;
    },
  },
];

export const INFRA_UPDATE_CONFIG = {
  minInterval: 300,
  maxInterval: 1000,
};

export function getInfraMetricColorStyles(
  value: number,
  theme: string,
  metric: "cpu" | "memory" | "response" | "status",
  statusValue?: string,
) {
  const getLevel = (val: number, thresholds: [number, number, number]) => {
    if (val >= thresholds[0]) return "critical";
    if (val >= thresholds[1]) return "warning";
    if (val >= thresholds[2]) return "moderate";
    return "good";
  };

  let level: string;
  if (metric === "cpu") level = getLevel(value, [90, 80, 60]);
  else if (metric === "memory") level = getLevel(value, [95, 85, 70]);
  else if (metric === "response") level = getLevel(value, [400, 200, 100]);
  else level = statusValue || "good";

  const isDark = theme === "dark" || theme === "modern-dark";
  const colorMap: Record<string, { color: string; backgroundColor?: string }> = isDark
    ? {
        critical: { color: "#fca5a5", backgroundColor: "rgba(127, 29, 29, 0.4)" },
        warning: { color: "#fcd34d", backgroundColor: "rgba(146, 64, 14, 0.4)" },
        moderate: { color: "#60a5fa", backgroundColor: "rgba(30, 64, 175, 0.3)" },
        good: { color: "#4ade80", backgroundColor: "rgba(21, 128, 61, 0.3)" },
      }
    : {
        critical: { color: "#dc2626", backgroundColor: "#fef2f2" },
        warning: { color: "#d97706", backgroundColor: "#fffbeb" },
        moderate: { color: "#2563eb", backgroundColor: "#eff6ff" },
        good: { color: "#16a34a", backgroundColor: "#f0fdf4" },
      };

  return colorMap[level] || colorMap.good;
}

export function getInfraStatusColors(status: string, theme: string) {
  const isDark = theme === "dark" || theme === "modern-dark";
  const map: Record<string, { color: string; backgroundColor: string; fontWeight: string }> = isDark
    ? {
        online: { color: "#6ee7b7", backgroundColor: "rgba(6, 95, 70, 0.4)", fontWeight: "600" },
        warning: { color: "#fcd34d", backgroundColor: "rgba(146, 64, 14, 0.4)", fontWeight: "600" },
        critical: {
          color: "#fca5a5",
          backgroundColor: "rgba(153, 27, 27, 0.4)",
          fontWeight: "600",
        },
        maintenance: {
          color: "#93c5fd",
          backgroundColor: "rgba(30, 64, 175, 0.4)",
          fontWeight: "600",
        },
        offline: { color: "#d1d5db", backgroundColor: "rgba(75, 85, 99, 0.4)", fontWeight: "600" },
      }
    : {
        online: { color: "#16a34a", backgroundColor: "#f0fdf4", fontWeight: "600" },
        warning: { color: "#d97706", backgroundColor: "#fffbeb", fontWeight: "600" },
        critical: { color: "#dc2626", backgroundColor: "#fef2f2", fontWeight: "600" },
        maintenance: { color: "#2563eb", backgroundColor: "#eff6ff", fontWeight: "600" },
        offline: { color: "#4b5563", backgroundColor: "#f9fafb", fontWeight: "600" },
      };
  return map[status] || map.offline;
}

export const infrastructureConfig = {
  headers: infrastructureHeaders,
  rows: infrastructureData,
} as const;
