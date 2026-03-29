import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row, TableFilterState } from "simple-table-core";
import { externalFilterConfig, matchesFilter } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "external-filter-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="filteredRows"
      [defaultHeaders]="headers"
      [externalFilterHandling]="true"
      [columnResizing]="true"
      [height]="height"
      [theme]="theme"
      [onFilterChange]="handleFilterChange"
    ></simple-table>
  `,
})
export class ExternalFilterDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = externalFilterConfig.headers;
  private filters: TableFilterState = {};

  handleFilterChange = (newFilters: TableFilterState) => {
    this.filters = newFilters;
  };

  get filteredRows(): Row[] {
    const entries = Object.entries(this.filters);
    if (entries.length === 0) return externalFilterConfig.rows as Row[];

    return (externalFilterConfig.rows as Row[]).filter((row) =>
      entries.every(([accessor, filter]) =>
        matchesFilter(row[accessor] as any, filter)
      )
    );
  }
}
