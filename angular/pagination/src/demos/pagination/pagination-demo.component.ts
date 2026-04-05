import { Component, Input } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { paginationConfig, paginationData, PAGINATION_ROWS_PER_PAGE } from "./pagination.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "pagination-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [shouldPaginate]="true"
      [rowsPerPage]="rowsPerPage"
      [isLoading]="isLoading"
      [onNextPage]="onNextPage"
    ></simple-table>
  `,
})
export class PaginationDemoComponent {
  @Input() height: string | number = "auto";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(paginationConfig.headers);
  readonly rowsPerPage = PAGINATION_ROWS_PER_PAGE;
  rows: Row[] = paginationData.slice(0, PAGINATION_ROWS_PER_PAGE);
  isLoading = false;

  onNextPage = async (pageIndex: number): Promise<boolean> => {
    const startIndex = pageIndex * PAGINATION_ROWS_PER_PAGE;
    const endIndex = startIndex + PAGINATION_ROWS_PER_PAGE;

    this.isLoading = true;
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newPageData = paginationData.slice(startIndex, endIndex);

    if (newPageData.length === 0 || this.rows.length > startIndex) {
      this.isLoading = false;
      return false;
    }

    this.rows = [...this.rows, ...newPageData];
    this.isLoading = false;
    return true;
  };
}
