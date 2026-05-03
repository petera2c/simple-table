import { Component, Input } from "@angular/core";
import { SimpleTableComponent, asRows } from "@simple-table/angular";
import type { AngularCellRenderer, AngularHeaderObject, Theme } from "@simple-table/angular";
import { manufacturingConfig } from "./manufacturing.demo-data";
import {
  MfgCycletimeCellComponent,
  MfgDefectRateCellComponent,
  MfgDowntimeCellComponent,
  MfgEfficiencyCellComponent,
  MfgMaintenanceDateCellComponent,
  MfgNumberBoldParentCellComponent,
  MfgProductLineCellComponent,
  MfgStationCellComponent,
  MfgStatusCellComponent,
  MfgUtilizationCellComponent,
} from "./manufacturing-cell-components";
import "@simple-table/angular/styles.css";

const RENDERERS: Partial<Record<string, AngularCellRenderer>> = {
  productLine: MfgProductLineCellComponent,
  station: MfgStationCellComponent,
  status: MfgStatusCellComponent,
  outputRate: MfgNumberBoldParentCellComponent,
  cycletime: MfgCycletimeCellComponent,
  efficiency: MfgEfficiencyCellComponent,
  defectRate: MfgDefectRateCellComponent,
  defectCount: MfgNumberBoldParentCellComponent,
  downtime: MfgDowntimeCellComponent,
  utilization: MfgUtilizationCellComponent,
  energy: MfgNumberBoldParentCellComponent,
  maintenanceDate: MfgMaintenanceDateCellComponent,
};

function getHeaders(): AngularHeaderObject[] {
  return manufacturingConfig.headers.map((h): AngularHeaderObject => {
    const cellRenderer = RENDERERS[String(h.accessor)];
    return cellRenderer ? { ...h, cellRenderer } : { ...h };
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
  readonly rows = asRows(manufacturingConfig.rows);
  readonly headers: AngularHeaderObject[] = getHeaders();
}
