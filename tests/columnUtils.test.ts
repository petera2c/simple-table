/* eslint-disable */
/**
 * Unit tests for `flattenColumnsForGrid` - the shared leaf-flattening helper that is
 * the single source of truth for column order. Column virtualization relies on this
 * producing the exact same order as the CSS grid tracks, so the n-th leaf header maps
 * to the n-th grid track.
 */
import { flattenColumnsForGrid } from "../src/utils/columnUtils";
import HeaderObject from "../src/types/HeaderObject";

declare const describe: (name: string, fn: () => void) => void;
declare const test: (name: string, fn: () => void) => void;
declare const expect: (actual: unknown) => any;

const col = (
  accessor: string,
  extra: Partial<HeaderObject> = {},
): HeaderObject => ({ accessor, label: accessor, width: 100, ...extra }) as HeaderObject;

const accessorsOf = (headers: HeaderObject[]): string[] =>
  headers.map((h) => String(h.accessor));

describe("flattenColumnsForGrid", () => {
  test("returns flat leaf headers unchanged", () => {
    const headers = [col("a"), col("b"), col("c")];
    expect(accessorsOf(flattenColumnsForGrid({ headers }))).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  test("excludes hidden and render-excluded headers", () => {
    const headers = [
      col("a"),
      col("b", { hide: true }),
      col("c", { excludeFromRender: true }),
      col("d"),
    ];
    expect(accessorsOf(flattenColumnsForGrid({ headers }))).toEqual(["a", "d"]);
  });

  test("flattens nested children and omits the parent group header", () => {
    const headers = [
      col("group", { children: [col("a"), col("b")] }),
      col("c"),
    ];
    expect(accessorsOf(flattenColumnsForGrid({ headers }))).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  test("includes the parent as its own track when singleRowChildren is set", () => {
    const headers = [
      col("group", { singleRowChildren: true, children: [col("a"), col("b")] }),
    ];
    expect(accessorsOf(flattenColumnsForGrid({ headers }))).toEqual([
      "group",
      "a",
      "b",
    ]);
  });

  test("uses the parent header track when a collapsed group has no parentCollapsed children", () => {
    const headers = [
      col("group", { children: [col("a"), col("b")] }),
    ];
    const collapsedHeaders = new Set(["group"]);
    expect(
      accessorsOf(flattenColumnsForGrid({ headers, collapsedHeaders })),
    ).toEqual(["group"]);
  });

  test("shows parentCollapsed children when the group is collapsed", () => {
    const headers = [
      col("group", {
        children: [
          col("a", { showWhen: "parentExpanded" }),
          col("b", { showWhen: "parentCollapsed" }),
          col("c", { showWhen: "always" }),
        ],
      }),
    ];
    const collapsedHeaders = new Set(["group"]);
    expect(
      accessorsOf(flattenColumnsForGrid({ headers, collapsedHeaders })),
    ).toEqual(["b", "c"]);
  });
});
