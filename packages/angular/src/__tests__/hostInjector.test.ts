import "zone.js";
import "@angular/compiler";
import {
  Component,
  InjectionToken,
  inject,
  provideZoneChangeDetection,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableComponent, provideSimpleTable } from "../index";
import type { AngularColumnDef } from "../index";
import { waitFor } from "./testUtils";

/**
 * Custom cells must see services provided on ancestors of `<simple-table>`,
 * not only root / environment providers. Mirrors the React host-context tests.
 */

const HOST_LABEL = new InjectionToken<string>("st-test-host-label");

@Component({
  standalone: true,
  selector: "st-test-ctx-cell",
  template: `<span class="ctx-cell">{{ label }}</span>`,
})
class CtxCellComponent {
  readonly label = inject(HOST_LABEL, { optional: true }) ?? "DEFAULT_NO_PROVIDER";
}

@Component({
  standalone: true,
  selector: "st-injector-test-host",
  imports: [SimpleTableComponent],
  providers: [{ provide: HOST_LABEL, useValue: "FROM_HOST" }],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      height="250px"
      theme="light"
    />
  `,
})
class InjectorTestHost {
  rows = [{ id: 1, name: "Alice" }];
  columns: AngularColumnDef[] = [
    {
      accessor: "name",
      label: "Name",
      width: 120,
      type: "string",
      cellRenderer: CtxCellComponent,
    },
  ];
  getRowId = (p: { row: { id: number } }) => String(p.row.id);
}

describe("SimpleTable (Angular adapter) — parent providers reach custom cells", () => {
  let destroy: (() => void) | null = null;

  afterEach(() => {
    destroy?.();
    destroy = null;
  });

  it("lets a cellRenderer inject a token provided on the parent component", async () => {
    const el = document.createElement("st-injector-test-host");
    document.body.appendChild(el);
    const appRef = await bootstrapApplication(InjectorTestHost, {
      providers: [provideZoneChangeDetection(), provideSimpleTable()],
    });
    destroy = () => {
      appRef.destroy();
      el.remove();
    };

    await waitFor(() => el.querySelector(".ctx-cell") !== null, 3000, "custom cell");
    expect(el.querySelector(".ctx-cell")?.textContent).toBe("FROM_HOST");
    expect(el.textContent).not.toContain("DEFAULT_NO_PROVIDER");
  });
});
