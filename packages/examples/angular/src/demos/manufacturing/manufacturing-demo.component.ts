import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { CellRenderer, Row } from "simple-table-core";
import type { ManufacturingRow } from "@simple-table/examples-shared";
import { manufacturingConfig, getManufacturingStatusColors } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

function hasStations(row: Record<string, unknown>): boolean {
  return Boolean(row.stations && Array.isArray(row.stations));
}

function getHeaders(): AngularHeaderObject[] {
  const productLineRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as ManufacturingRow;
    if (hasStations(row)) {
      const span = document.createElement("span");
      span.style.fontWeight = "bold";
      span.textContent = d.productLine;
      return span;
    }
    return d.productLine;
  };

  const stationRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as ManufacturingRow;
    if (hasStations(row)) {
      const span = document.createElement("span");
      span.style.color = "#6b7280";
      span.textContent = d.id;
      return span;
    }
    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, { display: "flex", alignItems: "center", gap: "4px" });

    const badge = document.createElement("span");
    Object.assign(badge.style, {
      backgroundColor: "#dbeafe", color: "#1d4ed8", fontSize: "0.75rem",
      fontWeight: "500", padding: "2px 6px", borderRadius: "4px",
    });
    badge.textContent = d.id;

    const name = document.createElement("span");
    name.textContent = d.station;

    wrapper.append(badge, name);
    return wrapper;
  };

  const statusRenderer: CellRenderer = ({ row, theme }) => {
    if (hasStations(row)) return "—";
    const d = row as unknown as ManufacturingRow;
    const status = d.status;
    const colors = getManufacturingStatusColors(status, theme);
    const span = document.createElement("span");
    Object.assign(span.style, {
      backgroundColor: colors.bg, color: colors.text, padding: "4px 12px",
      fontSize: "12px", lineHeight: "20px", borderRadius: "4px",
      display: "inline-block", fontWeight: "600",
    });
    span.textContent = status;
    return span;
  };

  const boldParentNumberRenderer = (accessor: string): CellRenderer => ({ row }) => {
    const d = row as unknown as ManufacturingRow;
    const value = d[accessor as keyof ManufacturingRow] as number;
    const div = document.createElement("div");
    if (hasStations(row)) div.style.fontWeight = "bold";
    div.textContent = value.toLocaleString();
    return div;
  };

  const cycletimeRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as ManufacturingRow;
    if (hasStations(row)) {
      const span = document.createElement("span");
      span.style.fontWeight = "bold";
      span.textContent = d.cycletime?.toFixed(1);
      return span;
    }
    return String(d.cycletime);
  };

  const efficiencyRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as ManufacturingRow;
    const eff = d.efficiency;
    const isParent = hasStations(row);
    const color = eff >= 90 ? "#52c41a" : eff >= 75 ? "#1890ff" : "#ff4d4f";

    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, { width: "100%", display: "flex", flexDirection: "column" });

    const trackOuter = document.createElement("div");
    Object.assign(trackOuter.style, {
      backgroundColor: "#f5f5f5", height: "6px", width: "100%",
      borderRadius: "100px", overflow: "hidden",
    });
    const trackInner = document.createElement("div");
    Object.assign(trackInner.style, {
      height: "100%", width: `${eff}%`, backgroundColor: color, borderRadius: "100px",
    });
    trackOuter.appendChild(trackInner);

    const label = document.createElement("div");
    Object.assign(label.style, {
      fontSize: "12px", textAlign: "center", marginTop: "4px",
      fontWeight: isParent ? "bold" : "normal",
    });
    label.textContent = `${eff}%`;

    wrapper.append(trackOuter, label);
    return wrapper;
  };

  const defectRateRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as ManufacturingRow;
    const isParent = hasStations(row);
    const rate = d.defectRate;
    const color = rate < 1 ? "#16a34a" : rate < 3 ? "#f59e0b" : "#dc2626";
    const span = document.createElement("span");
    Object.assign(span.style, { color, fontWeight: isParent ? "bold" : "normal" });
    span.textContent = `${rate.toFixed(2)}%`;
    return span;
  };

  const downtimeRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as ManufacturingRow;
    const isParent = hasStations(row);
    const hours = d.downtime;
    const color = hours < 1 ? "#16a34a" : hours < 2 ? "#f59e0b" : "#dc2626";
    const span = document.createElement("span");
    Object.assign(span.style, { color, fontWeight: isParent ? "bold" : "normal" });
    span.textContent = hours.toFixed(2);
    return span;
  };

  const utilizationRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as ManufacturingRow;
    if (hasStations(row)) {
      const span = document.createElement("span");
      span.style.fontWeight = "bold";
      span.textContent = `${d.utilization?.toFixed(0)}%`;
      return span;
    }
    return `${d.utilization}%`;
  };

  const maintenanceDateRenderer: CellRenderer = ({ row }) => {
    if (hasStations(row)) return "—";
    const d = row as unknown as ManufacturingRow;
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

    const span = document.createElement("span");
    Object.assign(span.style, {
      backgroundColor: tagColor, color: textColor, padding: "0 7px",
      fontSize: "12px", lineHeight: "20px", borderRadius: "2px", display: "inline-block",
    });
    span.textContent = `${date.toLocaleDateString()} (${diffDays} days)`;
    return span;
  };

  const rendererMap: Record<string, CellRenderer> = {
    productLine: productLineRenderer,
    station: stationRenderer,
    status: statusRenderer,
    outputRate: boldParentNumberRenderer("outputRate"),
    cycletime: cycletimeRenderer,
    efficiency: efficiencyRenderer,
    defectRate: defectRateRenderer,
    defectCount: boldParentNumberRenderer("defectCount"),
    downtime: downtimeRenderer,
    utilization: utilizationRenderer,
    energy: boldParentNumberRenderer("energy"),
    maintenanceDate: maintenanceDateRenderer,
  };

  return manufacturingConfig.headers.map((h) => {
    const renderer = rendererMap[String(h.accessor)];
    return renderer ? { ...h, cellRenderer: renderer } : { ...h };
  });
}

@Component({
  selector: "manufacturing-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [columnResizing]="true"
      [columnReordering]="true"
      [defaultHeaders]="headers"
      [height]="height"
      [rowGrouping]="grouping"
      [rows]="rows"
      [selectableCells]="true"
      [theme]="theme"
    ></simple-table>
  `,
})
export class ManufacturingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly grouping = ["stations"];
  readonly rows: Row[] = manufacturingConfig.rows;
  readonly headers: AngularHeaderObject[] = getHeaders();
}
