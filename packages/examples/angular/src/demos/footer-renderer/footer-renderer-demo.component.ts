import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row, FooterRendererProps } from "simple-table-core";
import { footerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const dataRows = footerRendererConfig.rows;
const totalQty = dataRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
const totalAmount = dataRows.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

function customFooter(_props: FooterRendererProps): HTMLElement {
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    background: "#f8fafc",
    borderTop: "2px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: "600",
  });
  wrapper.innerHTML = `<span>${dataRows.length} items · ${totalQty} units</span><span>Grand Total: $${totalAmount.toLocaleString()}</span>`;
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
      [footerRenderer]="footerFn"
      [hideFooter]="false"
      [height]="height"
      [theme]="theme"
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
