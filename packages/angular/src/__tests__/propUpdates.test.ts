import { afterEach, describe, expect, it } from "vitest";
import type { AngularColumnDef } from "../index";
import { mountAngularTable, waitFor, type MountedTestTable } from "./testUtils";

/**
 * Post-mount row/column updates must reach the vanilla table via ngOnChanges
 * → instance.update(). Mirrors packages/vue/src/__tests__/propUpdates.test.ts.
 */

type Row = { name: string };

const columns: AngularColumnDef<Row>[] = [
  { accessor: "name", label: "Name", width: 120, type: "string" },
];

let mounted: MountedTestTable<Row> | null = null;

afterEach(() => {
  mounted?.destroy();
  mounted = null;
});

function cellTexts(scope: HTMLElement, accessor: string): string[] {
  return Array.from(
    scope.querySelectorAll<HTMLElement>(
      `.st-body-container .st-cell[data-accessor="${accessor}"]`,
    ),
    (el) => el.textContent?.trim() ?? "",
  );
}

describe("SimpleTable (Angular adapter) — prop updates after mount", () => {
  it("re-renders when rows change after mount", async () => {
    mounted = await mountAngularTable<Row>({
      columns,
      rows: [{ name: "A" }],
      getRowId: ({ row }) => row.name,
    });

    await waitFor(
      () => cellTexts(mounted!.el, "name").includes("A"),
      3000,
      "initial row A",
    );
    expect(cellTexts(mounted.el, "name")).toEqual(["A"]);

    mounted.setState({
      rows: [{ name: "A" }, { name: "B" }, { name: "C" }],
    });
    await waitFor(
      () => cellTexts(mounted!.el, "name").length === 3,
      3000,
      "updated rows A, B, C",
    );

    expect(cellTexts(mounted.el, "name")).toEqual(["A", "B", "C"]);
  });
});
