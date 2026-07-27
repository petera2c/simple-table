/**
 * Manufacturing example headers – ported from React manufacturing-headers (vanilla-compatible).
 */
import type { CellRendererProps, ColumnDef } from "../../../src/index";

export interface ManufacturingStationRow {
  id: string;
  productLine?: string;
  station?: string;
  machineType?: string;
  operator?: string;
  productType?: string;
  outputRate?: number;
  cycletime?: string | number;
  efficiency?: number;
  defectRate?: string;
  defectCount?: number;
  downtime?: string;
  utilization?: number;
  energy?: number;
  status?: string;
  maintenanceDate?: string;
  cycleTimeData?: string;
}

export interface ManufacturingRow {
  id: string;
  productLine: string;
  stations?: ManufacturingStationRow[];
  station?: string;
  machineType?: string;
  operator?: string;
  productType?: string;
  outputRate?: number;
  cycletime?: string | number;
  efficiency?: number;
  defectRate?: string;
  defectCount?: number;
  downtime?: string;
  utilization?: number;
  energy?: number;
  status?: string;
  maintenanceDate?: string;
  cycleTimeData?: string;
}

export const MANUFACTURING_HEADERS: ColumnDef<ManufacturingRow>[] = [
  {
    accessor: "productLine",
    label: "Production Line",
    width: 180,
    expandable: true,
    sortable: true,
    editable: false,
    align: "left",
    type: "string",
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) =>
      String(row.productLine ?? ""),
  },
  {
    accessor: "station",
    label: "Workstation",
    width: 150,
    sortable: true,
    editable: false,
    align: "left",
    type: "string",
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) return String(row.id ?? "");
      return `${row.id ?? ""} ${row.station ?? ""}`.trim();
    },
  },
  {
    accessor: "machineType",
    label: "Machine Type",
    width: 150,
    sortable: true,
    editable: false,
    align: "left",
    type: "string",
  },
  {
    accessor: "status",
    label: "Status",
    width: 180,
    sortable: true,
    editable: false,
    align: "center",
    type: "string",
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) return "—";
      return String(row.status ?? "");
    },
  },
  {
    accessor: "outputRate",
    label: "Output (units/shift)",
    width: 200,
    sortable: true,
    editable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) =>
      row.outputRate != null ? String(row.outputRate) : "—",
  },
  {
    accessor: "cycletime",
    label: "Cycle Time (s)",
    width: 140,
    sortable: true,
    editable: false,
    align: "right",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) => {
      const val = row.cycletime;
      if (val == null) return "—";
      return typeof val === "number" ? val.toFixed(1) : String(val);
    },
  },
  {
    accessor: "efficiency",
    label: "Efficiency",
    width: 150,
    sortable: true,
    editable: false,
    align: "center",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) =>
      row.efficiency != null ? `${row.efficiency}%` : "—",
  },
  {
    accessor: "defectRate",
    label: "Defect Rate",
    width: 120,
    sortable: true,
    editable: false,
    align: "right",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) => {
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
    sortable: true,
    editable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) =>
      row.defectCount != null ? Number(row.defectCount).toLocaleString() : "—",
  },
  {
    accessor: "downtime",
    label: "Downtime (h)",
    width: 130,
    sortable: true,
    editable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) => {
      const val = row.downtime;
      if (val == null) return "—";
      return typeof val === "string" ? val : String(Number(val).toFixed(2));
    },
  },
  {
    accessor: "utilization",
    label: "Utilization",
    width: 130,
    sortable: true,
    editable: false,
    align: "right",
    type: "number",
    aggregation: { type: "average" },
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) =>
      row.utilization != null ? `${row.utilization}%` : "—",
  },
  {
    accessor: "energy",
    label: "Energy (kWh)",
    width: 130,
    sortable: true,
    editable: false,
    align: "right",
    type: "number",
    aggregation: { type: "sum" },
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) =>
      row.energy != null ? Number(row.energy).toLocaleString() : "—",
  },
  {
    accessor: "maintenanceDate",
    label: "Next Maintenance",
    width: 150,
    sortable: true,
    editable: false,
    align: "center",
    type: "date",
    cellRenderer: ({ row }: CellRendererProps<ManufacturingRow>) => {
      const hasChildren = row.stations && Array.isArray(row.stations);
      if (hasChildren) return "—";
      const dateStr = row.maintenanceDate;
      if (!dateStr) return "—";
      const date = new Date(dateStr as string);
      return date.toLocaleDateString();
    },
  },
];
