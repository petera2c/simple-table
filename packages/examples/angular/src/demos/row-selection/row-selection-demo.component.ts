import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme, RowSelectionChangeProps } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { rowSelectionConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "row-selection-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="margin-bottom: 8px">Selected rows: {{ selectedCount }}</div>
      <simple-table
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
        [enableRowSelection]="true"
        [onRowSelectionChange]="handleSelectionChange"
      ></simple-table>
    </div>
  `,
})
export class RowSelectionDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = rowSelectionConfig.rows;
  readonly headers: AngularHeaderObject[] = rowSelectionConfig.headers;
  selectedCount = 0;

  handleSelectionChange = (selection: RowSelectionChangeProps): void => {
    this.selectedCount = selection.selectedRows.size;
  };
}
