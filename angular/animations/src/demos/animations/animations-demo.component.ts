import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularColumnDef, GetRowIdParams, Theme } from "@simple-table/angular";
import { animationsConfig } from "./animations.demo-data";
import "@simple-table/angular/styles.css";
import type { AnimationsCrewMember } from "./animations.demo-data";

@Component({
  selector: "animations-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [getRowId]="getRowId"
      [rows]="rows"
      [columns]="headers"
      [height]="height"
      [theme]="theme"
      [columnReordering]="true"
      [enableColumnEditor]="true"
      [enableColumnEditorInitOpen]="true"
      (columnOrderChange)="onColumnOrderChange($event)"
    ></simple-table>
  `,
})
export class AnimationsDemoComponent {
  @Input() height: string | number = "400px";
  @Input() theme?: Theme;

  readonly rows: AnimationsCrewMember[] = animationsConfig.rows;
  headers: AngularColumnDef<AnimationsCrewMember>[] = [...animationsConfig.headers];

  onColumnOrderChange(newHeaders: AngularColumnDef<AnimationsCrewMember>[]): void {
    this.headers = newHeaders;
  }

  getRowId = ({ row }: GetRowIdParams<AnimationsCrewMember>) => row.id;
}
