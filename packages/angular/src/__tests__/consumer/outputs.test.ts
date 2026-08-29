import { Component } from "@angular/core";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableImports } from "../../index";
import type {
  AngularColumnDef,
  CellChangeProps,
  RowSelectionChangeProps,
  SortColumn,
} from "../../index";
import {
  mountConsumer,
  wait,
  waitForElement,
  waitForText,
  type MountedConsumer,
} from "../testUtils";

type Person = { id: number; name: string };

const columns: AngularColumnDef<Person>[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  {
    accessor: "name",
    label: "Name",
    width: 120,
    type: "string",
    sortable: true,
    editable: true,
  },
];

function makeRows(): Person[] {
  return [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
}

let mounted: MountedConsumer<unknown> | null = null;

afterEach(() => {
  mounted?.destroy();
  mounted = null;
});

@Component({
  standalone: true,
  selector: "st-consumer-output-page",
  imports: [SimpleTableImports],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      [enableRowSelection]="true"
      [selectRowOnClick]="true"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
      (sortChange)="onSort($event)"
      (rowSelectionChange)="onSelect($event)"
      (cellEdit)="onEdit($event)"
    ></simple-table>
  `,
})
class OutputPage {
  rows = makeRows();
  columns = columns;
  getRowId = ({ row }: { row: Person }) => String(row.id);
  sorts: Array<SortColumn | null> = [];
  selections: RowSelectionChangeProps<Person>[] = [];
  edits: CellChangeProps<Person>[] = [];

  onSort(sort: SortColumn | null): void {
    this.sorts.push(sort);
  }

  onSelect(event: RowSelectionChangeProps<Person>): void {
    this.selections.push(event);
  }

  onEdit(event: CellChangeProps<Person>): void {
    this.edits.push(event);
  }
}

@Component({
  standalone: true,
  selector: "st-consumer-both-page",
  imports: [SimpleTableImports],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
      [onSortChange]="onSortInput"
      (sortChange)="onSortOutput($event)"
    ></simple-table>
  `,
})
class BothBindingsPage {
  rows = makeRows();
  columns = columns;
  getRowId = ({ row }: { row: Person }) => String(row.id);
  inputCalls = 0;
  outputCalls = 0;

  onSortInput = (): void => {
    this.inputCalls += 1;
  };

  onSortOutput(_sort: SortColumn | null): void {
    this.outputCalls += 1;
  }
}

@Component({
  standalone: true,
  selector: "st-consumer-output-label-page",
  imports: [SimpleTableImports],
  template: `
    <p>Picked: {{ picked }}</p>
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      [enableRowSelection]="true"
      [selectRowOnClick]="true"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
      (rowSelectionChange)="onSelect($event)"
    ></simple-table>
  `,
})
class OutputLabelPage {
  rows = makeRows();
  columns = columns;
  getRowId = ({ row }: { row: Person }) => String(row.id);
  picked = "none";

  onSelect(event: RowSelectionChangeProps<Person>): void {
    this.picked = event.row.name;
  }
}

function findNameHeader(scope: HTMLElement): HTMLElement {
  const labels = Array.from(scope.querySelectorAll<HTMLElement>(".st-header-label"));
  const label = labels.find((el) => el.textContent?.includes("Name"));
  if (!label) throw new Error("Name header not found");
  return label;
}

describe("Angular consumer outputs", () => {
  it("updates the page from (sortChange), (rowSelectionChange), and (cellEdit)", async () => {
    mounted = await mountConsumer(OutputPage);
    const page = mounted.instance as OutputPage;
    await waitForElement(mounted.el, ".st-header-label");

    findNameHeader(mounted.el).dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(50);
    expect(page.sorts.length).toBeGreaterThan(0);

    const cell = await waitForElement(mounted.el, '.st-cell[data-accessor="name"]');
    cell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(50);
    expect(page.selections.length).toBeGreaterThan(0);

    cell.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    const input = (await waitForElement(mounted.el, ".editable-cell-input")) as HTMLInputElement;
    input.value = "Ada";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.blur();
    input.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    await wait(50);
    expect(page.edits.length).toBeGreaterThan(0);
    expect(page.edits[0]?.newValue).toBe("Ada");
  });

  it("refreshes page template text from (rowSelectionChange)", async () => {
    mounted = await mountConsumer(OutputLabelPage);
    await waitForText(mounted.el, "Picked: none");
    const cell = await waitForElement(mounted.el, '.st-cell[data-accessor="name"]');
    cell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitForText(mounted.el, "Picked: Alice");
  });

  it("runs both [onSortChange] and (sortChange) when both are bound", async () => {
    mounted = await mountConsumer(BothBindingsPage);
    const page = mounted.instance as BothBindingsPage;
    await waitForText(mounted.el, "Alice");
    findNameHeader(mounted.el).dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(50);
    expect(page.inputCalls).toBe(1);
    expect(page.outputCalls).toBe(1);
  });
});
