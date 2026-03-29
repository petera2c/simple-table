import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { loadingStateConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "loading-state-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="margin-bottom: 12px">
        <button
          (click)="loadData()"
          [disabled]="isLoading"
          [style.padding]="'6px 16px'"
          [style.cursor]="isLoading ? 'not-allowed' : 'pointer'"
        >
          {{ isLoading ? 'Loading\u2026' : 'Reload Data' }}
        </button>
      </div>
      <simple-table
        [rows]="data"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
        [isLoading]="isLoading"
      ></simple-table>
    </div>
  `,
})
export class LoadingStateDemoComponent implements OnInit, OnDestroy {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = loadingStateConfig.headers;
  data: Row[] = [];
  isLoading = true;
  private timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  loadData(): void {
    this.isLoading = true;
    this.data = [];
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.data = loadingStateConfig.rows as Row[];
      this.isLoading = false;
    }, 2000);
  }
}
