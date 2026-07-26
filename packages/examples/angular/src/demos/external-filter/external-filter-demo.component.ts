import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, TableFilterState, Theme } from "@simple-table/angular";
import { externalFilterConfig, isFilterableKey, matchesFilter } from "./external-filter.demo-data";
import "@simple-table/angular/styles.css";
import type { FilterableEmployee } from "./external-filter.demo-data";

@Component({
  selector: "external-filter-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="filteredRows"
      [columns]="headers"
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

  readonly headers: AngularColumnDef<FilterableEmployee>[] = externalFilterConfig.headers;
  private filters: TableFilterState = {};

  handleFilterChange = (newFilters: TableFilterState) => {
    this.filters = newFilters;
  };

  get filteredRows(): FilterableEmployee[] {
    const entries = Object.entries(this.filters);
    if (entries.length === 0) return externalFilterConfig.rows ;

    return (externalFilterConfig.rows ).filter((row) =>
      entries.every(([accessor, filter]) => {
        if (!isFilterableKey(accessor)) return true;
        return matchesFilter(row[accessor], filter);
      }),
    );
  }

  getRowId = ({ row }: GetRowIdParams<FilterableEmployee>) => row.id;
}
