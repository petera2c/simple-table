// Self-contained demo table setup for this example.
import type { HeaderObject } from "simple-table-core";

export interface ManufacturingRow {
  id: string;
  productLine: string;
  station: string;
  machineType: string;
  status: string;
  outputRate: number;
  cycletime: number;
  efficiency: number;
  defectRate: number;
  defectCount: number;
  downtime: number;
  utilization: number;
  energy: number;
  maintenanceDate: string;
  stations?: ManufacturingRow[];
}


const PRODUCT_LINES = ["Assembly Line A", "Assembly Line B", "Welding Station", "Paint Shop", "Quality Control", "Packaging Unit", "CNC Machining", "Injection Molding"];
const STATIONS = ["Station Alpha", "Station Beta", "Station Gamma", "Station Delta", "Station Epsilon"];
const MACHINE_TYPES = ["CNC Mill", "Lathe", "Welder", "Press", "Robot Arm", "Conveyor", "Inspector", "Dryer"];
const MANUFACTURING_STATUSES = ["Running", "Scheduled Maintenance", "Unplanned Downtime", "Idle", "Setup"];

export function generateManufacturingData(count: number = 8): ManufacturingRow[] {
  return Array.from({ length: count }, (_, i) => {
    const stationCount = 3 + Math.floor(Math.random() * 3);
    const stations: ManufacturingRow[] = Array.from({ length: stationCount }, (_, j) => {
      const efficiency = Math.floor(70 + Math.random() * 28);
      const defectRate = Math.round((0.1 + Math.random() * 4) * 100) / 100;
      const downtime = Math.round((0.1 + Math.random() * 3) * 100) / 100;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
      return {
        id: `${PRODUCT_LINES[i % PRODUCT_LINES.length]}-S${j + 1}`,
        productLine: PRODUCT_LINES[i % PRODUCT_LINES.length],
        station: STATIONS[j % STATIONS.length],
        machineType: MACHINE_TYPES[(i + j) % MACHINE_TYPES.length],
        status: MANUFACTURING_STATUSES[j % MANUFACTURING_STATUSES.length],
        outputRate: Math.floor(500 + Math.random() * 2000),
        cycletime: Math.round((10 + Math.random() * 50) * 10) / 10,
        efficiency,
        defectRate,
        defectCount: Math.floor(defectRate * 10 + Math.random() * 20),
        downtime,
        utilization: Math.floor(60 + Math.random() * 38),
        energy: Math.floor(100 + Math.random() * 900),
        maintenanceDate: futureDate.toISOString().split("T")[0],
      };
    });

    const totalOutput = stations.reduce((s, st) => s + st.outputRate, 0);
    const avgEfficiency = Math.round(stations.reduce((s, st) => s + st.efficiency, 0) / stations.length);
    const avgCycletime = Math.round((stations.reduce((s, st) => s + st.cycletime, 0) / stations.length) * 10) / 10;
    const avgDefectRate = Math.round((stations.reduce((s, st) => s + st.defectRate, 0) / stations.length) * 100) / 100;
    const totalDefects = stations.reduce((s, st) => s + st.defectCount, 0);
    const totalDowntime = Math.round(stations.reduce((s, st) => s + st.downtime, 0) * 100) / 100;
    const avgUtilization = Math.round(stations.reduce((s, st) => s + st.utilization, 0) / stations.length);
    const totalEnergy = stations.reduce((s, st) => s + st.energy, 0);

    return {
      id: PRODUCT_LINES[i % PRODUCT_LINES.length],
      productLine: PRODUCT_LINES[i % PRODUCT_LINES.length],
      station: "",
      machineType: "",
      status: "",
      outputRate: totalOutput,
      cycletime: avgCycletime,
      efficiency: avgEfficiency,
      defectRate: avgDefectRate,
      defectCount: totalDefects,
      downtime: totalDowntime,
      utilization: avgUtilization,
      energy: totalEnergy,
      maintenanceDate: "",
      stations,
    };
  });
}

export const manufacturingData = generateManufacturingData(8);

export const manufacturingHeaders: HeaderObject[] = [
  { accessor: "productLine", label: "Production Line", width: 180, expandable: true, isSortable: true, isEditable: false, align: "left", type: "string" },
  { accessor: "station", label: "Workstation", width: 150, isSortable: true, isEditable: false, align: "left", type: "string" },
  { accessor: "machineType", label: "Machine Type", width: 150, isSortable: true, isEditable: false, align: "left", type: "string" },
  {
    accessor: "status", label: "Status", width: 180, isSortable: true, isEditable: false, align: "center", type: "string",
    valueGetter: ({ row }) => {
      if (row.stations && Array.isArray(row.stations)) return 999;
      const priorityMap: Record<string, number> = { "Unplanned Downtime": 1, Idle: 2, Setup: 3, "Scheduled Maintenance": 4, Running: 5 };
      return priorityMap[String(row.status)] || 999;
    },
  },
  { accessor: "outputRate", label: "Output (units/shift)", width: 200, isSortable: true, isEditable: false, align: "right", type: "number", aggregation: { type: "sum" } },
  { accessor: "cycletime", label: "Cycle Time (s)", width: 140, isSortable: true, isEditable: false, align: "right", type: "number", aggregation: { type: "average" } },
  { accessor: "efficiency", label: "Efficiency", width: 150, isSortable: true, isEditable: false, align: "center", type: "number", aggregation: { type: "average" } },
  { accessor: "defectRate", label: "Defect Rate", width: 120, isSortable: true, isEditable: false, align: "right", type: "number", aggregation: { type: "average" } },
  { accessor: "defectCount", label: "Defects", width: 120, isSortable: true, isEditable: false, align: "right", type: "number", aggregation: { type: "sum" } },
  { accessor: "downtime", label: "Downtime (h)", width: 130, isSortable: true, isEditable: false, align: "right", type: "number", aggregation: { type: "sum" } },
  { accessor: "utilization", label: "Utilization", width: 130, isSortable: true, isEditable: false, align: "right", type: "number", aggregation: { type: "average" } },
  { accessor: "energy", label: "Energy (kWh)", width: 130, isSortable: true, isEditable: false, align: "right", type: "number", aggregation: { type: "sum" } },
  { accessor: "maintenanceDate", label: "Next Maintenance", width: 200, isSortable: true, isEditable: false, align: "center", type: "date" },
];

export function getManufacturingStatusColors(status: string, theme?: string) {
  const isDark = theme === "dark" || theme === "modern-dark";
  const isLight = theme === "light" || theme === "modern-light";
  const colorMaps: Record<string, { bg: string; text: string }> = {
    Running: isDark ? { bg: "rgba(6, 95, 70, 0.4)", text: "#6ee7b7" } : isLight ? { bg: "#dcfce7", text: "#16a34a" } : { bg: "#f6ffed", text: "#2a6a0d" },
    "Scheduled Maintenance": isDark ? { bg: "rgba(30, 64, 175, 0.4)", text: "#93c5fd" } : isLight ? { bg: "#dbeafe", text: "#3b82f6" } : { bg: "#e6f7ff", text: "#0050b3" },
    "Unplanned Downtime": isDark ? { bg: "rgba(153, 27, 27, 0.4)", text: "#fca5a5" } : isLight ? { bg: "#fee2e2", text: "#dc2626" } : { bg: "#fff1f0", text: "#a8071a" },
    Idle: isDark ? { bg: "rgba(146, 64, 14, 0.4)", text: "#fcd34d" } : isLight ? { bg: "#fef3c7", text: "#d97706" } : { bg: "#fff7e6", text: "#ad4e00" },
    Setup: isDark ? { bg: "rgba(109, 40, 217, 0.4)", text: "#c4b5fd" } : isLight ? { bg: "#e9d5ff", text: "#9333ea" } : { bg: "#f9f0ff", text: "#391085" },
  };
  return colorMaps[status] || (isDark ? { bg: "rgba(75, 85, 99, 0.4)", text: "#d1d5db" } : isLight ? { bg: "#f3f4f6", text: "#6b7280" } : { bg: "#f0f0f0", text: "rgba(0, 0, 0, 0.85)" });
}

export const manufacturingConfig = {
  headers: manufacturingHeaders,
  rows: manufacturingData,
} as const;
