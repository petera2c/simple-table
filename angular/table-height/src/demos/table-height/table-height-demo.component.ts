import { Component, Input } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { tableHeightConfig } from "./table-height.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "table-height-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="display: flex; gap: 8px; margin-bottom: 12px">
        @for (h of heights; track h) {
          <button
            (click)="selectedHeight = h"
            [style.padding]="'6px 12px'"
            [style.borderRadius]="'4px'"
            [style.border]="'1px solid #ccc'"
            [style.background]="selectedHeight === h ? '#3b82f6' : '#f3f4f6'"
            [style.color]="selectedHeight === h ? '#fff' : '#374151'"
            [style.cursor]="'pointer'"
            [style.fontSize]="'14px'"
            [style.fontWeight]="'500'"
          >
            {{ h }}
          </button>
        }
      </div>
      <simple-table
        [rows]="rows"
        [defaultHeaders]="headers"
        [height]="selectedHeight"
        [theme]="theme"
      ></simple-table>
    </div>
  `,
})
export class TableHeightDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = tableHeightConfig.rows;
  readonly headers: AngularHeaderObject[] = tableHeightConfig.headers;
  readonly heights = ["200px", "300px", "400px"];
  selectedHeight = "400px";
}
