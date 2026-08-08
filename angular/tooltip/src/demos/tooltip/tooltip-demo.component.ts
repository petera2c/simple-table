import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { tooltipConfig } from "./tooltip.demo-data";
import "@simple-table/angular/styles.css";
import type { TooltipProduct } from "./tooltip.demo-data";

@Component({
  selector: "tooltip-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [columnResizing]="true"
      [columnReordering]="true"
      [selectableCells]="true"
    ></simple-table>
  `,
})
export class TooltipDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: TooltipProduct[] = tooltipConfig.rows;
  readonly headers: AngularColumnDef<TooltipProduct>[] = tooltipConfig.headers;

  getRowId = ({ row }: GetRowIdParams<TooltipProduct>) => row.id;
}
