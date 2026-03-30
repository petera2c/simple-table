import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidHeaderObject } from "@simple-table/solid";
import { manufacturingConfig, getManufacturingStatusColors } from "@simple-table/examples-shared";
import type { ManufacturingRow } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

function getHeaders(): SolidHeaderObject[] {
  const baseHeaders = [...manufacturingConfig.headers];
  return baseHeaders.map((h) => {
    if (h.accessor === "productLine") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          return hasChildren ? <span style={{ "font-weight": "bold" }}>{d.productLine}</span> : d.productLine;
        },
      };
    }
    if (h.accessor === "station") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          if (hasChildren) return <span style={{ color: "#6b7280" }}>{d.id}</span>;
          return (
            <div style={{ display: "flex", "align-items": "center", gap: "4px" }}>
              <span style={{ "background-color": "#dbeafe", color: "#1d4ed8", "font-size": "0.75rem", "font-weight": "500", padding: "2px 6px", "border-radius": "4px" }}>{d.id}</span>
              <span>{d.station}</span>
            </div>
          );
        },
      };
    }
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row, theme }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          if (hasChildren) return "—";
          const colors = getManufacturingStatusColors(d.status, theme);
          return <span style={{ "background-color": colors.bg, color: colors.text, padding: "4px 12px", "font-size": "12px", "line-height": "20px", "border-radius": "4px", display: "inline-block", "font-weight": "600" }}>{d.status}</span>;
        },
      };
    }
    if (h.accessor === "outputRate" || h.accessor === "defectCount" || h.accessor === "energy") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          const value = d[h.accessor as keyof ManufacturingRow] as number;
          return <div style={hasChildren ? { "font-weight": "bold" } : {}}>{value.toLocaleString()}</div>;
        },
      };
    }
    if (h.accessor === "cycletime") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          if (hasChildren) return <span style={{ "font-weight": "bold" }}>{d.cycletime?.toFixed(1)}</span>;
          return <span>{String(d.cycletime)}</span>;
        },
      };
    }
    if (h.accessor === "efficiency") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          const color = d.efficiency >= 90 ? "#52c41a" : d.efficiency >= 75 ? "#1890ff" : "#ff4d4f";
          return (
            <div style={{ width: "100%", display: "flex", "flex-direction": "column" }}>
              <div style={{ "background-color": "#f5f5f5", height: "6px", width: "100%", "border-radius": "100px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${d.efficiency}%`, "background-color": color, "border-radius": "100px" }} />
              </div>
              <div style={{ "font-size": "12px", "text-align": "center", "margin-top": "4px", "font-weight": hasChildren ? "bold" : "normal" }}>{d.efficiency}%</div>
            </div>
          );
        },
      };
    }
    if (h.accessor === "defectRate") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          const rate = typeof d.defectRate === "number" ? d.defectRate : parseFloat(String(d.defectRate));
          const color = rate < 1 ? "#16a34a" : rate < 3 ? "#f59e0b" : "#dc2626";
          return <span style={{ color, "font-weight": hasChildren ? "bold" : "normal" }}>{rate.toFixed(2)}%</span>;
        },
      };
    }
    if (h.accessor === "downtime") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          const hours = typeof d.downtime === "number" ? d.downtime : parseFloat(String(d.downtime));
          const color = hours < 1 ? "#16a34a" : hours < 2 ? "#f59e0b" : "#dc2626";
          return <span style={{ color, "font-weight": hasChildren ? "bold" : "normal" }}>{hours.toFixed(2)}</span>;
        },
      };
    }
    if (h.accessor === "utilization") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          if (hasChildren) return <span style={{ "font-weight": "bold" }}>{d.utilization?.toFixed(0)}%</span>;
          return `${d.utilization}%`;
        },
      };
    }
    if (h.accessor === "maintenanceDate") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as ManufacturingRow;
          const hasChildren = d.stations && Array.isArray(d.stations);
          if (hasChildren) return "—";
          const [year, month, day] = d.maintenanceDate.split("-").map(Number);
          const date = new Date(year, month - 1, day);
          const today = new Date();
          const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          let tagColor = "#e6f7ff";
          let textColor = "#0050b3";
          if (diffDays <= 3) {
            tagColor = "#fff1f0";
            textColor = "#a8071a";
          } else if (diffDays <= 7) {
            tagColor = "#fff7e6";
            textColor = "#ad4e00";
          }
          return (
            <span style={{ "background-color": tagColor, color: textColor, padding: "0 7px", "font-size": "12px", "line-height": "20px", "border-radius": "2px", display: "inline-block" }}>
              {date.toLocaleDateString()} ({diffDays} days)
            </span>
          );
        },
      };
    }
    return h;
  });
}

export default function ManufacturingDemo(props: { height?: string | number; theme?: Theme }) {
  return (
    <SimpleTable columnResizing columnReordering defaultHeaders={getHeaders()} height={props.height ?? "400px"} rowGrouping={["stations"]} rows={manufacturingConfig.rows} selectableCells theme={props.theme} />
  );
}
