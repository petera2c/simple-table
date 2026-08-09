import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type {
  AngularColumnDef,
  GetRowIdParams,
  PivotConfig,
  Theme,
} from "@simple-table/angular";
import { pivotDemoConfig } from "./pivot.demo-data";
import type { PivotFact } from "./pivot.demo-data";
import "@simple-table/angular/styles.css";

const INITIAL_PIVOT: PivotConfig = {
  rows: ["region", "product"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
};

@Component({
  selector: "pivot-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <div>
      <label
        style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 14px; color: #374151"
      >
        <input
          type="checkbox"
          [checked]="pivotEnabled"
          aria-label="Pivot mode"
          (change)="onPivotEnabledChange($any($event.target).checked)"
        />
        Pivot mode
      </label>
      <simple-table
        [getRowId]="getRowId"
        [rows]="rows"
        [columns]="headers"
        [pivot]="pivotEnabled ? pivot : null"
        [onPivotChange]="onPivotChange"
        [autoExpandColumns]="true"
        [columnResizing]="true"
        [enableColumnEditor]="true"
        [enableColumnEditorInitOpen]="true"
        [enablePivotPanel]="pivotEnabled"
        [height]="height"
        [selectableCells]="true"
        [theme]="theme"
      ></simple-table>
    </div>
  `,
})
export class PivotDemoComponent {
  @Input() height: string | number = "500px";
  @Input() theme?: Theme;

  readonly rows: PivotFact[] = pivotDemoConfig.rows;
  readonly headers: AngularColumnDef<PivotFact>[] = pivotDemoConfig.headers;

  pivotEnabled = true;
  pivot: PivotConfig | null = INITIAL_PIVOT;

  onPivotEnabledChange(enabled: boolean): void {
    this.pivotEnabled = enabled;
    if (enabled && this.pivot === null) {
      this.pivot = INITIAL_PIVOT;
    }
  }

  onPivotChange = (next: PivotConfig | null) => {
    this.pivot = next;
  };

  getRowId = ({ row }: GetRowIdParams<PivotFact>) =>
    row?.id == null ? undefined : String(row.id);
}
