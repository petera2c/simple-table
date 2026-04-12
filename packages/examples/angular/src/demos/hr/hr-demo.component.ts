import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularCellRenderer, AngularHeaderObject, CellChangeProps, Theme } from "@simple-table/angular";
import { hrConfig } from "./hr.demo-data";
import { HrFullNameCellComponent } from "./hr-full-name-cell.component";
import { HrHireDateCellComponent } from "./hr-hire-date-cell.component";
import { HrPerformanceCellComponent } from "./hr-performance-cell.component";
import { HrSalaryCellComponent } from "./hr-salary-cell.component";
import { HrStatusCellComponent } from "./hr-status-cell.component";
import { HrYearsCellComponent } from "./hr-years-cell.component";
import "@simple-table/angular/styles.css";

const RENDERERS: Partial<Record<string, AngularCellRenderer>> = {
  fullName: HrFullNameCellComponent,
  performanceScore: HrPerformanceCellComponent,
  hireDate: HrHireDateCellComponent,
  yearsOfService: HrYearsCellComponent,
  salary: HrSalaryCellComponent,
  status: HrStatusCellComponent,
};

function buildHRHeaders(): AngularHeaderObject[] {
  return hrConfig.headers.map((h): AngularHeaderObject => {
    const cellRenderer = RENDERERS[String(h.accessor)];
    return cellRenderer ? { ...h, cellRenderer } : { ...h };
  });
}

@Component({
  selector: "hr-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [defaultHeaders]="headers"
      [rows]="data"
      [height]="height"
      [theme]="theme"
      [columnReordering]="true"
      [columnResizing]="true"
      [selectableCells]="true"
      [shouldPaginate]="true"
      [rowsPerPage]="rowsPerPage"
      [customTheme]="{ rowHeight: 48 }"
      (cellEdit)="onCellEdit($event)"
    ></simple-table>
  `,
})
export class HRDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = buildHRHeaders();
  data = [...hrConfig.rows];

  get rowsPerPage(): number {
    const heightNum = typeof this.height === "number" ? this.height : 400;
    return Math.floor(heightNum / 48);
  }

  onCellEdit({ accessor, newValue, row }: CellChangeProps): void {
    this.data = this.data.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item));
  }
}
