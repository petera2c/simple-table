import { wait, waitFor } from "./testUtils";
import { afterEach, describe, expect, it } from "vitest";
import {
  ApplicationRef,
  Component,
  ComponentRef,
  provideZoneChangeDetection,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { SimpleTableComponent } from "../lib/SimpleTableComponent";
import { provideSimpleTable } from "../lib/provideSimpleTable";
import type { AngularColumnDef, SimpleTableAngularProps } from "../types";

type Row = { id: string; name: string; age: number };

const columns: AngularColumnDef<Row>[] = [
  { accessor: "name", label: "Name", width: 160, type: "string" },
  { accessor: "age", label: "Age", width: 80, type: "number" },
];

const pageOne: Row[] = [
  { id: "r1", name: "Alice", age: 30 },
  { id: "r2", name: "Bob", age: 40 },
];

@Component({
  standalone: true,
  imports: [SimpleTableComponent],
  selector: "st-table-props-host",
  template: `
    <simple-table
      [columns]="columns"
      [rows]="rows"
      [tableProps]="tableProps"
      [getRowId]="getRowId"
      height="250px"
      theme="light"
    />
  `,
})
class TablePropsHost {
  readonly columns = columns;
  readonly rows = pageOne;
  tableProps: Partial<SimpleTableAngularProps<Row>> = {
    isLoading: false,
    enablePagination: true,
    serverSidePagination: true,
    rowsPerPage: 2,
    totalRowCount: 10,
  };
  getRowId = ({ row }: { row: Row }) => row.id;
}

let appRef: ApplicationRef | null = null;
let hostEl: HTMLElement | null = null;

afterEach(() => {
  appRef?.destroy();
  appRef = null;
  hostEl?.remove();
  hostEl = null;
});

describe("SimpleTable (Angular) — tableProps input", () => {
  it("applies paging and loading from the tableProps bag", async () => {
    hostEl = document.createElement("st-table-props-host");
    document.body.appendChild(hostEl);

    appRef = await bootstrapApplication(TablePropsHost, {
      providers: [provideZoneChangeDetection(), provideSimpleTable()],
    });
    const hostRef = appRef.components[0] as ComponentRef<TablePropsHost>;

    await waitFor(() => hostEl?.textContent?.includes("Alice") ?? false, 3000, "Alice");
    expect(hostEl?.textContent).toContain("Bob");

    hostRef.instance.tableProps = {
      ...hostRef.instance.tableProps,
      isLoading: true,
    };
    hostRef.changeDetectorRef.detectChanges();
    appRef.tick();
    await wait(150);

    expect(hostEl?.textContent).not.toContain("Alice");
    expect(hostEl?.textContent).not.toContain("Bob");
    expect(hostEl?.querySelectorAll(".st-loading-skeleton").length).toBeGreaterThan(0);
  });
});
