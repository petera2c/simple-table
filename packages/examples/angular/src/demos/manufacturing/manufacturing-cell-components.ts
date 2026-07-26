import { Component, Input } from "@angular/core";
import type { Theme } from "@simple-table/angular";
import { getManufacturingStatusColors } from "./manufacturing.demo-data";
import type { ManufacturingRow } from "./manufacturing.demo-data";

export function mfgHasStations(row: ManufacturingRow): boolean {
  return Boolean(row.stations && row.stations.length > 0);
}

@Component({
  standalone: true,
  selector: "demo-mfg-product-line",
  template: `
    @if (parent) {
      <span style="font-weight:bold;">{{ row.productLine }}</span>
    } @else {
      {{ row.productLine }}
    }
  `,
})
export class MfgProductLineCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }
}

@Component({
  standalone: true,
  selector: "demo-mfg-station",
  template: `
    @if (parent) {
      <span style="color:#6b7280;">{{ row.id }}</span>
    } @else {
      <div style="display:flex;align-items:center;gap:4px;">
        <span
          style="background:#dbeafe;color:#1d4ed8;font-size:0.75rem;font-weight:500;padding:2px 6px;border-radius:4px;"
          >{{ row.id }}</span>
        <span>{{ row.station }}</span>
      </div>
    }
  `,
})
export class MfgStationCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }
}

@Component({
  standalone: true,
  selector: "demo-mfg-status",
  template: `
    @if (!parent) {
      <span
        style="padding:4px 12px;font-size:12px;line-height:20px;border-radius:4px;display:inline-block;font-weight:600;"
        [style.background-color]="colors.bg"
        [style.color]="colors.text"
        >{{ row.status }}</span>
    } @else {
      —
    }
  `,
})
export class MfgStatusCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;
  @Input() theme?: Theme;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }

  get colors(): { bg: string; text: string } {
    return getManufacturingStatusColors(this.row.status, this.theme);
  }
}

@Component({
  standalone: true,
  selector: "demo-mfg-number-bold",
  template: `<div [style.font-weight]="parent ? 'bold' : 'normal'">{{ value.toLocaleString() }}</div>`,
})
export class MfgNumberBoldParentCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;
  @Input({ required: true }) value!: number;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }
}

@Component({
  standalone: true,
  selector: "demo-mfg-cycletime",
  template: `
    @if (parent) {
      <span style="font-weight:bold;">{{ row.cycletime?.toFixed(1) }}</span>
    } @else {
      {{ row.cycletime }}
    }
  `,
})
export class MfgCycletimeCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }
}

@Component({
  standalone: true,
  selector: "demo-mfg-efficiency",
  template: `
    <div style="width:100%;display:flex;flex-direction:column;">
      <div style="background:#f5f5f5;height:6px;width:100%;border-radius:100px;overflow:hidden;">
        <div
          style="height:100%;border-radius:100px;"
          [style.width.%]="eff"
          [style.background-color]="barColor"
        ></div>
      </div>
      <div
        style="font-size:12px;text-align:center;margin-top:4px;"
        [style.font-weight]="parent ? 'bold' : 'normal'"
      >
        {{ eff }}%
      </div>
    </div>
  `,
})
export class MfgEfficiencyCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }

  get eff(): number {
    return this.row.efficiency;
  }

  get barColor(): string {
    const e = this.eff;
    return e >= 90 ? "#52c41a" : e >= 75 ? "#1890ff" : "#ff4d4f";
  }
}

@Component({
  standalone: true,
  selector: "demo-mfg-defect-rate",
  template: `<span [style.color]="color" [style.font-weight]="parent ? 'bold' : 'normal'">{{ rate.toFixed(2) }}%</span>`,
})
export class MfgDefectRateCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }

  get rate(): number {
    return this.row.defectRate;
  }

  get color(): string {
    const r = this.rate;
    return r < 1 ? "#16a34a" : r < 3 ? "#f59e0b" : "#dc2626";
  }
}

@Component({
  standalone: true,
  selector: "demo-mfg-downtime",
  template: `<span [style.color]="color" [style.font-weight]="parent ? 'bold' : 'normal'">{{ hours.toFixed(2) }}</span>`,
})
export class MfgDowntimeCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }

  get hours(): number {
    return this.row.downtime;
  }

  get color(): string {
    const h = this.hours;
    return h < 1 ? "#16a34a" : h < 2 ? "#f59e0b" : "#dc2626";
  }
}

@Component({
  standalone: true,
  selector: "demo-mfg-utilization",
  template: `
    @if (parent) {
      <span style="font-weight:bold;">{{ row.utilization?.toFixed(0) }}%</span>
    } @else {
      {{ row.utilization }}%
    }
  `,
})
export class MfgUtilizationCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }
}

@Component({
  standalone: true,
  selector: "demo-mfg-maintenance-date",
  template: `
    @if (!parent) {
      <span
        style="padding:0 7px;font-size:12px;line-height:20px;border-radius:2px;display:inline-block;"
        [style.background-color]="tagBg"
        [style.color]="tagFg"
        >{{ label }}</span>
    } @else {
      —
    }
  `,
})
export class MfgMaintenanceDateCellComponent {
  @Input({ required: true }) row!: ManufacturingRow;

  get parent(): boolean {
    return mfgHasStations(this.row);
  }

  get label(): string {
    const [year, month, day] = this.row.maintenanceDate.split("-").map(Number);
    const date = new Date(year!, month! - 1, day!);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return `${date.toLocaleDateString()} (${diffDays} days)`;
  }

  get tagBg(): string {
    const [year, month, day] = this.row.maintenanceDate.split("-").map(Number);
    const date = new Date(year!, month! - 1, day!);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) return "#fff1f0";
    if (diffDays <= 7) return "#fff7e6";
    return "#e6f7ff";
  }

  get tagFg(): string {
    const [year, month, day] = this.row.maintenanceDate.split("-").map(Number);
    const date = new Date(year!, month! - 1, day!);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) return "#a8071a";
    if (diffDays <= 7) return "#ad4e00";
    return "#0050b3";
  }
}
