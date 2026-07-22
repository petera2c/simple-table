import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularCellRenderer, AngularColumnDef, Row, Theme } from "@simple-table/angular";
import { cellRendererConfig } from "./cell-renderer.demo-data";
import { CrProgressCellComponent } from "./cr-progress-cell.component";
import { CrRatingCellComponent } from "./cr-rating-cell.component";
import { CrStatusCellComponent } from "./cr-status-cell.component";
import { CrTagsCellComponent } from "./cr-tags-cell.component";
import { CrTeamMembersCellComponent } from "./cr-team-members-cell.component";
import { CrVerifiedCellComponent } from "./cr-verified-cell.component";
import { CrWebsiteCellComponent } from "./cr-website-cell.component";
import "@simple-table/angular/styles.css";

const RENDERERS: Partial<Record<string, AngularCellRenderer>> = {
  teamMembers: CrTeamMembersCellComponent,
  website: CrWebsiteCellComponent,
  status: CrStatusCellComponent,
  progress: CrProgressCellComponent,
  rating: CrRatingCellComponent,
  verified: CrVerifiedCellComponent,
  tags: CrTagsCellComponent,
};

@Component({
  selector: "cell-renderer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [selectableCells]="true"
      [customTheme]="{ rowHeight: 48 }"
    ></simple-table>
  `,
})
export class CellRendererDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: Row[] = cellRendererConfig.rows;
  readonly headers: AngularColumnDef[] = cellRendererConfig.headers.map((h): AngularColumnDef => {
    const cellRenderer = RENDERERS[String(h.accessor)];
    return cellRenderer ? { ...h, cellRenderer } : { ...h };
  });
}
