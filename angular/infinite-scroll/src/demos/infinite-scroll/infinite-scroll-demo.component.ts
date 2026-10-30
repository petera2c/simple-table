import { Component, Input } from "@angular/core";
import { SimpleTableImports } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { infiniteScrollConfig, generateInfiniteScrollData } from "./infinite-scroll.demo-data";
import "@simple-table/angular/styles.css";
import type { InfiniteScrollEmployee } from "./infinite-scroll.demo-data";

const MAX_ROWS = 200;
const BATCH_SIZE = 15;

@Component({
  selector: "infinite-scroll-demo",
  standalone: true,
  imports: [SimpleTableImports],
  template: `
    <div>
      <div style="margin-bottom: 8px; font-size: 13px; color: #666">
        {{ rows.length }} rows loaded{{ hasMore ? '' : ' (all loaded)' }}
      </div>
      <simple-table
      [getRowId]="getRowId"
        [rows]="rows"
        [columns]="headers"
        [isLoading]="loading"
        [height]="height"
        [theme]="theme"
        (loadMore)="handleLoadMore()"
      ></simple-table>
    </div>
  `,
})
export class InfiniteScrollDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularColumnDef<InfiniteScrollEmployee>[] = infiniteScrollConfig.headers;
  rows: InfiniteScrollEmployee[] = generateInfiniteScrollData(0, 30) ;
  loading = false;
  hasMore = true;

  handleLoadMore = () => {
    if (this.loading || !this.hasMore) return;
    this.loading = true;
    setTimeout(() => {
      const newRows = generateInfiniteScrollData(this.rows.length, BATCH_SIZE) ;
      this.rows = [...this.rows, ...newRows];
      if (this.rows.length >= MAX_ROWS) this.hasMore = false;
      this.loading = false;
    }, 500);
  };

  getRowId = ({ row }: GetRowIdParams<InfiniteScrollEmployee>) => row.id;
}
