import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularCellRenderer, AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
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
import type { ManufacturingRow } from "./manufacturing.demo-data";

const RENDERERS: Partial<Record<string, AngularCellRenderer<ManufacturingRow>>> = {
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

function getHeaders(): AngularColumnDef<ManufacturingRow>[] {
  return manufacturingConfig.headers.map((h): AngularColumnDef<ManufacturingRow> => {
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
      [autoExpandColumns]="true"
      [getRowId]="getRowId"
      [columnResizing]="true"
      [columnReordering]="true"
      [columns]="headers"
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
  readonly rows: ManufacturingRow[] = [...manufacturingConfig.rows];
  readonly headers: AngularColumnDef<ManufacturingRow>[] = getHeaders();

  getRowId = ({ row }: GetRowIdParams<ManufacturingRow>) => row.id;
}
