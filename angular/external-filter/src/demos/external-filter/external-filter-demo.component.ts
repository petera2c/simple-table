import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, TableFilterState, Theme } from "@simple-table/angular";
import { externalFilterConfig, matchesFilter } from "./external-filter.demo-data";
import "@simple-table/angular/styles.css";

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

  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(externalFilterConfig.headers);
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
