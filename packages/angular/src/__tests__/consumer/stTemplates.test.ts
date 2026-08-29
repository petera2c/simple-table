import { Component } from "@angular/core";
import { afterEach, describe, expect, it } from "vitest";
import { SimpleTableComponent, SimpleTableImports } from "../../index";
import type { AngularColumnDef, OnRowGroupExpandProps } from "../../index";
import {
  mountConsumer,
  wait,
  waitFor,
  waitForText,
  type MountedConsumer,
} from "../testUtils";

type Person = { id: number; name: string; status: string };

const people: Person[] = [
  { id: 1, name: "Alice", status: "active" },
  { id: 2, name: "Bob", status: "pending" },
];

const columns: AngularColumnDef<Person>[] = [
  { accessor: "name", label: "Name", width: 120, type: "string" },
  { accessor: "status", label: "Status", width: 120, type: "string" },
];

const getRowId = ({ row }: { row: Person }) => String(row.id);

function findExpandIcon(scope: HTMLElement): HTMLElement {
  const icons = Array.from(
    scope.querySelectorAll<HTMLElement>("[data-row-id] .st-expand-icon-container, .st-cell .st-expand-icon-container"),
  );
  const icon = icons.find((el) => el.getAttribute("aria-hidden") !== "true");
  if (!icon) throw new Error("Expand icon not found");
  return icon;
}

let mounted: MountedConsumer<unknown> | null = null;

afterEach(() => {
  mounted?.destroy();
  mounted = null;
});

@Component({
  standalone: true,
  selector: "st-consumer-cell-page",
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
      <ng-template stCell="status" let-row let-value="value">
        <span class="badge">{{ value }}</span>
        <button type="button" class="st-status-click" (click)="onBadgeClick(row)">ping</button>
      </ng-template>
    </simple-table>
  `,
})
class CellPage {
  rows = people;
  columns = columns;
  getRowId = getRowId;
  clicked: string[] = [];

  onBadgeClick(row: Person): void {
    this.clicked.push(row.name);
  }
}

@Component({
  standalone: true,
  selector: "st-consumer-unknown-page",
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
      <ng-template stCell="nope" let-value="value">
        <span class="should-not-show">{{ value }}</span>
      </ng-template>
    </simple-table>
  `,
})
class UnknownAccessorPage {
  rows = people;
  columns = columns;
  getRowId = getRowId;
}

@Component({
  standalone: true,
  selector: "st-consumer-override-page",
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
      <ng-template stCell="status">
        <span class="from-template">FROM_TEMPLATE</span>
      </ng-template>
    </simple-table>
  `,
})
class OverridePage {
  rows = people;
  columns: AngularColumnDef<Person>[] = [
    { accessor: "name", label: "Name", width: 120, type: "string" },
    {
      accessor: "status",
      label: "Status",
      width: 120,
      type: "string",
      cellRenderer: () => "FROM_COLUMN",
    },
  ];
  getRowId = getRowId;
}

@Component({
  standalone: true,
  selector: "st-consumer-column-only-page",
  imports: [SimpleTableImports],
  template: `
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
class ColumnRendererOnlyPage {
  rows = people;
  columns: AngularColumnDef<Person>[] = [
    { accessor: "name", label: "Name", width: 120, type: "string" },
    {
      accessor: "status",
      label: "Status",
      width: 120,
      type: "string",
      cellRenderer: () => "FROM_COLUMN",
    },
  ];
  getRowId = getRowId;
}

@Component({
  standalone: true,
  selector: "st-consumer-empty-page",
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
      <ng-template stEmpty>
        No people yet.
        <button type="button" class="st-empty-add" (click)="add()">Add</button>
      </ng-template>
    </simple-table>
  `,
})
class EmptyPage {
  rows: Person[] = [];
  columns = columns;
  getRowId = getRowId;

  add(): void {
    this.rows = [{ id: 1, name: "Ada", status: "active" }];
  }
}

@Component({
  standalone: true,
  selector: "st-consumer-footer-page",
  imports: [SimpleTableImports],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      [enablePagination]="true"
      [rowsPerPage]="1"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    >
      <ng-template stFooter let-currentPage="currentPage" let-onNextPage="onNextPage">
        <div class="st-consumer-footer">
          page {{ currentPage }}
          <button type="button" class="st-footer-next" (click)="onNextPage()">Next</button>
        </div>
      </ng-template>
    </simple-table>
  `,
})
class FooterPage {
  rows = people;
  columns = columns;
  getRowId = getRowId;
}

@Component({
  standalone: true,
  selector: "st-consumer-header-page",
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
      <ng-template stHeader="name">
        <span class="st-consumer-head">People</span>
      </ng-template>
    </simple-table>
  `,
})
class HeaderPage {
  rows = people;
  columns = columns;
  getRowId = getRowId;
}

@Component({
  standalone: true,
  selector: "st-consumer-isolate-page",
  imports: [SimpleTableImports],
  template: `
    <simple-table
      class="first-grid"
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    >
      <ng-template stCell="status" let-value="value">
        <span class="badge">{{ value }}</span>
      </ng-template>
    </simple-table>
    <simple-table
      class="second-grid"
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    ></simple-table>
  `,
})
class IsolatePage {
  rows = people;
  columns = columns;
  getRowId = getRowId;
}

@Component({
  standalone: true,
  selector: "st-consumer-component-only-page",
  imports: [SimpleTableComponent],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    >
      <ng-template stCell="status" let-value="value">
        <span class="badge">{{ value }}</span>
      </ng-template>
    </simple-table>
  `,
})
class ComponentOnlyPage {
  rows = people;
  columns = columns;
  getRowId = getRowId;
}

type DeptRow = { id: string; name: string; budget: number; teams?: { id: string; name: string }[] };

@Component({
  standalone: true,
  selector: "st-consumer-loading-page",
  imports: [SimpleTableImports],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      [rowGrouping]="rowGrouping"
      [onRowGroupExpand]="onExpand"
      [expandAll]="false"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    >
      <ng-template stLoading>
        <span class="st-consumer-loading">Loading teams…</span>
      </ng-template>
    </simple-table>
  `,
})
class LoadingPage {
  rows: DeptRow[] = [{ id: "dept-1", name: "Engineering", budget: 1 }];
  columns: AngularColumnDef<DeptRow>[] = [
    { accessor: "name", label: "Name", width: 200, type: "string", expandable: true },
    { accessor: "budget", label: "Budget", width: 80, type: "number" },
  ];
  rowGrouping: Array<keyof DeptRow> = ["teams"];
  getRowId = ({ row }: { row: DeptRow }) => row.id;

  onExpand = (props: OnRowGroupExpandProps<DeptRow>): void => {
    if (props.isExpanded) props.setLoading(true);
  };
}

@Component({
  standalone: true,
  selector: "st-consumer-error-page",
  imports: [SimpleTableImports],
  template: `
    <simple-table
      [rows]="rows"
      [columns]="columns"
      [getRowId]="getRowId"
      [rowGrouping]="rowGrouping"
      [onRowGroupExpand]="onExpand"
      [expandAll]="false"
      height="250px"
      theme="light"
      [animations]="{ enabled: false }"
    >
      <ng-template stError let-error="error">
        <span class="st-consumer-error">{{ error }}</span>
      </ng-template>
    </simple-table>
  `,
})
class ErrorPage {
  rows: DeptRow[] = [{ id: "dept-1", name: "Engineering", budget: 1 }];
  columns: AngularColumnDef<DeptRow>[] = [
    { accessor: "name", label: "Name", width: 200, type: "string", expandable: true },
    { accessor: "budget", label: "Budget", width: 80, type: "number" },
  ];
  rowGrouping: Array<keyof DeptRow> = ["teams"];
  getRowId = ({ row }: { row: DeptRow }) => row.id;

  onExpand = (props: OnRowGroupExpandProps<DeptRow>): void => {
    if (props.isExpanded) props.setError("Could not load teams");
  };
}

describe("Angular consumer templates", () => {
  it("renders stCell per row and runs the page click handler", async () => {
    mounted = await mountConsumer(CellPage);
    await waitForText(mounted.el, "active");
    const badges = mounted.el.querySelectorAll(".badge");
    expect(Array.from(badges).map((el) => el.textContent?.trim())).toEqual(["active", "pending"]);

    mounted.el.querySelector<HTMLButtonElement>(".st-status-click")!.click();
    await wait(20);
    expect((mounted.instance as CellPage).clicked).toEqual(["Alice"]);
  });

  it("ignores stCell for an unknown accessor", async () => {
    mounted = await mountConsumer(UnknownAccessorPage);
    await waitForText(mounted.el, "Alice");
    expect(mounted.el.querySelector(".should-not-show")).toBeNull();
    expect(mounted.el.textContent).toContain("active");
  });

  it("uses column.cellRenderer when no stCell exists", async () => {
    mounted = await mountConsumer(ColumnRendererOnlyPage);
    await waitForText(mounted.el, "FROM_COLUMN");
  });

  it("lets stCell override column.cellRenderer", async () => {
    mounted = await mountConsumer(OverridePage);
    await waitForText(mounted.el, "FROM_TEMPLATE");
    expect(mounted.el.textContent).not.toContain("FROM_COLUMN");
  });

  it("shows a live stEmpty template whose Add button updates the page", async () => {
    mounted = await mountConsumer(EmptyPage);
    await waitForText(mounted.el, "No people yet.");
    mounted.el.querySelector<HTMLButtonElement>(".st-empty-add")!.click();
    await waitForText(mounted.el, "Ada");
    expect(mounted.el.textContent).not.toContain("No people yet.");
  });

  it("lets stFooter call paging from template context", async () => {
    mounted = await mountConsumer(FooterPage);
    await waitForText(mounted.el, "page 1");
    mounted.el.querySelector<HTMLButtonElement>(".st-footer-next")!.click();
    await waitForText(mounted.el, "page 2");
  });

  it("replaces the header label with stHeader", async () => {
    mounted = await mountConsumer(HeaderPage);
    await waitForText(mounted.el, "People");
    expect(mounted.el.querySelector(".st-consumer-head")?.textContent).toBe("People");
  });

  it("does not apply parent stCell templates to a sibling table", async () => {
    mounted = await mountConsumer(IsolatePage);
    await waitFor(() => mounted!.el.querySelectorAll("simple-table").length === 2);
    await waitFor(() => Boolean(mounted!.el.querySelector(".badge")));
    const tables = mounted.el.querySelectorAll("simple-table");
    expect(tables[0].querySelector(".badge")?.textContent?.trim()).toBe("active");
    expect(tables[1].querySelector(".badge")).toBeNull();
    expect(tables[1].textContent).toContain("active");
  });

  it("does not activate stCell when the page only imports SimpleTableComponent", async () => {
    mounted = await mountConsumer(ComponentOnlyPage);
    await waitForText(mounted.el, "Alice");
    expect(mounted.el.querySelector(".badge")).toBeNull();
    expect(mounted.el.textContent).toContain("active");
  });

  it("shows stLoading when a grouped row is expanded", async () => {
    mounted = await mountConsumer(LoadingPage);
    await waitFor(() => {
      try {
        findExpandIcon(mounted!.el);
        return true;
      } catch {
        return false;
      }
    });
    findExpandIcon(mounted.el).dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitForText(mounted.el, "Loading teams…");
  });

  it("shows stError when a grouped row expand reports an error", async () => {
    mounted = await mountConsumer(ErrorPage);
    await waitFor(() => {
      try {
        findExpandIcon(mounted!.el);
        return true;
      } catch {
        return false;
      }
    });
    findExpandIcon(mounted.el).dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await waitForText(mounted.el, "Could not load teams");
  });
});
