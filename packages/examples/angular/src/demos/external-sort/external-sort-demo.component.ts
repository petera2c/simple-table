import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme, SortColumn } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { externalSortConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "external-sort-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="sortedRows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [columnResizing]="true"
      [onSortChange]="handleSortChange"
    ></simple-table>
  `,
})
export class ExternalSortDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = externalSortConfig.headers;
  private sortState: SortColumn | null = null;

  handleSortChange = (sort: SortColumn | null): void => {
    this.sortState = sort;
  };

  get sortedRows(): Row[] {
    const rows = [...externalSortConfig.rows];
    if (!this.sortState) return rows;
    const accessor = this.sortState.key.accessor as string;
    const dir = this.sortState.direction;
    return rows.sort((a, b) => {
      const aVal = a[accessor];
      const bVal = b[accessor];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });
  }
}
