import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { emptyStateConfig } from "./empty-state.demo-data";
import { TableEmptyStateComponent } from "./table-empty-state.component";
import "@simple-table/angular/styles.css";
import type { EmptyEmployee } from "./empty-state.demo-data";

@Component({
  selector: "empty-state-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [tableEmptyStateRenderer]="emptyState"
    ></simple-table>
  `,
})
export class EmptyStateDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: EmptyEmployee[] = emptyStateConfig.rows;
  readonly headers: AngularColumnDef<EmptyEmployee>[] = emptyStateConfig.headers;
  readonly emptyState = TableEmptyStateComponent;

  getRowId = ({ row }: GetRowIdParams<EmptyEmployee>) => row.id;
}
