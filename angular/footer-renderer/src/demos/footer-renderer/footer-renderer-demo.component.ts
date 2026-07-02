import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Row, Theme } from "@simple-table/angular";
import { footerDemoThemeContext } from "./footer-demo-theme-context";
import { FooterPaginationComponent } from "./footer-pagination.component";
import { footerRendererConfig } from "./footer-renderer.demo-data";
import "@simple-table/angular/styles.css";

@Component({
  selector: "footer-renderer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [footerRenderer]="footerRenderer"
      [shouldPaginate]="true"
      [rowsPerPage]="10"
      [hideFooter]="false"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class FooterRendererDemoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = footerRendererConfig.rows;
  readonly headers: AngularHeaderObject[] = footerRendererConfig.headers;
  readonly footerRenderer = FooterPaginationComponent;

  ngOnInit(): void {
    footerDemoThemeContext.set(this.theme);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["theme"]) {
      footerDemoThemeContext.set(this.theme);
    }
  }

  ngOnDestroy(): void {
    footerDemoThemeContext.set(undefined);
  }
}
