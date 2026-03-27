import { Component, Input, OnInit } from "@angular/core";
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
      <div style="margin-bottom: 8px">
        <button (click)="reload()">Reload Data</button>
      </div>
      <simple-table
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
        [isLoading]="isLoading"
      ></simple-table>
    </div>
  `,
})
export class LoadingStateDemoComponent implements OnInit {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = loadingStateConfig.rows;
  readonly headers: AngularHeaderObject[] = loadingStateConfig.headers;
  isLoading = true;

  ngOnInit(): void {
    setTimeout(() => (this.isLoading = false), 2000);
  }

  reload(): void {
    this.isLoading = true;
    setTimeout(() => (this.isLoading = false), 2000);
  }
}
