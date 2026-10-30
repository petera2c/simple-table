import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { columnReorderingConfig } from "./column-reordering.demo-data";
import "@simple-table/angular/styles.css";
import type { CrewMember } from "./column-reordering.demo-data";

@Component({
  selector: "column-reordering-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [columnReordering]="true"
      (columnOrderChange)="onColumnOrderChange($event)"
    ></simple-table>
  `,
})
export class ColumnReorderingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: CrewMember[] = columnReorderingConfig.rows;
  headers: AngularColumnDef<CrewMember>[] = [...columnReorderingConfig.headers];

  onColumnOrderChange(newHeaders: AngularColumnDef<CrewMember>[]): void {
    this.headers = newHeaders;
  }

  getRowId = ({ row }: GetRowIdParams<CrewMember>) => row.id;
}
