import { Component, Input } from "@angular/core";
import { SimpleTableImports } from "@simple-table/angular";
import type { AngularCellRenderer, AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { cellRendererConfig } from "./cell-renderer.demo-data";
import { CrProgressCellComponent } from "./cr-progress-cell.component";
import { CrRatingCellComponent } from "./cr-rating-cell.component";
import { CrTagsCellComponent } from "./cr-tags-cell.component";
import { CrTeamMembersCellComponent } from "./cr-team-members-cell.component";
import { CrVerifiedCellComponent } from "./cr-verified-cell.component";
import { CrWebsiteCellComponent } from "./cr-website-cell.component";
import "@simple-table/angular/styles.css";
import type { CellRendererEmployee } from "./cell-renderer.demo-data";

const RENDERERS: Partial<Record<string, AngularCellRenderer<CellRendererEmployee>>> = {
  teamMembers: CrTeamMembersCellComponent,
  website: CrWebsiteCellComponent,
  progress: CrProgressCellComponent,
  rating: CrRatingCellComponent,
  verified: CrVerifiedCellComponent,
  tags: CrTagsCellComponent,
};

const STATUS_META: Record<string, { icon: string; color: string }> = {
  active: { icon: "✓", color: "#10B981" },
  inactive: { icon: "✕", color: "#EF4444" },
  pending: { icon: "!", color: "#F59E0B" },
};

@Component({
  selector: "cell-renderer-demo",
  standalone: true,
  imports: [SimpleTableImports],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [selectableCells]="true"
      [customTheme]="{ rowHeight: 48 }"
    >
      <ng-template stCell="status" let-value="value">
        <span
          [style.color]="statusMeta(value).color"
          style="font-weight:600;text-transform:capitalize;"
        >{{ statusMeta(value).icon }} {{ value }}</span>
      </ng-template>
    </simple-table>
  `,
})
export class CellRendererDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: CellRendererEmployee[] = cellRendererConfig.rows;
  readonly headers: AngularColumnDef<CellRendererEmployee>[] = cellRendererConfig.headers.map((h): AngularColumnDef<CellRendererEmployee> => {
    const cellRenderer = RENDERERS[String(h.accessor)];
    return cellRenderer ? { ...h, cellRenderer } : { ...h };
  });

  getRowId = ({ row }: GetRowIdParams<CellRendererEmployee>) => row.id;

  statusMeta(value: unknown): { icon: string; color: string } {
    return STATUS_META[String(value)] ?? { icon: "?", color: "#6b7280" };
  }
}
