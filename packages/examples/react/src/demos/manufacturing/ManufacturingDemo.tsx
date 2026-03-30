import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject } from "@simple-table/react";
import { manufacturingConfig, getManufacturingStatusColors } from "@simple-table/examples-shared";
import type { ManufacturingRow } from "@simple-table/examples-shared";
import "@simple-table/react/styles.css";

function getHeaders(): ReactHeaderObject[] {
  const baseHeaders = [...manufacturingConfig.headers];
  return baseHeaders.map((h) => {
    if (h.accessor === "productLine") {
      return {
        ...h,
        cellRenderer: ({ row: r }) => {
          const d = r as unknown as ManufacturingRow;
          return d.stations ? <span style={{ fontWeight: "bold" }}>{d.productLine}</span> : d.productLine;
        },
      };
    }
    if (h.accessor === "station") {
      return {
        ...h,
        cellRenderer: ({ row: r }) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations) return <span style={{ color: "#6b7280" }}>{d.id}</span>;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ backgroundColor: "#dbeafe", color: "#1d4ed8", fontSize: "0.75rem", fontWeight: 500, padding: "2px 6px", borderRadius: "4px" }}>{d.id}</span>
              <span>{d.station}</span>
            </div>
          );
        },
      };
    }
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row: r, theme }) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations) return "—";
          const colors = getManufacturingStatusColors(d.status, theme);
          return <span style={{ backgroundColor: colors.bg, color: colors.text, padding: "4px 12px", fontSize: "12px", lineHeight: "20px", borderRadius: "4px", display: "inline-block", fontWeight: "600" }}>{d.status}</span>;
        },
      };
    }
    if (h.accessor === "outputRate" || h.accessor === "defectCount" || h.accessor === "energy") {
      return {
        ...h,
        cellRenderer: ({ row: r }) => {
          const d = r as unknown as ManufacturingRow;
          const value = d[h.accessor as keyof ManufacturingRow] as number;
          return <div style={d.stations ? { fontWeight: "bold" } : {}}>{value.toLocaleString()}</div>;
        },
      };
    }
    if (h.accessor === "cycletime") {
      return {
        ...h,
        cellRenderer: ({ row: r }) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations) return <span style={{ fontWeight: "bold" }}>{d.cycletime.toFixed(1)}</span>;
          return <span>{d.cycletime}</span>;
        },
      };
    }
    if (h.accessor === "efficiency") {
      return {
        ...h,
        cellRenderer: ({ row: r }) => {
          const d = r as unknown as ManufacturingRow;
          const color = d.efficiency >= 90 ? "#52c41a" : d.efficiency >= 75 ? "#1890ff" : "#ff4d4f";
          return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ backgroundColor: "#f5f5f5", height: "6px", width: "100%", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${d.efficiency}%`, backgroundColor: color, borderRadius: "100px" }} />
              </div>
              <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px", fontWeight: d.stations ? "bold" : "normal" }}>{d.efficiency}%</div>
            </div>
          );
        },
      };
    }
    if (h.accessor === "defectRate") {
      return {
        ...h,
        cellRenderer: ({ row: r }) => {
          const d = r as unknown as ManufacturingRow;
          const color = d.defectRate < 1 ? "#16a34a" : d.defectRate < 3 ? "#f59e0b" : "#dc2626";
          return <span style={{ color, fontWeight: d.stations ? "bold" : "normal" }}>{d.defectRate.toFixed(2)}%</span>;
        },
      };
    }
    if (h.accessor === "downtime") {
      return {
        ...h,
        cellRenderer: ({ row: r }) => {
          const d = r as unknown as ManufacturingRow;
          const color = d.downtime < 1 ? "#16a34a" : d.downtime < 2 ? "#f59e0b" : "#dc2626";
          return <span style={{ color, fontWeight: d.stations ? "bold" : "normal" }}>{d.downtime.toFixed(2)}</span>;
        },
      };
    }
    if (h.accessor === "utilization") {
      return {
        ...h,
        cellRenderer: ({ row: r }) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations) return <span style={{ fontWeight: "bold" }}>{d.utilization.toFixed(0)}%</span>;
          return `${d.utilization}%`;
        },
      };
    }
    if (h.accessor === "maintenanceDate") {
      return {
        ...h,
        cellRenderer: ({ row: r }) => {
          const d = r as unknown as ManufacturingRow;
          if (d.stations) return "—";
          const [year, month, day] = d.maintenanceDate.split("-").map(Number);
          const date = new Date(year, month - 1, day);
          const today = new Date();
          const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          let tagColor = "#e6f7ff";
          let textColor = "#0050b3";
          if (diffDays <= 3) { tagColor = "#fff1f0"; textColor = "#a8071a"; }
          else if (diffDays <= 7) { tagColor = "#fff7e6"; textColor = "#ad4e00"; }
          return (
            <span style={{ backgroundColor: tagColor, color: textColor, padding: "0 7px", fontSize: "12px", lineHeight: "20px", borderRadius: "2px", display: "inline-block" }}>
              {date.toLocaleDateString()} ({diffDays} days)
            </span>
          );
        },
      };
    }
    return h;
  });
}

const ManufacturingDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => (
  <SimpleTable columnResizing columnReordering defaultHeaders={getHeaders()} height={height} rowGrouping={["stations"]} rows={manufacturingConfig.rows} selectableCells theme={theme} />
);

export default ManufacturingDemo;
