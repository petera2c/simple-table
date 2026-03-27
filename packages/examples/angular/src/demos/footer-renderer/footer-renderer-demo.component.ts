import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row, FooterRendererProps } from "simple-table-core";
import { footerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

function customFooter(props: FooterRendererProps): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:0 12px;height:100%;font-size:13px";

  const info = document.createElement("span");
  info.textContent = `Showing ${props.startRow}\u2013${props.endRow} of ${props.totalRows}`;
  wrapper.appendChild(info);

  const nav = document.createElement("div");
  nav.style.cssText = "display:flex;gap:8px;align-items:center";

  const prev = document.createElement("button");
  prev.textContent = "Prev";
  prev.disabled = !props.hasPrevPage;
  prev.style.cssText = "padding:2px 8px;cursor:" + (props.hasPrevPage ? "pointer" : "default");
  prev.addEventListener("click", () => props.onPrevPage());
  nav.appendChild(prev);

  const page = document.createElement("span");
  page.textContent = `Page ${props.currentPage} / ${props.totalPages}`;
  nav.appendChild(page);

  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = !props.hasNextPage;
  next.style.cssText = "padding:2px 8px;cursor:" + (props.hasNextPage ? "pointer" : "default");
  next.addEventListener("click", () => props.onNextPage());
  nav.appendChild(next);

  wrapper.appendChild(nav);
  return wrapper;
}

@Component({
  selector: "footer-renderer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [shouldPaginate]="true"
      [rowsPerPage]="5"
      [footerRenderer]="footerFn"
    ></simple-table>
  `,
})
export class FooterRendererDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = footerRendererConfig.rows;
  readonly headers: AngularHeaderObject[] = footerRendererConfig.headers;
  readonly footerFn = customFooter as any;
}
