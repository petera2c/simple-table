import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import {SimpleTableComponent} from "@simple-table/angular";import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { columnWidthConfig } from "./column-width.demo-data";
import "@simple-table/angular/styles.css";
import type { StartupEmployee } from "./column-width.demo-data";

@Component({
  selector: "column-width-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [autoExpandColumns]="!isMobile"
      [columnResizing]="true"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class ColumnWidthDemoComponent implements OnInit, OnDestroy {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: StartupEmployee[] = columnWidthConfig.rows;
  readonly headers: AngularColumnDef<StartupEmployee>[] = columnWidthConfig.headers;
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
