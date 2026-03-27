import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row, HeaderRenderer } from "simple-table-core";
import { headerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const customHeaderRenderer: HeaderRenderer = ({ header, components }) => {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;align-items:center;gap:4px;width:100%";

  const label = document.createElement("span");
  label.style.cssText = "font-weight:700;font-size:12px";
  label.textContent = header.label;
  wrapper.appendChild(label);

  if (components?.sortIcon) {
    if (typeof components.sortIcon === "string") {
      const s = document.createElement("span");
      s.innerHTML = components.sortIcon;
      wrapper.appendChild(s);
    } else {
      wrapper.appendChild(components.sortIcon as Node);
    }
  }

  return wrapper;
};

@Component({
  selector: "header-renderer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
      [selectableCells]="true"
      [columnResizing]="true"
    ></simple-table>
  `,
})
export class HeaderRendererDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = headerRendererConfig.rows;
  readonly headers: AngularHeaderObject[] = headerRendererConfig.headers.map((h) => ({
    ...h,
    headerRenderer: customHeaderRenderer as any,
  }));
}
