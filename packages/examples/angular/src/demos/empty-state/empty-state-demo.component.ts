import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { emptyStateConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

function buildEmptyStateEl(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 16px;color:#94a3b8";

  const icon = document.createElement("div");
  icon.style.cssText = "font-size:32px;margin-bottom:8px";
  icon.textContent = "\uD83D\uDCED";
  wrapper.appendChild(icon);

  const title = document.createElement("div");
  title.style.cssText = "font-size:15px;font-weight:600";
  title.textContent = "No data available";
  wrapper.appendChild(title);

  const sub = document.createElement("div");
  sub.style.cssText = "font-size:13px;margin-top:4px";
  sub.textContent = "Try adding some records to see them here.";
  wrapper.appendChild(sub);

  return wrapper;
}

@Component({
  selector: "empty-state-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [defaultHeaders]="headers"
      [height]="height"
      [theme]="theme"
    ></simple-table>
  `,
})
export class EmptyStateDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = emptyStateConfig.rows;
  readonly headers: AngularHeaderObject[] = emptyStateConfig.headers;
}
