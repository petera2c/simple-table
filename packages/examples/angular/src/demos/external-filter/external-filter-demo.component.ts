import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { Row } from "simple-table-core";
import { externalFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "external-filter-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <div style="margin-bottom: 8px">
        <input
          type="text"
          placeholder="Filter rows..."
          [value]="filterText"
          (input)="onFilterInput($event)"
          style="padding: 4px 8px"
        />
      </div>
      <simple-table
        [rows]="filteredRows"
        [defaultHeaders]="headers"
        [height]="height"
        [theme]="theme"
      ></simple-table>
    </div>
  `,
})
export class ExternalFilterDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly headers: AngularHeaderObject[] = externalFilterConfig.headers;
  filterText = "";

  onFilterInput(event: Event): void {
    this.filterText = (event.target as HTMLInputElement).value;
  }

  get filteredRows(): Row[] {
    const text = this.filterText.toLowerCase();
    if (!text) return externalFilterConfig.rows;
    return externalFilterConfig.rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(text)
      )
    );
  }
}
