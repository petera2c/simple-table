import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { soccerConfig } from "./soccer.demo-data";
import "@simple-table/angular/styles.css";
import type { SoccerPlayer } from "./soccer.demo-data";

@Component({
  selector: "soccer-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [autoExpandColumns]="true"
      [getRowId]="getRowId"
      [columns]="headers"
      [rows]="rows"
      [height]="height"
      [theme]="theme"
      [columnReordering]="true"
      [columnResizing]="true"
      [enableColumnEditor]="true"
      [selectableCells]="true"
      initialSortColumn="rating"
      initialSortDirection="desc"
      [customTheme]="customTheme"
    ></simple-table>
  `,
})
export class SoccerDemoComponent {
  @Input() height: string | number = "70dvh";
  @Input() theme?: Theme;

  readonly headers: AngularColumnDef<SoccerPlayer>[] = soccerConfig.headers;
  readonly rows: SoccerPlayer[] = soccerConfig.rows;
  readonly customTheme = { headerHeight: 40, rowHeight: 48 };

  getRowId = ({ row }: GetRowIdParams<SoccerPlayer>) => row.id;
}
