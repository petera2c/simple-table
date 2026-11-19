import { Component, Input } from "@angular/core";
import { SimpleTableImports } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { emptyStateConfig } from "./empty-state.demo-data";
import "@simple-table/angular/styles.css";
import type { EmptyEmployee } from "./empty-state.demo-data";

@Component({
  selector: "empty-state-demo",
  standalone: true,
  imports: [SimpleTableImports],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
    >
      <ng-template stEmpty>
        <div
          style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;color:#64748b;gap:12px;"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
            <path d="M16 3H8L3 7h18l-5-4z" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
          <div style="font-size:16px;font-weight:600;">No data available</div>
          <div style="font-size:13px;">Try adjusting your filters or adding new records.</div>
        </div>
      </ng-template>
    </simple-table>
  `,
})
export class EmptyStateDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: EmptyEmployee[] = emptyStateConfig.rows;
  readonly headers: AngularColumnDef<EmptyEmployee>[] = emptyStateConfig.headers;

  getRowId = ({ row }: GetRowIdParams<EmptyEmployee>) => row.id;
}
