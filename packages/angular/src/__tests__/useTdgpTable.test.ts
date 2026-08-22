import { wait, waitFor } from "./testUtils";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ApplicationRef,
  Component,
  InjectionToken,
  inject,
  provideZoneChangeDetection,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { SimpleTableComponent } from "../lib/SimpleTableComponent";
import { provideSimpleTable } from "../lib/provideSimpleTable";
import { useTdgpTable } from "../tdgp/useTdgpTable";
import type { TdgpQueryClient } from "simple-table-core";
import type { AngularColumnDef } from "../types";

const TDGP_CLIENT = new InjectionToken<TdgpQueryClient>("tdgp-client");

const columns: AngularColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

@Component({
  standalone: true,
  imports: [SimpleTableComponent],
  selector: "st-tdgp-test-host",
  template: `
    <simple-table
      [columns]="tdgp.columns()"
      [rows]="tdgp.rows()"
      [tableProps]="tdgp.tableProps()"
      height="250px"
      theme="light"
    />
  `,
})
class TdgpTestHost {
  private readonly client = inject(TDGP_CLIENT);
  readonly tdgp = useTdgpTable(() => ({
    client: this.client,
    dataset: "developers-10k",
    columns,
    pageSize: 10,
    primaryKey: "id",
  }));
}

let appRef: ApplicationRef | null = null;
let hostEl: HTMLElement | null = null;

afterEach(() => {
  appRef?.destroy();
  appRef = null;
  hostEl?.remove();
  hostEl = null;
  vi.restoreAllMocks();
});

describe("useTdgpTable (Angular)", () => {
  it("loads the first page and binds tableProps in one input", async () => {
    const query = vi.fn(async (_dataset: string) => ({
      protocol: "tdgp/1",
      data: [{ id: 1, name: "Ada" }],
      totalCount: 1,
    }));

    hostEl = document.createElement("st-tdgp-test-host");
    document.body.appendChild(hostEl);

    appRef = await bootstrapApplication(TdgpTestHost, {
      providers: [
        provideZoneChangeDetection(),
        provideSimpleTable(),
        { provide: TDGP_CLIENT, useValue: { query } },
      ],
    });

    await waitFor(() => query.mock.calls.length === 1, 3000, "query");
    await wait(80);
    await waitFor(() => hostEl?.textContent?.includes("Ada") ?? false, 3000, "Ada");
    expect(query.mock.calls[0]?.[0]).toBe("developers-10k");
  });
});
