/**
 * Infrastructure example headers – ported from React infrastructure-headers (vanilla-compatible).
 */
import type { HeaderObject } from "../../../src/index";
import type Theme from "../../../src/types/Theme";

type ColorStyles = {
  color: string;
  backgroundColor?: string;
  fontWeight?: string;
};

function getThresholdColors(
  value: number,
  theme: Theme,
  thresholds: { critical: number; warning: number; moderate: number },
): ColorStyles {
  const level =
    value >= thresholds.critical
      ? "critical"
      : value >= thresholds.warning
        ? "warning"
        : value >= thresholds.moderate
          ? "moderate"
          : "good";

  const palettes: Record<string, Record<string, ColorStyles>> = {
    "modern-dark": {
      critical: { color: "#fca5a5", backgroundColor: "rgba(127, 29, 29, 0.4)" },
      warning: { color: "#fcd34d", backgroundColor: "rgba(146, 64, 14, 0.4)" },
      moderate: { color: "#60a5fa", backgroundColor: "rgba(30, 64, 175, 0.3)" },
      good: { color: "#4ade80", backgroundColor: "rgba(21, 128, 61, 0.3)" },
    },
    dark: {
      critical: { color: "#f87171", backgroundColor: "rgba(127, 29, 29, 0.3)" },
      warning: { color: "#fbbf24", backgroundColor: "rgba(146, 64, 14, 0.3)" },
      moderate: { color: "#60a5fa", backgroundColor: "rgba(30, 58, 138, 0.3)" },
      good: { color: "#4ade80", backgroundColor: "rgba(20, 83, 45, 0.3)" },
    },
    "modern-light": {
      critical: { color: "#dc2626", backgroundColor: "#fee2e2" },
      warning: { color: "#d97706", backgroundColor: "#fef3c7" },
      moderate: { color: "#3b82f6", backgroundColor: "#dbeafe" },
      good: { color: "#16a34a", backgroundColor: "#dcfce7" },
    },
    sky: {
      critical: { color: "#dc2626", backgroundColor: "#fef2f2" },
      warning: { color: "#d97706", backgroundColor: "#fffbeb" },
      moderate: { color: "#0284c7", backgroundColor: "#e0f2fe" },
      good: { color: "#059669", backgroundColor: "#ecfdf5" },
    },
    violet: {
      critical: { color: "#db2777", backgroundColor: "#fdf2f8" },
      warning: { color: "#d97706", backgroundColor: "#fffbeb" },
      moderate: { color: "#7c3aed", backgroundColor: "#ede9fe" },
      good: { color: "#0891b2", backgroundColor: "#ecfeff" },
    },
    neutral: {
      critical: { color: "#57534e", backgroundColor: "#f5f5f4" },
      warning: { color: "#78716c", backgroundColor: "#fafaf9" },
      moderate: { color: "#78716c", backgroundColor: "#fafaf9" },
      good: { color: "#57534e", backgroundColor: "#f5f5f4" },
    },
    light: {
      critical: { color: "#dc2626", backgroundColor: "#fef2f2" },
      warning: { color: "#d97706", backgroundColor: "#fffbeb" },
      moderate: { color: "#2563eb", backgroundColor: "#eff6ff" },
      good: { color: "#16a34a", backgroundColor: "#f0fdf4" },
    },
  };

  const palette = palettes[theme] ?? palettes.light;
  return palette[level];
}

function getResponseTimeColors(value: number, theme: Theme): ColorStyles {
  const level =
    value >= 400 ? "critical" : value >= 200 ? "warning" : value >= 100 ? "moderate" : "good";

  const palettes: Record<string, Record<string, ColorStyles>> = {
    "modern-dark": {
      critical: { color: "#fca5a5" },
      warning: { color: "#fcd34d" },
      moderate: { color: "#60a5fa" },
      good: { color: "#4ade80" },
    },
    dark: {
      critical: { color: "#f87171" },
      warning: { color: "#fbbf24" },
      moderate: { color: "#60a5fa" },
      good: { color: "#4ade80" },
    },
    "modern-light": {
      critical: { color: "#dc2626" },
      warning: { color: "#d97706" },
      moderate: { color: "#3b82f6" },
      good: { color: "#16a34a" },
    },
    sky: {
      critical: { color: "#dc2626" },
      warning: { color: "#d97706" },
      moderate: { color: "#0284c7" },
      good: { color: "#059669" },
    },
    violet: {
      critical: { color: "#db2777" },
      warning: { color: "#d97706" },
      moderate: { color: "#7c3aed" },
      good: { color: "#0891b2" },
    },
    neutral: {
      critical: { color: "#57534e" },
      warning: { color: "#78716c" },
      moderate: { color: "#78716c" },
      good: { color: "#57534e" },
    },
    light: {
      critical: { color: "#dc2626" },
      warning: { color: "#d97706" },
      moderate: { color: "#2563eb" },
      good: { color: "#16a34a" },
    },
  };

  const palette = palettes[theme] ?? palettes.light;
  return palette[level];
}

function getStatusColors(status: string, theme: Theme): ColorStyles {
  const type =
    (
      {
        online: "online",
        warning: "warning",
        critical: "critical",
        maintenance: "maintenance",
        offline: "offline",
      } as Record<string, string>
    )[status] ?? "unknown";

  const palettes: Record<string, Record<string, ColorStyles>> = {
    "modern-dark": {
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
      unknown: { color: "#d1d5db", backgroundColor: "rgba(75, 85, 99, 0.4)", fontWeight: "600" },
    },
    dark: {
      online: { color: "#6ee7b7", backgroundColor: "rgba(6, 78, 59, 0.4)", fontWeight: "600" },
      warning: { color: "#fcd34d", backgroundColor: "rgba(120, 53, 15, 0.4)", fontWeight: "600" },
      critical: {
        color: "#fca5a5",
        backgroundColor: "rgba(127, 29, 29, 0.4)",
        fontWeight: "600",
      },
      maintenance: {
        color: "#93c5fd",
        backgroundColor: "rgba(30, 58, 138, 0.4)",
        fontWeight: "600",
      },
      offline: { color: "#d1d5db", backgroundColor: "rgba(55, 65, 81, 0.4)", fontWeight: "600" },
      unknown: { color: "#d1d5db", backgroundColor: "rgba(55, 65, 81, 0.4)", fontWeight: "600" },
    },
    "modern-light": {
      online: { color: "#16a34a", backgroundColor: "#dcfce7", fontWeight: "600" },
      warning: { color: "#d97706", backgroundColor: "#fef3c7", fontWeight: "600" },
      critical: { color: "#dc2626", backgroundColor: "#fee2e2", fontWeight: "600" },
      maintenance: { color: "#3b82f6", backgroundColor: "#dbeafe", fontWeight: "600" },
      offline: { color: "#6b7280", backgroundColor: "#f3f4f6", fontWeight: "600" },
      unknown: { color: "#6b7280", backgroundColor: "#f3f4f6", fontWeight: "600" },
    },
    sky: {
      online: { color: "#059669", backgroundColor: "#ecfdf5", fontWeight: "600" },
      warning: { color: "#d97706", backgroundColor: "#fffbeb", fontWeight: "600" },
      critical: { color: "#dc2626", backgroundColor: "#fef2f2", fontWeight: "600" },
      maintenance: { color: "#0284c7", backgroundColor: "#e0f2fe", fontWeight: "600" },
      offline: { color: "#475569", backgroundColor: "#f8fafc", fontWeight: "600" },
      unknown: { color: "#475569", backgroundColor: "#f8fafc", fontWeight: "600" },
    },
    violet: {
      online: { color: "#0891b2", backgroundColor: "#ecfeff", fontWeight: "600" },
      warning: { color: "#d97706", backgroundColor: "#fffbeb", fontWeight: "600" },
      critical: { color: "#db2777", backgroundColor: "#fdf2f8", fontWeight: "600" },
      maintenance: { color: "#7c3aed", backgroundColor: "#ede9fe", fontWeight: "600" },
      offline: { color: "#9333ea", backgroundColor: "#faf5ff", fontWeight: "600" },
      unknown: { color: "#9333ea", backgroundColor: "#faf5ff", fontWeight: "600" },
    },
    neutral: {
      online: { color: "#57534e", backgroundColor: "#f5f5f4", fontWeight: "600" },
      warning: { color: "#78716c", backgroundColor: "#fafaf9", fontWeight: "600" },
      critical: { color: "#57534e", backgroundColor: "#f5f5f4", fontWeight: "600" },
      maintenance: { color: "#78716c", backgroundColor: "#fafaf9", fontWeight: "600" },
      offline: { color: "#a8a29e", backgroundColor: "#fafaf9", fontWeight: "600" },
      unknown: { color: "#a8a29e", backgroundColor: "#fafaf9", fontWeight: "600" },
    },
    light: {
      online: { color: "#16a34a", backgroundColor: "#f0fdf4", fontWeight: "600" },
      warning: { color: "#d97706", backgroundColor: "#fffbeb", fontWeight: "600" },
      critical: { color: "#dc2626", backgroundColor: "#fef2f2", fontWeight: "600" },
      maintenance: { color: "#2563eb", backgroundColor: "#eff6ff", fontWeight: "600" },
      offline: { color: "#4b5563", backgroundColor: "#f9fafb", fontWeight: "600" },
      unknown: { color: "#4b5563", backgroundColor: "#f9fafb", fontWeight: "600" },
    },
  };

  const palette = palettes[theme] ?? palettes.light;
  return palette[type] ?? palette.unknown;
}

function applyStyles(el: HTMLElement, styles: ColorStyles & Record<string, string | undefined>) {
  if (styles.color) el.style.color = styles.color;
  if (styles.backgroundColor) el.style.backgroundColor = styles.backgroundColor;
  if (styles.fontWeight) el.style.fontWeight = styles.fontWeight;
}

function createMetricBadge(text: string, styles: ColorStyles): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.justifyContent = "end";

  const badge = document.createElement("div");
  badge.style.padding = "3px 6px";
  badge.style.borderRadius = "3px";
  badge.style.fontWeight = "600";
  badge.style.fontSize = "0.8rem";
  applyStyles(badge, styles);
  badge.textContent = text;

  wrapper.appendChild(badge);
  return wrapper;
}

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
    cellRenderer: ({ row }) => {
      const span = document.createElement("span");
      span.style.fontFamily = "monospace";
      span.style.fontSize = "0.85rem";
      span.textContent = String(row.serverId ?? "");
      return span;
    },
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
        cellRenderer: ({ row, theme }) => {
          const cpu = Number(row.cpuUsage);
          const styles = getThresholdColors(cpu, theme, {
            critical: 90,
            warning: 80,
            moderate: 60,
          });
          return createMetricBadge(`${cpu.toFixed(1)}%`, styles);
        },
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
        cellRenderer: ({ row, theme }) => {
          const memory = Number(row.memoryUsage);
          const styles = getThresholdColors(memory, theme, {
            critical: 95,
            warning: 85,
            moderate: 70,
          });
          return createMetricBadge(`${memory.toFixed(1)}%`, styles);
        },
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
        cellRenderer: ({ row }) => {
          const disk = Number(row.diskUsage);
          return `${disk.toFixed(1)}%`;
        },
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
        cellRenderer: ({ row, theme }) => {
          const responseTime = Number(row.responseTime);
          const styles = getResponseTimeColors(responseTime, theme);
          const span = document.createElement("span");
          span.style.fontWeight = "500";
          applyStyles(span, styles);
          span.textContent = responseTime.toFixed(1);
          return span;
        },
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
    cellRenderer: ({ row, theme }) => {
      const status = String(row.status ?? "");
      const styles = getStatusColors(status, theme);
      const displayText = status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";

      const div = document.createElement("div");
      applyStyles(div, styles);
      div.style.padding = "4px 8px";
      div.style.borderRadius = "4px";
      div.style.fontSize = "0.75rem";
      div.textContent = displayText;

      return div;
    },
  },
];
