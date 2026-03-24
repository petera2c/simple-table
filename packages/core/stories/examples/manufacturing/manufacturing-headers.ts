/**
 * Manufacturing example headers – ported from React manufacturing-headers (vanilla-compatible).
 */
import type { HeaderObject } from "../../../src/index";

export const MANUFACTURING_HEADERS: HeaderObject[] = [
  {
    accessor: "productLine",
    label: "Production Line",
    width: 180,
    expandable: true,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      String(row.productLine ?? ""),
  },
  {
    accessor: "station",
    label: "Workstation",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) return String(row.id ?? "");
      return `${row.id ?? ""} ${row.station ?? ""}`.trim();
    },
  },
  {
    accessor: "machineType",
    label: "Machine Type",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "left",
    type: "string",
  },
  {
    accessor: "status",
    label: "Status",
    width: 180,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "string",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) return "—";
      return String(row.status ?? "");
    },
  },
  {
    accessor: "outputRate",
    label: "Output (units/shift)",
    width: 200,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      row.outputRate != null ? String(row.outputRate) : "—",
  },
  {
    accessor: "cycletime",
    label: "Cycle Time (s)",
    width: 140,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const val = row.cycletime;
      if (val == null) return "—";
      return typeof val === "number" ? val.toFixed(1) : String(val);
    },
  },
  {
    accessor: "efficiency",
    label: "Efficiency",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      row.efficiency != null ? `${row.efficiency}%` : "—",
  },
  {
    accessor: "defectRate",
    label: "Defect Rate",
    width: 120,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const val = row.defectRate;
      if (val == null) return "—";
      const rate = typeof val === "string" ? parseFloat(val) : Number(val);
      return `${rate}%`;
    },
  },
  {
    accessor: "defectCount",
    label: "Defects",
    width: 120,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      row.defectCount != null ? Number(row.defectCount).toLocaleString() : "—",
  },
  {
    accessor: "downtime",
    label: "Downtime (h)",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const val = row.downtime;
      if (val == null) return "—";
      return typeof val === "string" ? val : String(Number(val).toFixed(2));
    },
  },
  {
    accessor: "utilization",
    label: "Utilization",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      row.utilization != null ? `${row.utilization}%` : "—",
  },
  {
    accessor: "energy",
    label: "Energy (kWh)",
    width: 130,
    isSortable: true,
    isEditable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: { row: Record<string, unknown> }) =>
      row.energy != null ? Number(row.energy).toLocaleString() : "—",
  },
  {
    accessor: "maintenanceDate",
    label: "Next Maintenance",
    width: 150,
    isSortable: true,
    isEditable: false,
    align: "center",
    type: "date",
    cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) return "—";
      const dateStr = row.maintenanceDate;
      if (!dateStr) return "—";
      const date = new Date(dateStr as string);
      return date.toLocaleDateString();
    },
  },
];
