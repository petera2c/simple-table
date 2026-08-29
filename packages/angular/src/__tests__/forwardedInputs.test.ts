import { Component, reflectComponentType } from "@angular/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SimpleTableComponent } from "../index";
import type { AngularColumnDef } from "../index";
import {
  mountAngularTable,
  wait,
  waitFor,
  waitForElement,
  type MountedTestTable,
} from "./testUtils";

/**
 * Guard the Angular input whitelist: core options must be declared as `@Input`s
 * and forwarded through getProps(), or template bindings are silently ignored.
 */

const columns: AngularColumnDef[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

const rows = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

let mounted: MountedTestTable | null = null;

afterEach(() => {
  mounted?.destroy();
  mounted = null;
});

@Component({
  standalone: true,
  selector: "st-test-empty-state",
  template: `<div class="st-test-empty">Nothing here</div>`,
})
class EmptyStateComponent {}

/** Every SimpleTableProps key that consumers bind on `<simple-table>`. */
const EXPECTED_INPUTS = [
  "animations",
  "autoExpandColumns",
  "canExpandRowGroup",
  "cellUpdateFlash",
  "className",
  "columnBorders",
  "columnEditorConfig",
  "columnReordering",
  "columnResizing",
  "columns",
  "copyHeadersToClipboard",
  "customTheme",
  "enableColumnEditor",
  "enableColumnEditorInitOpen",
  "enablePivotPanel",
  "emptyStateRenderer",
  "enableHeaderEditing",
  "enablePagination",
  "enableRowSelection",
  "rowSelectionMode",
  "selectRowOnClick",
  "showRowSelectionColumn",
  "enableStickyParents",
  "enableVirtualization",
  "errorStateRenderer",
  "expandAll",
  "externalFilterHandling",
  "externalSortHandling",
  "footerRenderer",
  "footerRenderKey",
  "footerPosition",
  "headerDropdown",
  "height",
  "hideFooter",
  "hideHeader",
  "hoverRowBackground",
  "icons",
  "includeHeadersInCSVExport",
  "initialSortColumn",
  "initialSortDirection",
  "isLoading",
  "loadingStateRenderer",
  "maxHeight",
  "oddColumnBackground",
  "oddEvenRowBackground",
  "onCellClick",
  "onCellEdit",
  "onColumnOrderChange",
  "onColumnSelect",
  "onColumnVisibilityChange",
  "onColumnWidthChange",
  "onFilterChange",
  "onTableReady",
  "onHeaderEdit",
  "infiniteScrollThreshold",
  "onLoadMore",
  "onNextPage",
  "onPageChange",
  "onRowGroupExpand",
  "onRowSelectionChange",
  "onSortChange",
  "pivot",
  "onPivotChange",
  "quickFilter",
  "rowButtons",
  "rowGrouping",
  "getRowId",
  "getRowClass",
  "rows",
  "rowsPerPage",
  "scrollParent",
  "selectableCells",
  "selectableColumns",
  "serverSidePagination",
  "tableEmptyStateRenderer",
  "theme",
  "totalRowCount",
] as const;

describe("SimpleTable (Angular adapter) — core props reach the table", () => {
  it("declares an @Input for every core table option", () => {
    const mirror = reflectComponentType(SimpleTableComponent);
    expect(mirror).not.toBeNull();
    const names = new Set((mirror?.inputs ?? []).map((input) => input.propName));
    const missing = EXPECTED_INPUTS.filter((name) => !names.has(name));
    expect(missing).toEqual([]);
  });

  it("applies hideHeader and className from template bindings", async () => {
    mounted = await mountAngularTable({
      columns,
      rows,
      hideHeader: true,
      className: "st-test-root-class",
    });

    await waitFor(
      () => {
        const header = mounted!.el.querySelector<HTMLElement>(".st-header-container");
        const root = mounted!.el.querySelector(".simple-table-root");
        return header?.style.display === "none" && Boolean(root?.className.includes("st-test-root-class"));
      },
      3000,
      "hidden header and root class",
    );

    expect(mounted.el.querySelector<HTMLElement>(".st-header-container")?.style.display).toBe(
      "none",
    );
    expect(mounted.el.querySelector(".simple-table-root")?.className).toContain(
      "st-test-root-class",
    );
  });

  it("invokes onColumnSelect when a header is clicked", async () => {
    const onColumnSelect = vi.fn();
    mounted = await mountAngularTable({
      columns,
      rows,
      selectableColumns: true,
      onColumnSelect,
    });

    const label = await waitForElement(mounted.el, ".st-header-label");
    label.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(50);

    expect(onColumnSelect).toHaveBeenCalled();
  });

  it("selects a row when selectRowOnClick is true", async () => {
    mounted = await mountAngularTable({
      columns,
      rows,
      enableRowSelection: true,
      selectRowOnClick: true,
    });

    const cell = await waitForElement(mounted.el, '.st-cell[data-accessor="name"]');
    cell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wait(50);

    expect(mounted.host.api?.getSelectedRows().size).toBeGreaterThan(0);
  });

  it("renders a component class as tableEmptyStateRenderer", async () => {
    mounted = await mountAngularTable({
      columns,
      rows: [],
      tableEmptyStateRenderer: EmptyStateComponent,
    });

    await waitFor(
      () => Boolean(mounted!.el.querySelector(".st-test-empty")),
      3000,
      "empty state component",
    );
    expect(mounted.el.querySelector(".st-test-empty")?.textContent).toContain("Nothing here");
  });
});
