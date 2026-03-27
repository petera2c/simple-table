import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { CellChangeProps } from "simple-table-core";
import { cellEditingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "cell-editing-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="data"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      (cellEdit)="onCellEdit($event)"
    ></simple-table>
  `,
})
export class CellEditingDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = cellEditingConfig.headers;
  data = [...cellEditingConfig.rows];

  onCellEdit({ accessor, newValue, row }: CellChangeProps): void {
    this.data = this.data.map((item) =>
      item.id === row.id ? { ...item, [accessor]: newValue } : item
    );
  }
}
