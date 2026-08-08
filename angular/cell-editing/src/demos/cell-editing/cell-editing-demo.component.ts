import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, CellChangeProps, GetRowIdParams, Theme } from "@simple-table/angular";
import { cellEditingConfig } from "./cell-editing.demo-data";
import "@simple-table/angular/styles.css";
import type { CellEditingEmployee } from "./cell-editing.demo-data";

@Component({
  selector: "cell-editing-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="data"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      (cellEdit)="onCellEdit($event)"
    ></simple-table>
  `,
})
export class CellEditingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularColumnDef<CellEditingEmployee>[] = cellEditingConfig.headers;
  data = [...cellEditingConfig.rows];

  onCellEdit({ accessor, newValue, row }: CellChangeProps<CellEditingEmployee>): void {
    this.data = this.data.map((item) =>
      item.id === row.id ? { ...item, [accessor]: newValue } : item
    );
  }

  getRowId = ({ row }: GetRowIdParams<CellEditingEmployee>) => row.id;
}
