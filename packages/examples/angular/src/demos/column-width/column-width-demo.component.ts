import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import {SimpleTableComponent, defaultHeadersFromCore} from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { columnWidthConfig } from "./column-width.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "column-width-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [autoExpandColumns]="!isMobile"
      [columnResizing]="true"
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class ColumnWidthDemoComponent implements OnInit, OnDestroy {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = columnWidthConfig.rows;
  readonly headers: AngularHeaderObject[] = defaultHeadersFromCore(columnWidthConfig.headers);
  isMobile = false;

  private checkMobile = () => { this.isMobile = window.innerWidth < 768; };

  ngOnInit() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.checkMobile);
  }
}
