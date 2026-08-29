import { Component } from "@angular/core";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableImports } from "../../index";
import type { AngularColumnDef } from "../../index";
import { mountConsumer, waitFor, waitForText, type MountedConsumer } from "../testUtils";

type Person = { id: number; name: string };

@Component({
  standalone: true,
  selector: "st-consumer-dom-slot-page",
  imports: [SimpleTableImports],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      initialSortColumn="name"
      initialSortDirection="asc"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    >
      <ng-template stHeader="name" let-components="components">
        <span class="st-consumer-head">People</span>
        <span class="st-consumer-sort" [stDomSlot]="components.sortIcon"></span>
      </ng-template>
    </simple-table>
  `,
})
class DomSlotPage {
  rows: Person[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  columns: AngularColumnDef<Person>[] = [
    { accessor: "name", label: "Name", width: 120, type: "string", sortable: true },
  ];
  getRowId = ({ row }: { row: Person }) => String(row.id);
}

let mounted: MountedConsumer<unknown> | null = null;

afterEach(() => {
  mounted?.destroy();
  mounted = null;
});

describe("Angular consumer stDomSlot", () => {
  it("places the built-in sort icon in an stHeader template", async () => {
    mounted = await mountConsumer(DomSlotPage);
    await waitForText(mounted.el, "People");
    await waitFor(
      () =>
        Boolean(
          mounted!.el.querySelector(".st-consumer-sort [aria-label*='Sort'], .st-consumer-sort .st-icon-container"),
        ),
      3000,
      "sort icon in stDomSlot",
    );
    const slot = mounted.el.querySelector(".st-consumer-sort");
    expect(slot?.querySelector("[aria-label*='Sort'], .st-icon-container")).not.toBeNull();
  });
});
