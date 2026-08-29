import { Component, reflectComponentType } from "@angular/core";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableComponent, SimpleTableImports } from "../../index";
import type { AngularColumnDef } from "../../index";
import {
  mountConsumer,
  waitForText,
  type MountedConsumer,
} from "../testUtils";

type Person = { id: number; name: string };

@Component({
  standalone: true,
  selector: "st-consumer-onpush-page",
  imports: [SimpleTableImports],
  template: `
    <button type="button" class="st-add-row" (click)="add()">Add</button>
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    ></simple-table>
  `,
})
class OnPushPage {
  rows: Person[] = [{ id: 1, name: "Alice" }];
  columns: AngularColumnDef<Person>[] = [
    { accessor: "name", label: "Name", width: 120, type: "string" },
  ];
  getRowId = ({ row }: { row: Person }) => String(row.id);

  add(): void {
    this.rows = [...this.rows, { id: 2, name: "Ada" }];
  }
}

@Component({
  standalone: true,
  selector: "st-consumer-no-provider-page",
  imports: [SimpleTableImports],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    >
      <ng-template stCell="name" let-row>
        <span class="from-page">{{ row.name }}</span>
      </ng-template>
    </simple-table>
  `,
})
class NoProviderPage {
  rows: Person[] = [{ id: 1, name: "Alice" }];
  columns: AngularColumnDef<Person>[] = [
    { accessor: "name", label: "Name", width: 120, type: "string" },
  ];
  getRowId = ({ row }: { row: Person }) => String(row.id);
}

@Component({
  standalone: true,
  selector: "st-consumer-host-class-page",
  imports: [SimpleTableImports],
  template: `
    <simple-table
      class="host-wrap"
      [className]="'inner-grid'"
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    ></simple-table>
  `,
})
class HostClassPage {
  rows: Person[] = [{ id: 1, name: "Alice" }];
  columns: AngularColumnDef<Person>[] = [
    { accessor: "name", label: "Name", width: 120, type: "string" },
  ];
  getRowId = ({ row }: { row: Person }) => String(row.id);
}

let mounted: MountedConsumer<unknown> | null = null;

afterEach(() => {
  mounted?.destroy();
  mounted = null;
});

describe("Angular consumer polish", () => {
  it("refreshes when the page replaces rows (OnPush table)", async () => {
    mounted = await mountConsumer(OnPushPage);
    await waitForText(mounted.el, "Alice");
    mounted.el.querySelector<HTMLButtonElement>(".st-add-row")!.click();
    await waitForText(mounted.el, "Ada");
  });

  it("works without provideSimpleTable()", async () => {
    mounted = await mountConsumer(NoProviderPage);
    await waitForText(mounted.el, "Alice");
    expect(mounted.el.querySelector(".from-page")?.textContent).toBe("Alice");
  });

  it("keeps host class on the wrapper and className on the inner grid", async () => {
    mounted = await mountConsumer(HostClassPage);
    await waitForText(mounted.el, "Alice");
    const host = mounted.el.querySelector("simple-table");
    expect(host?.classList.contains("host-wrap")).toBe(true);
    const root = mounted.el.querySelector(".simple-table-root");
    expect(root?.className).toContain("inner-grid");
    expect(root?.classList.contains("host-wrap")).toBe(false);
  });

  it("declares native outputs next to the existing on* inputs", () => {
    const mirror = reflectComponentType(SimpleTableComponent);
    const outputs = new Set((mirror?.outputs ?? []).map((output) => output.propName));
    expect(outputs.has("tableReady")).toBe(true);
    expect(outputs.has("sortChange")).toBe(true);
    expect(outputs.has("rowSelectionChange")).toBe(true);
    expect(outputs.has("cellEdit")).toBe(true);
  });
});
