import { Component, Input } from "@angular/core";
import { SimpleTableComponent } from "@simple-table/angular";
import type { AngularHeaderObject, Theme } from "@simple-table/angular";
import type { OnRowGroupExpandProps } from "simple-table-core";
import {
  dynamicNestedTablesConfig,
  dynamicNestedTablesData,
  fetchDivisionsForCompany,
} from "@simple-table/examples-shared";
import type { DynamicCompany } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

@Component({
  selector: "dynamic-nested-tables-demo",
  standalone: true,
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [autoExpandColumns]="true"
      [defaultHeaders]="headers"
      [expandAll]="false"
      [height]="height"
      [rowGrouping]="grouping"
      [getRowId]="getRowId"
      [rows]="rows"
      [onRowGroupExpand]="handleCompanyExpand"
      [theme]="theme"
    ></simple-table>
  `,
})
export class DynamicNestedTablesDemoComponent {
  @Input() height: string | number = "500px";
  @Input() theme?: Theme;

  headers: AngularHeaderObject[] = dynamicNestedTablesConfig.headers;
  rows: DynamicCompany[] = [...dynamicNestedTablesData];
  readonly grouping = ["divisions"];
  readonly getRowId = ({ row }: { row: Record<string, unknown> }) => row["id"] as string;

  handleCompanyExpand = async ({
    row,
    groupingKey,
    isExpanded,
    rowIndexPath,
    setLoading,
    setError,
    setEmpty,
  }: OnRowGroupExpandProps) => {
    if (!isExpanded) return;
    try {
      if (groupingKey === "divisions") {
        const company = row as DynamicCompany;
        if (company.divisions && company.divisions.length > 0) return;
        setLoading(true);
        const divisions = await fetchDivisionsForCompany(company.id);
        if (divisions.length === 0) {
          setEmpty(true, "No divisions found");
          return;
        }
        const newRows = [...this.rows];
        newRows[rowIndexPath[0]] = { ...newRows[rowIndexPath[0]], divisions };
        this.rows = newRows;
      }
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error.message : "Failed to load divisions");
    }
  };
}
