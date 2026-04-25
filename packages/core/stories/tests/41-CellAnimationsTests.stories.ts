/**
 * CELL ANIMATIONS TESTS
 *
 * Covers FLIP-style animations on:
 *   - Programmatic column reorder via the API (cells shift `left`).
 *   - Sort change (rows shift `top`) when `getRowId` is provided so cell
 *     identity is row-stable.
 *
 * Cells that newly enter the visible band slide in from their actual pre-
 * change off-screen position; cells that leave the visible band slide out
 * to their actual post-change off-screen position. The body container's
 * overflow clip turns those long off-screen translates into "appears to
 * slide in from the viewport edge" visually.
 *
 * Animations default to `true`. Live drag reorder is intentionally not
 * animated (we don't want to fight the user's pointer mid-drag).
 */

import { HeaderObject, Row, SimpleTableVanilla } from "../../src/index";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { renderVanillaTable, addParagraph, addControlPanel } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/41 - Cell Animations",
  tags: ["animations"],
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "FLIP-style animations on programmatic column reorder and sort. Opt-in via the `animations` prop. Honors `prefers-reduced-motion`.",
      },
    },
  },
};

export default meta;

type TableInstance = InstanceType<typeof SimpleTableVanilla>;
const TABLE_REF_KEY = "__storybook_animations_table_ref";

const setTable = (table: TableInstance): void => {
  (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = table;
};
const getTable = (): TableInstance => {
  const t = (globalThis as unknown as Record<string, TableInstance | undefined>)[TABLE_REF_KEY];
  if (!t) throw new Error("Table ref not set (run render first)");
  return t;
};

interface AnimRow {
  id: number;
  name: string;
  age: number;
  revenue: number;
  city: string;
}

const createData = (): AnimRow[] => [
  { id: 1, name: "Charlie", age: 35, revenue: 50000, city: "Boston" },
  { id: 2, name: "Alice", age: 28, revenue: 75000, city: "Austin" },
  { id: 3, name: "Bob", age: 42, revenue: 60000, city: "Brooklyn" },
  { id: 4, name: "Diana", age: 31, revenue: 90000, city: "Denver" },
  { id: 5, name: "Eve", age: 25, revenue: 45000, city: "Eugene" },
  { id: 6, name: "Frank", age: 38, revenue: 82000, city: "Fresno" },
  { id: 7, name: "Grace", age: 29, revenue: 68000, city: "Greenville" },
  { id: 8, name: "Henry", age: 45, revenue: 95000, city: "Houston" },
];

const createHeaders = (): HeaderObject[] => [
  { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
  { accessor: "name", label: "Name", width: 160, isSortable: true },
  { accessor: "age", label: "Age", width: 100, isSortable: true, type: "number" },
  { accessor: "revenue", label: "Revenue", width: 150, isSortable: true, type: "number" },
  { accessor: "city", label: "City", width: 160, isSortable: true },
];

const findCellByRowAndAccessor = (
  canvasElement: HTMLElement,
  rowIndex: number,
  accessor: string,
): HTMLElement | null => {
  return canvasElement.querySelector(
    `.st-body-main [data-row-index="${rowIndex}"][data-accessor="${accessor}"]`,
  ) as HTMLElement | null;
};

/** Slow on purpose so each step is easy to follow when watching in Storybook. */
const SLOW_DURATION = 1500;
/** A pause that comfortably outlasts SLOW_DURATION so the animation finishes. */
const SETTLE_PAUSE = SLOW_DURATION + 400;
/** A short pause to let the user appreciate a new state before the next step. */
const BEAT = 600;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const tickFrames = async (count: number): Promise<void> => {
  for (let i = 0; i < count; i++) {
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
  }
};

// ============================================================================
// STORIES
// ============================================================================

export const ProgrammaticReorderAnimation = {
  render: () => {
    const originalHeaders = createHeaders();
    const result = renderVanillaTable(createHeaders(), createData() as unknown as Row[], {
      height: "400px",
      animations: true,
      animationDuration: SLOW_DURATION,
    });
    setTable(result.table);
    result.h2.textContent = `Programmatic column reorder · ${SLOW_DURATION}ms per step`;

    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Column order",
          buttons: [
            {
              label: "Reverse columns",
              onClick: () => {
                const api = result.table.getAPI();
                const reversed = [...api.getHeaders()].reverse();
                result.table.update({ defaultHeaders: reversed });
              },
            },
            {
              label: "Swap Name ↔ City",
              onClick: () => {
                const api = result.table.getAPI();
                const headers = [...api.getHeaders()];
                const a = headers.findIndex((h) => h.accessor === "name");
                const b = headers.findIndex((h) => h.accessor === "city");
                if (a !== -1 && b !== -1) {
                  [headers[a], headers[b]] = [headers[b], headers[a]];
                  result.table.update({ defaultHeaders: headers });
                }
              },
            },
            {
              label: "Reset",
              onClick: () => {
                result.table.update({ defaultHeaders: originalHeaders });
              },
            },
          ],
        },
      ],
      result.tableContainer,
    );

    addParagraph(
      result.wrapper,
      "Watch each reorder slide cells horizontally to their new positions over " +
        `${SLOW_DURATION}ms. The play function reverses, resets, swaps, then resets ` +
        "again so you can watch four FLIP runs in a row.",
      result.tableContainer,
    );

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await sleep(BEAT);
    const table = getTable();
    const api = table.getAPI();
    const original = api.getHeaders();

    // Step 1: capture initial position of "name" cell at row 0.
    const cellBefore = findCellByRowAndAccessor(canvasElement, 0, "name");
    expect(cellBefore).toBeTruthy();
    const leftBefore = parseFloat(cellBefore!.style.left || "0");

    // Step 2: reverse — assert mid-flight transition then settle.
    table.update({ defaultHeaders: [...original].reverse() });
    await tickFrames(2);

    const cellMid = findCellByRowAndAccessor(canvasElement, 0, "name");
    expect(cellMid).toBe(cellBefore);
    expect(cellMid!.style.transition).toContain("transform");
    expect(cellMid!.style.transform).toContain("translate");

    await sleep(SETTLE_PAUSE);

    const cellAfter = findCellByRowAndAccessor(canvasElement, 0, "name");
    const leftAfter = parseFloat(cellAfter!.style.left || "0");
    expect(leftAfter).not.toBe(leftBefore);
    expect(cellAfter!.style.transform === "" || cellAfter!.style.transform === "none").toBe(true);
    expect(cellAfter!.style.transition === "" || cellAfter!.style.transition === "none").toBe(true);

    // Step 3: reset back to original.
    await sleep(BEAT);
    table.update({ defaultHeaders: original });
    await tickFrames(2);
    const cellResetMid = findCellByRowAndAccessor(canvasElement, 0, "name");
    expect(cellResetMid!.style.transition).toContain("transform");
    await sleep(SETTLE_PAUSE);

    // Step 4: swap Name ↔ City — only those two columns animate.
    await sleep(BEAT);
    const swapped = [...original];
    const a = swapped.findIndex((h) => h.accessor === "name");
    const b = swapped.findIndex((h) => h.accessor === "city");
    [swapped[a], swapped[b]] = [swapped[b], swapped[a]];
    table.update({ defaultHeaders: swapped });
    await tickFrames(2);
    const animating = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(".st-body-main .st-cell"),
    ).filter((el) => el.style.transition.includes("transform"));
    expect(animating.length).toBeGreaterThan(0);
    await sleep(SETTLE_PAUSE);

    // Step 5: final reset.
    await sleep(BEAT);
    table.update({ defaultHeaders: original });
    await sleep(SETTLE_PAUSE);

    const cellFinal = findCellByRowAndAccessor(canvasElement, 0, "name");
    expect(parseFloat(cellFinal!.style.left || "0")).toBe(leftBefore);
  },
};

/**
 * Simplest possible reorder animation test: a 3 columns × 3 rows table.
 *
 * Step 1 is the straightforward case — move the center column (B) to the
 * rightmost position by swapping B and C via
 * `table.update({ defaultHeaders: [...] })`. After that animation settles,
 * the play function chains four more reorders (5 total) so we exercise:
 *
 *   - Pairwise neighbour swaps (B↔C, A↔B).
 *   - Long-distance swaps (first ↔ last column).
 *   - A "rotate back to original" reset.
 *
 * For every step we synchronously read the FLIP "First" frame and assert
 * that each cell's inverse `transform-X` exactly matches `oldLeft − newLeft`
 * (≤ 1.5px tolerance), then wait past `SLOW_DURATION` and assert no leftover
 * transforms and no retained ghosts before moving on to the next step.
 *
 * Expected FLIP behaviour for each reorder:
 *   - Cells whose `left` increases slide RIGHT, so their inverse transform-X
 *     is NEGATIVE (`oldLeft − newLeft < 0`).
 *   - Cells whose `left` decreases slide LEFT, so their inverse transform-X
 *     is POSITIVE (`oldLeft − newLeft > 0`).
 *   - Cells whose column index is unchanged have no transform.
 */
export const SimpleThreeByThreeCenterToRightSwap = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "a", label: "A", width: 120 },
      { accessor: "b", label: "B", width: 120 },
      { accessor: "c", label: "C", width: 120 },
    ];
    const rows: Row[] = [
      { id: 1, a: "A1", b: "B1", c: "C1" },
      { id: 2, a: "A2", b: "B2", c: "C2" },
      { id: 3, a: "A3", b: "B3", c: "C3" },
    ];
    const result = renderVanillaTable(headers, rows, {
      height: "240px",
      animations: true,
      animationDuration: SLOW_DURATION,
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Simplest 3×3 column swap · move center → right · ${SLOW_DURATION}ms`;

    const findByAccessor = (accessor: string): HeaderObject => {
      const h = result.table.getAPI().getHeaders().find((x) => x.accessor === accessor);
      if (!h) throw new Error(`Missing header "${accessor}"`);
      return h;
    };
    const setOrder = (accessors: string[]): void => {
      result.table.update({ defaultHeaders: accessors.map(findByAccessor) });
    };

    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Reorder steps",
          buttons: [
            { label: "1 · A · C · B (swap B ↔ C)", onClick: () => setOrder(["a", "c", "b"]) },
            { label: "2 · C · A · B (swap A ↔ C)", onClick: () => setOrder(["c", "a", "b"]) },
            { label: "3 · B · A · C (swap C ↔ B)", onClick: () => setOrder(["b", "a", "c"]) },
            { label: "4 · B · C · A (swap A ↔ C)", onClick: () => setOrder(["b", "c", "a"]) },
            { label: "5 · A · B · C (reset)", onClick: () => setOrder(["a", "b", "c"]) },
          ],
        },
      ],
      result.tableContainer,
    );

    addParagraph(
      result.wrapper,
      "Three rows, three columns. The play function runs five sequential reorders, " +
        "each waiting past the previous animation before the next begins. Watch the " +
        "cells slide horizontally to their new positions — every cell starts at its " +
        "previous on-screen pixel position rather than from a shared edge.",
      result.tableContainer,
    );

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await sleep(BEAT);

    const ROW_INDICES = [0, 1, 2];
    const ACCESSORS = ["a", "b", "c"];
    const table = getTable();

    /**
     * Capture pre-update lefts, apply the new column order, synchronously
     * read each cell's FLIP "First" frame transform, and assert it exactly
     * matches `oldLeft − newLeft`. Then wait past the slide and assert
     * everything settled cleanly. Verifies that columns whose index didn't
     * change have no transform, and that columns that swap have opposite-
     * sign transforms (one slid left, the other slid right).
     */
    const runReorderStep = async (
      stepLabel: string,
      nextAccessors: string[],
    ): Promise<void> => {
      const beforeLefts = new Map<string, number>();
      const beforeIndexByAccessor = new Map<string, number>();
      const currentHeaders = table.getAPI().getHeaders();
      currentHeaders.forEach((h, i) => beforeIndexByAccessor.set(h.accessor as string, i));

      for (const row of ROW_INDICES) {
        for (const accessor of ACCESSORS) {
          const cell = findCellByRowAndAccessor(canvasElement, row, accessor);
          expect(cell, `[${stepLabel}] missing pre cell r${row}.${accessor}`).toBeTruthy();
          beforeLefts.set(`${row}:${accessor}`, parseFloat(cell!.style.left || "0"));
        }
      }

      const headersByAccessor = new Map(currentHeaders.map((h) => [h.accessor as string, h]));
      const nextHeaders = nextAccessors.map((acc) => {
        const h = headersByAccessor.get(acc);
        if (!h) throw new Error(`[${stepLabel}] header "${acc}" missing`);
        return h;
      });
      const nextIndexByAccessor = new Map<string, number>(
        nextAccessors.map((acc, i) => [acc, i]),
      );

      // CRITICAL: trigger the update and read the FLIP "First" frame
      // *synchronously*. play() sets `transform: translate3d(dx, dy, 0)`
      // synchronously then schedules a RAF that resets to translate3d(0,0,0)
      // and applies the transition CSS. Awaiting any RAF here would only
      // ever surface the destination (0,0,0).
      table.update({ defaultHeaders: nextHeaders });

      interface Sample {
        row: number;
        accessor: string;
        oldLeft: number;
        newLeft: number;
        txX: number;
        moved: boolean;
      }
      const samples: Sample[] = [];
      for (const row of ROW_INDICES) {
        for (const accessor of ACCESSORS) {
          const cell = findCellByRowAndAccessor(canvasElement, row, accessor);
          expect(cell, `[${stepLabel}] missing post cell r${row}.${accessor}`).toBeTruthy();
          const newLeft = parseFloat(cell!.style.left || "0");
          const txX = parseTranslateX(cell!.style.transform);
          samples.push({
            row,
            accessor,
            oldLeft: beforeLefts.get(`${row}:${accessor}`)!,
            newLeft,
            txX,
            moved:
              beforeIndexByAccessor.get(accessor) !== nextIndexByAccessor.get(accessor),
          });
        }
      }

      const summary = samples
        .map(
          (s) =>
            `[r${s.row}.${s.accessor}] old=${s.oldLeft} new=${s.newLeft} ` +
            `expectedDx=${s.oldLeft - s.newLeft} actualDx=${s.txX}`,
        )
        .join(" | ");

      for (const s of samples) {
        const expected = s.oldLeft - s.newLeft;
        if (Math.abs(s.txX - expected) >= 1.5) {
          throw new Error(`[${stepLabel}] FLIP dx mismatch. ${summary}`);
        }
      }

      const stillSamples = samples.filter((s) => !s.moved);
      for (const s of stillSamples) {
        expect(s.newLeft, `[${stepLabel}] still col ${s.accessor} should not move`).toBe(
          s.oldLeft,
        );
        expect(s.txX, `[${stepLabel}] still col ${s.accessor} should have no tx`).toBe(0);
      }

      const movedSamples = samples.filter((s) => s.moved);
      expect(
        movedSamples.length,
        `[${stepLabel}] expected at least 2 columns to move`,
      ).toBeGreaterThanOrEqual(6); // 2 cols × 3 rows

      const movedAccessors = new Set(movedSamples.map((s) => s.accessor));
      const movedDirections = new Set(
        movedSamples.map((s) => Math.sign(s.txX)).filter((v) => v !== 0),
      );
      expect(
        movedDirections.size,
        `[${stepLabel}] swapped cols should have opposite-sign transforms`,
      ).toBe(2);

      // Once play()'s RAF has fired, the moving cells should report a
      // transform transition (still cells don't need one).
      await tickFrames(2);
      for (const accessor of movedAccessors) {
        for (const row of ROW_INDICES) {
          const cell = findCellByRowAndAccessor(canvasElement, row, accessor);
          expect(
            cell!.style.transition,
            `[${stepLabel}] r${row}.${accessor} should be transitioning transform`,
          ).toContain("transform");
        }
      }

      await sleep(SETTLE_PAUSE);

      for (const row of ROW_INDICES) {
        for (const accessor of ACCESSORS) {
          const cell = findCellByRowAndAccessor(canvasElement, row, accessor);
          const t = cell!.style.transform;
          expect(t === "" || t === "none", `[${stepLabel}] r${row}.${accessor} stuck`).toBe(true);
        }
      }

      const ghosts = canvasElement.querySelectorAll(`[data-animating-out="true"]`);
      expect(ghosts.length, `[${stepLabel}] retained ghosts leaked`).toBe(0);
    };

    // Sanity check the starting layout: A | B | C in increasing left order.
    const aL = parseFloat(findCellByRowAndAccessor(canvasElement, 0, "a")!.style.left || "0");
    const bL = parseFloat(findCellByRowAndAccessor(canvasElement, 0, "b")!.style.left || "0");
    const cL = parseFloat(findCellByRowAndAccessor(canvasElement, 0, "c")!.style.left || "0");
    expect(aL).toBeLessThan(bL);
    expect(bL).toBeLessThan(cL);

    // Five chained reorders. Each step waits past the previous animation
    // (SETTLE_PAUSE inside runReorderStep) before the next one begins.
    await runReorderStep("1/5 swap B↔C → A · C · B", ["a", "c", "b"]);
    await sleep(BEAT);
    await runReorderStep("2/5 swap A↔C → C · A · B", ["c", "a", "b"]);
    await sleep(BEAT);
    await runReorderStep("3/5 swap C↔B → B · A · C", ["b", "a", "c"]);
    await sleep(BEAT);
    await runReorderStep("4/5 swap A↔C → B · C · A", ["b", "c", "a"]);
    await sleep(BEAT);
    await runReorderStep("5/5 reset → A · B · C", ["a", "b", "c"]);

    // Final state should match the original layout exactly.
    const aLAfter = parseFloat(findCellByRowAndAccessor(canvasElement, 0, "a")!.style.left || "0");
    const bLAfter = parseFloat(findCellByRowAndAccessor(canvasElement, 0, "b")!.style.left || "0");
    const cLAfter = parseFloat(findCellByRowAndAccessor(canvasElement, 0, "c")!.style.left || "0");
    expect(aLAfter).toBe(aL);
    expect(bLAfter).toBe(bL);
    expect(cLAfter).toBe(cL);
  },
};

export const ReorderWithoutAnimations = {
  render: () => {
    const result = renderVanillaTable(createHeaders(), createData() as unknown as Row[], {
      height: "400px",
      animations: false,
    });
    setTable(result.table);
    result.h2.textContent = "Programmatic column reorder (animations: off, default)";

    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Column order",
          buttons: [
            {
              label: "Reverse columns",
              onClick: () => {
                const api = result.table.getAPI();
                const reversed = [...api.getHeaders()].reverse();
                result.table.update({ defaultHeaders: reversed });
              },
            },
          ],
        },
      ],
      result.tableContainer,
    );

    addParagraph(
      result.wrapper,
      "Click 'Reverse columns'. Cells teleport to their new positions (no animation).",
      result.tableContainer,
    );

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const table = getTable();

    const api = table.getAPI();
    const reversed = [...api.getHeaders()].reverse();
    table.update({ defaultHeaders: reversed });

    await new Promise((r) => setTimeout(r, 50));
    const cells = canvasElement.querySelectorAll<HTMLElement>(".st-body-main .st-cell");
    expect(cells.length).toBeGreaterThan(0);
    cells.forEach((cell) => {
      const t = cell.style.transform;
      expect(t === "" || t === "none").toBe(true);
    });
  },
};

export const SortAnimationDemo = {
  render: () => {
    const result = renderVanillaTable(createHeaders(), createData() as unknown as Row[], {
      height: "400px",
      animations: true,
      animationDuration: SLOW_DURATION,
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Sort with animations on · ${SLOW_DURATION}ms per step`;
    addParagraph(
      result.wrapper,
      "Click a sortable header — rows slide vertically to their new positions. " +
        "The play function toggles sort across several columns and asserts that " +
        "the SAME DOM cell follows each row to its new position, with no " +
        "leftover transforms or ghost nodes after the animation settles.",
    );
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await sleep(BEAT);

    // Find Charlie's name cell (id=1) and Alice's name cell (id=2). They start
    // unsorted with Charlie above Alice. Sorting Name asc will swap them; we
    // assert the SAME DOM nodes survive the swap (proving stable cellId).
    const findNameCellByText = (text: string): HTMLElement | null => {
      const cells = canvasElement.querySelectorAll<HTMLElement>(
        '.st-body-main [data-accessor="name"]',
      );
      for (const cell of Array.from(cells)) {
        if (cell.textContent?.trim() === text) return cell;
      }
      return null;
    };

    const charlieCellBefore = findNameCellByText("Charlie");
    const aliceCellBefore = findNameCellByText("Alice");
    expect(charlieCellBefore).toBeTruthy();
    expect(aliceCellBefore).toBeTruthy();
    const charlieTopBefore = parseFloat(charlieCellBefore!.style.top || "0");
    const aliceTopBefore = parseFloat(aliceCellBefore!.style.top || "0");
    expect(charlieTopBefore).toBeLessThan(aliceTopBefore);

    // CRITICAL: trigger the sort synchronously and read the FLIP "First"
    // frame *immediately* (no awaits, no RAFs). The coordinator sets
    // `transform: translate3d(0, dy, 0)` synchronously inside play() then
    // schedules a RAF that resets it to translate3d(0,0,0) before the
    // visible transition starts. Awaiting any RAF here would only ever
    // surface the destination state.
    const table = getTable();
    void table.getAPI().applySortState({ accessor: "name", direction: "asc" });

    const charlieMid = findNameCellByText("Charlie");
    const aliceMid = findNameCellByText("Alice");
    expect(charlieMid).toBe(charlieCellBefore);
    expect(aliceMid).toBe(aliceCellBefore);
    const charlieDy = parseTranslateY(charlieMid!.style.transform);
    const aliceDy = parseTranslateY(aliceMid!.style.transform);
    expect(Math.abs(charlieDy)).toBeGreaterThan(0.5);
    expect(Math.abs(aliceDy)).toBeGreaterThan(0.5);
    expect(Math.sign(charlieDy)).not.toBe(Math.sign(aliceDy));

    // Once the FLIP "Play" RAF has fired, both cells should have the
    // transform transition CSS applied so the slide actually animates.
    await tickFrames(2);
    expect(charlieMid!.style.transition).toContain("transform");
    expect(aliceMid!.style.transition).toContain("transform");

    await sleep(SETTLE_PAUSE);

    // After settle: same DOM nodes, swapped tops, no leftover transforms.
    const charlieAfter = findNameCellByText("Charlie");
    const aliceAfter = findNameCellByText("Alice");
    expect(charlieAfter).toBe(charlieCellBefore);
    expect(aliceAfter).toBe(aliceCellBefore);
    expect(parseFloat(charlieAfter!.style.top || "0")).toBeGreaterThan(
      parseFloat(aliceAfter!.style.top || "0"),
    );
    expect(charlieAfter!.style.transform === "" || charlieAfter!.style.transform === "none").toBe(
      true,
    );
    expect(aliceAfter!.style.transform === "" || aliceAfter!.style.transform === "none").toBe(true);

    // Cycle through more sort columns, asserting clean state between steps.
    const sortSequence: Array<{ accessor: string; direction: "asc" | "desc" }> = [
      { accessor: "age", direction: "asc" },
      { accessor: "revenue", direction: "desc" },
      { accessor: "city", direction: "asc" },
      { accessor: "name", direction: "desc" },
    ];
    for (const sort of sortSequence) {
      await sleep(BEAT);
      void table.getAPI().applySortState(sort);
      await sleep(SETTLE_PAUSE);

      const cells = canvasElement.querySelectorAll<HTMLElement>(".st-body-main .st-cell");
      expect(cells.length).toBeGreaterThan(0);
      cells.forEach((cell) => {
        const t = cell.style.transform;
        expect(t === "" || t === "none").toBe(true);
      });
      const ghosts = canvasElement.querySelectorAll(`.st-body-main [data-animating-out="true"]`);
      expect(ghosts.length).toBe(0);
    }
  },
};

export const AnimationsPropWiring = {
  render: () => {
    const { wrapper, h2 } = renderVanillaTable(createHeaders(), createData() as unknown as Row[], {
      height: "400px",
      animations: true,
    });
    h2.textContent = "Smoke: animations prop accepted";
    addParagraph(wrapper, "Verifies the animations prop is plumbed through without error.");
    return wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const root = canvasElement.querySelector(".simple-table-root");
    expect(root).toBeTruthy();
  },
};

/**
 * Cells should animate from THEIR PREVIOUS position, not all from the same
 * direction. This story snapshots every cell's pre-reorder geometry and then
 * verifies, mid-flight, that:
 *
 *   1. Cells that move RIGHT (new left > old left) start with a NEGATIVE
 *      transform-X (so they appear at their previous-left and slide rightward).
 *   2. Cells that move LEFT  (new left < old left) start with a POSITIVE
 *      transform-X (so they appear at their previous-right and slide leftward).
 *   3. Both directions appear in the same animation tick — no "everyone slides
 *      from the same edge" regression.
 *   4. The translate-X delta for each cell exactly equals (oldLeft - newLeft),
 *      so the FLIP "First" frame really lands at the previous on-screen pixel
 *      position rather than at some shared anchor.
 */
export const ReorderAnimatesFromPreviousPositionPerCell = {
  render: () => {
    const result = renderVanillaTable(createHeaders(), createData() as unknown as Row[], {
      height: "400px",
      animations: true,
      animationDuration: SLOW_DURATION,
    });
    setTable(result.table);
    result.h2.textContent = "Reorder animates from each cell's previous position";
    addParagraph(
      result.wrapper,
      "Catches a regression where every cell would animate from the same edge " +
        "instead of from its actual previous position.",
    );
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await sleep(BEAT);

    const accessors = ["id", "name", "age", "revenue", "city"];
    const ROW_INDEX = 0;

    const beforeLefts = new Map<string, number>();
    for (const accessor of accessors) {
      const cell = findCellByRowAndAccessor(canvasElement, ROW_INDEX, accessor);
      expect(cell).toBeTruthy();
      beforeLefts.set(accessor, parseFloat(cell!.style.left || "0"));
    }
    const distinctBefore = new Set(beforeLefts.values());
    expect(distinctBefore.size).toBe(accessors.length);

    const table = getTable();
    const original = table.getAPI().getHeaders();
    table.update({ defaultHeaders: [...original].reverse() });

    // CRITICAL: read the FLIP "First" frame *synchronously* — the coordinator
    // sets `transform: translate3d(dx, dy, 0)` inside play() then schedules a
    // RAF to reset to translate3d(0,0,0). Waiting any RAF would only ever
    // surface the destination (0,0,0).
    const samples: Array<{
      accessor: string;
      oldLeft: number;
      newLeft: number;
      txX: number;
      direction: "right" | "left" | "still";
    }> = [];

    for (const accessor of accessors) {
      const cell = findCellByRowAndAccessor(canvasElement, ROW_INDEX, accessor);
      expect(cell).toBeTruthy();

      const newLeft = parseFloat(cell!.style.left || "0");
      const oldLeft = beforeLefts.get(accessor)!;
      const txX = parseTranslateX(cell!.style.transform);

      let direction: "right" | "left" | "still" = "still";
      if (newLeft - oldLeft > 0.5) direction = "right";
      else if (newLeft - oldLeft < -0.5) direction = "left";

      samples.push({ accessor, oldLeft, newLeft, txX, direction });
    }

    const expectedDx = (s: { oldLeft: number; newLeft: number }) => s.oldLeft - s.newLeft;
    const summary = samples
      .map(
        (s) =>
          `${s.accessor}: old=${s.oldLeft} new=${s.newLeft} ` +
          `expectedDx=${expectedDx(s)} actualDx=${s.txX} dir=${s.direction}`,
      )
      .join(" | ");
    for (const s of samples) {
      const expected = expectedDx(s);
      const diff = Math.abs(s.txX - expected);
      if (diff >= 1.5) {
        throw new Error(`FLIP dx mismatch for "${s.accessor}". ${summary}`);
      }
    }

    const movedRight = samples.filter((s) => s.direction === "right");
    const movedLeft = samples.filter((s) => s.direction === "left");
    expect(movedRight.length).toBeGreaterThan(0);
    expect(movedLeft.length).toBeGreaterThan(0);

    for (const s of movedRight) {
      expect(s.txX).toBeLessThan(-0.5);
    }
    for (const s of movedLeft) {
      expect(s.txX).toBeGreaterThan(0.5);
    }

    const txValues = samples.map((s) => Math.round(s.txX));
    const distinctTx = new Set(txValues);
    expect(distinctTx.size).toBeGreaterThan(1);

    // Once the FLIP "Play" RAF has fired, every cell should report the
    // transition CSS so the animation is actually running.
    await tickFrames(2);
    for (const accessor of accessors) {
      const cell = findCellByRowAndAccessor(canvasElement, ROW_INDEX, accessor);
      expect(cell!.style.transition).toContain("transform");
    }

    await sleep(SETTLE_PAUSE);

    for (const accessor of accessors) {
      const cell = findCellByRowAndAccessor(canvasElement, ROW_INDEX, accessor);
      expect(cell!.style.transform === "" || cell!.style.transform === "none").toBe(true);
    }
  },
};

/**
 * Off-screen rows still slide. When the viewport only renders a slice of
 * all rows, sorting causes some cells to enter the visible band (rows that
 * were below the fold pre-sort) and others to leave it (rows that were on
 * screen pre-sort). The coordinator captures positions for ALL rows in the
 * dataset, so:
 *
 *   - Incoming cells get created at their new (visible) position and FLIP
 *     in from their actual pre-change off-screen `top`. Visually the cell
 *     appears to slide in from the viewport edge.
 *   - Outgoing cells get retained at their pre-change visible position and
 *     slide to their actual post-change off-screen `top`, then are removed.
 *     Visually the cell appears to slide out past the viewport edge.
 *
 * Both kinds of slides use `transform: translate3d` (no opacity).
 */
export const SortSlidesRowsCrossingTheViewportBoundary = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "id", label: "ID", width: 80, isSortable: true, type: "number" },
      { accessor: "name", label: "Name", width: 200, isSortable: true },
      { accessor: "value", label: "Value", width: 150, isSortable: true, type: "number" },
    ];
    const rows: Row[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Row ${i + 1}`,
      value: (i * 37) % 1000,
    }));
    const result = renderVanillaTable(headers, rows, {
      height: "300px",
      animations: true,
      animationDuration: SLOW_DURATION,
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Sort slides rows across the viewport boundary · ${SLOW_DURATION}ms`;
    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Sort",
          buttons: [
            {
              label: "Sort by id (desc)",
              onClick: () => {
                void result.table.getAPI().applySortState({ accessor: "id", direction: "desc" });
              },
            },
            {
              label: "Sort by id (asc)",
              onClick: () => {
                void result.table.getAPI().applySortState({ accessor: "id", direction: "asc" });
              },
            },
          ],
        },
      ],
      result.tableContainer,
    );
    addParagraph(
      result.wrapper,
      "Only ~10 rows fit in the viewport. Sorting flips the order entirely so " +
        "every visible row is replaced. Incoming rows slide in from below the " +
        "viewport, outgoing rows slide down past the viewport edge. Pure " +
        "transform slides; no opacity tricks.",
      result.tableContainer,
    );
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await sleep(BEAT);

    const beforeIds = new Set(
      Array.from(
        canvasElement.querySelectorAll<HTMLElement>('.st-body-main [data-accessor="id"]'),
      ).map((c) => (c.textContent ?? "").trim()),
    );
    expect(beforeIds.size).toBeGreaterThan(0);
    expect(beforeIds.has("1")).toBe(true);
    expect(beforeIds.has("100")).toBe(false);

    const table = getTable();
    // Trigger sort synchronously and inspect the FLIP "First" frame *before*
    // any RAFs run. play() sets `transform: translate3d(...)` synchronously
    // then schedules a RAF that resets it to translate3d(0,0,0) and applies
    // the transition CSS.
    void table.getAPI().applySortState({ accessor: "id", direction: "desc" });

    // Outgoing cells should be retained as ghosts (with non-zero translate)
    // sliding to their new off-screen positions.
    const ghostsImmediately = canvasElement.querySelectorAll<HTMLElement>(
      `[data-animating-out="true"]`,
    );
    expect(ghostsImmediately.length).toBeGreaterThan(0);
    ghostsImmediately.forEach((el) => {
      expect(el.style.transform).toContain("translate");
      // No fades. We only ever touched transform.
      expect(el.style.opacity === "" || el.style.opacity === "1").toBe(true);
    });

    // Incoming cells (new ids that weren't in the DOM pre-sort) should also
    // carry a non-zero FLIP "First" translate, sliding in from off-screen.
    const incomingImmediately = Array.from(
      canvasElement.querySelectorAll<HTMLElement>('.st-body-main [data-accessor="id"]'),
    ).filter((el) => !beforeIds.has((el.textContent ?? "").trim()));
    expect(incomingImmediately.length).toBeGreaterThan(0);
    for (const el of incomingImmediately) {
      expect(el.style.transform).toContain("translate");
      expect(el.style.opacity === "" || el.style.opacity === "1").toBe(true);
    }

    // After play()'s RAF fires, transitions are applied — and only on
    // transform, never on opacity.
    await tickFrames(2);
    canvasElement
      .querySelectorAll<HTMLElement>(`[data-animating-out="true"]`)
      .forEach((el) => {
        expect(el.style.transition).toContain("transform");
        expect(el.style.transition).not.toContain("opacity");
      });

    await sleep(SETTLE_PAUSE);

    const afterIds = new Set(
      Array.from(
        canvasElement.querySelectorAll<HTMLElement>('.st-body-main [data-accessor="id"]'),
      ).map((c) => (c.textContent ?? "").trim()),
    );
    expect(afterIds.size).toBeGreaterThan(0);
    expect(afterIds.has("100")).toBe(true);
    expect(afterIds.has("1")).toBe(false);

    // No leftover ghosts, transforms, or transitions on settled cells.
    const leftoverGhosts = canvasElement.querySelectorAll(
      `[data-animating-out="true"]`,
    );
    expect(leftoverGhosts.length).toBe(0);
    canvasElement.querySelectorAll<HTMLElement>(".st-body-main .st-cell").forEach((cell) => {
      const t = cell.style.transform;
      expect(t === "" || t === "none").toBe(true);
      const o = cell.style.opacity;
      expect(o === "" || o === "1").toBe(true);
    });
  },
};

/**
 * Drag-and-drop column reorder must FLIP-animate the displaced body cells
 * (and header cells) on EVERY `dragover` swap — not just on the final
 * `dragend`. Visually: while the user drags column B sideways, column C
 * should glide left to make room as soon as B's center crosses C's center,
 * the same way a programmatic `table.update({ defaultHeaders })` swap
 * animates.
 *
 * How the host pulls this off:
 *   - The drag handler (`headerCell/dragging.ts`) calls
 *     `context.onTableHeaderDragEnd(newHeaders)` from inside `dragover` once
 *     the cursor has moved enough to trigger a swap. That callback resolves
 *     to `setHeaders(newHeaders)` + `onRender()`.
 *   - `setHeaders` first calls `captureAnimationSnapshot()` (no live-drag
 *     skip), then mutates the headers. The next render commits cells to
 *     their new absolute positions.
 *   - `render()`'s final `play()` consumes the snapshot, computes the
 *     pre→post deltas, and FLIPs every cell that moved — including the one
 *     in the column the user is dragging.
 *
 * This test renders a 3 cols × 3 rows table and dispatches the drag
 * sequence inline so it can poll the cells between `dragover` events and
 * assert that a FLIP transform or `transition: transform` was observed
 * BEFORE `dragend` ever fires. Asserting only "saw FLIP within N ms
 * after dragend" wouldn't distinguish the desired behaviour from a
 * single settle animation that runs only on drop.
 */
export const DragAndDropColumnReorderShouldAnimate = {
  render: () => {
    const headers: HeaderObject[] = [
      { accessor: "a", label: "A", width: 120 },
      { accessor: "b", label: "B", width: 120 },
      { accessor: "c", label: "C", width: 120 },
    ];
    const rows: Row[] = [
      { id: 1, a: "A1", b: "B1", c: "C1" },
      { id: 2, a: "A2", b: "B2", c: "C2" },
      { id: 3, a: "A3", b: "B3", c: "C3" },
    ];
    const result = renderVanillaTable(headers, rows, {
      height: "240px",
      animations: true,
      animationDuration: SLOW_DURATION,
      columnReordering: true,
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Drag-and-drop column reorder should animate on every dragover · ${SLOW_DURATION}ms`;
    addParagraph(
      result.wrapper,
      "Drag the B header onto the C header in this 3×3 table. As soon as B " +
        "crosses C, the B and C columns should smoothly slide past each " +
        "other — not snap into place when you release.",
      result.tableContainer,
    );
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await sleep(BEAT);

    const ROW_INDICES = [0, 1, 2];
    const ACCESSORS = ["a", "b", "c"];

    const findHeaderLabel = (accessor: string): HTMLElement => {
      const cell = canvasElement.querySelector(
        `.st-header-cell[data-accessor="${accessor}"], .st-header-cell #header-${accessor}`,
      );
      const labelHost =
        cell?.closest(".st-header-cell") ??
        canvasElement.querySelector(`#header-${accessor}`)?.closest(".st-header-cell");
      const label = labelHost?.querySelector<HTMLElement>(".st-header-label");
      if (!label) {
        const headers = canvasElement.querySelectorAll<HTMLElement>(".st-header-cell");
        for (const h of Array.from(headers)) {
          const text = h.querySelector(".st-header-label-text")?.textContent?.trim() ?? "";
          if (text.toLowerCase() === accessor.toLowerCase()) {
            const l = h.querySelector<HTMLElement>(".st-header-label");
            if (l) return l;
          }
        }
        throw new Error(`Header label for "${accessor}" not found`);
      }
      return label;
    };

    const beforeLefts = new Map<string, number>();
    for (const row of ROW_INDICES) {
      for (const accessor of ACCESSORS) {
        const cell = findCellByRowAndAccessor(canvasElement, row, accessor);
        expect(cell, `missing pre cell r${row}.${accessor}`).toBeTruthy();
        beforeLefts.set(`${row}:${accessor}`, parseFloat(cell!.style.left || "0"));
      }
    }
    const aLBefore = beforeLefts.get("0:a")!;
    const bLBefore = beforeLefts.get("0:b")!;
    const cLBefore = beforeLefts.get("0:c")!;
    expect(aLBefore).toBeLessThan(bLBefore);
    expect(bLBefore).toBeLessThan(cLBefore);

    const sourceLabel = findHeaderLabel("b");
    const targetLabel = findHeaderLabel("c");
    const targetCell = targetLabel.closest(".st-header-cell") ?? targetLabel;

    /**
     * Watch every body cell for a FLIP "First" frame: a non-zero translate
     * `transform` and/or a `transition: transform …` set on the inline
     * style. Latches `true` on the first hit so callers can poll cheaply.
     */
    let sawFlipDuringDrag = false;
    const sampleAllCells = () => {
      if (sawFlipDuringDrag) return;
      for (const row of ROW_INDICES) {
        for (const accessor of ACCESSORS) {
          const cell = findCellByRowAndAccessor(canvasElement, row, accessor);
          if (!cell) continue;
          const tx = parseTranslateX(cell.style.transform);
          if (Math.abs(tx) > 0.5) {
            sawFlipDuringDrag = true;
            return;
          }
          if (cell.style.transition.includes("transform")) {
            sawFlipDuringDrag = true;
            return;
          }
        }
      }
    };

    const sourceRect = sourceLabel.getBoundingClientRect();
    const targetRect = targetLabel.getBoundingClientRect();
    const startX = sourceRect.left + sourceRect.width / 2;
    const startY = sourceRect.top + sourceRect.height / 2;
    const endX = targetRect.left + targetRect.width / 2;
    const endY = targetRect.top + targetRect.height / 2;

    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text/plain", "column-drag");
    dataTransfer.effectAllowed = "move";

    sourceLabel.dispatchEvent(
      new DragEvent("dragstart", {
        bubbles: true,
        cancelable: true,
        clientX: startX,
        clientY: startY,
        dataTransfer,
      }),
    );

    // Sweep the cursor from B's center to C's center across N steps. After
    // each `dragover` we wait a few animation frames (long enough to
    // outlast the drag throttle and let the FLIP "First" frame paint) and
    // sample the cells. We deliberately stop sampling BEFORE dispatching
    // `dragend` so the assertion can't be satisfied by a post-drop FLIP.
    const steps = 8;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;
      targetCell.dispatchEvent(
        new DragEvent("dragover", {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          screenX: x,
          screenY: y,
          dataTransfer,
        }),
      );
      // The drag handler throttles swaps at DRAG_THROTTLE_LIMIT (50ms).
      // Wait a few RAFs (~64ms at 60fps) so a throttled swap can fire and
      // the resulting FLIP can paint its first frame before we sample.
      for (let frame = 0; frame < 4; frame++) {
        await new Promise((r) => requestAnimationFrame(() => r(undefined)));
        sampleAllCells();
        if (sawFlipDuringDrag) break;
      }
    }

    // Snapshot the assertion BEFORE dragend so a post-drop FLIP can't sneak
    // in and falsely satisfy "saw a FLIP".
    const sawFlipBeforeDragEnd = sawFlipDuringDrag;

    targetCell.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        dataTransfer,
      }),
    );
    sourceLabel.dispatchEvent(
      new DragEvent("dragend", {
        bubbles: true,
        cancelable: true,
        clientX: endX,
        clientY: endY,
        dataTransfer,
      }),
    );

    // Give the post-dragend setTimeout(10) + render + any final FLIP a
    // chance to fire so the after-state we measure below is settled.
    await sleep(120);

    const afterLefts = new Map<string, number>();
    for (const row of ROW_INDICES) {
      for (const accessor of ACCESSORS) {
        const cell = findCellByRowAndAccessor(canvasElement, row, accessor);
        expect(cell, `missing post cell r${row}.${accessor}`).toBeTruthy();
        afterLefts.set(`${row}:${accessor}`, parseFloat(cell!.style.left || "0"));
      }
    }

    const aLAfter = afterLefts.get("0:a")!;
    const bLAfter = afterLefts.get("0:b")!;
    const cLAfter = afterLefts.get("0:c")!;

    // Sanity check: B and C actually swapped (the drag did its job).
    if (Math.abs(bLAfter - cLBefore) >= 1.5 || Math.abs(cLAfter - bLBefore) >= 1.5) {
      throw new Error(
        `Expected drag to swap B↔C. ` +
          `B left: ${bLBefore} → ${bLAfter} (expected ~${cLBefore}). ` +
          `C left: ${cLBefore} → ${cLAfter} (expected ~${bLBefore}). ` +
          `A left: ${aLBefore} → ${aLAfter} (expected unchanged).`,
      );
    }

    // The regression assertion: a FLIP transform / transition must have
    // been observed on at least one body cell while `dragover` events were
    // still firing — i.e. before `dragend` was dispatched. A "settle on
    // drop" implementation would fail this because no cell would carry a
    // non-zero transform until `dragend` triggers the final play.
    expect(
      sawFlipBeforeDragEnd,
      "Drag-and-drop column reorder should FLIP-animate body cells on " +
        "every dragover swap (no transform / transition was observed " +
        "between dragstart and dragend).",
    ).toBe(true);

    // After SETTLE_PAUSE, all animations (if any) should have cleaned up.
    await sleep(SETTLE_PAUSE);
    for (const row of ROW_INDICES) {
      for (const accessor of ACCESSORS) {
        const cell = findCellByRowAndAccessor(canvasElement, row, accessor);
        const t = cell!.style.transform;
        expect(t === "" || t === "none", `r${row}.${accessor} stuck transform`).toBe(true);
      }
    }
    const ghosts = canvasElement.querySelectorAll(`[data-animating-out="true"]`);
    expect(ghosts.length).toBe(0);
  },
};

const parseTranslateX = (transform: string): number => {
  if (!transform || transform === "none") return 0;
  const match =
    transform.match(/translate3d\(\s*(-?\d+(?:\.\d+)?)px/) ??
    transform.match(/translate\(\s*(-?\d+(?:\.\d+)?)px/) ??
    transform.match(/matrix\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(-?\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

const parseTranslateY = (transform: string): number => {
  if (!transform || transform === "none") return 0;
  const t3d = transform.match(/translate3d\(\s*-?\d+(?:\.\d+)?px\s*,\s*(-?\d+(?:\.\d+)?)px/);
  if (t3d) return parseFloat(t3d[1]);
  const t2 = transform.match(/translate\(\s*-?\d+(?:\.\d+)?px\s*,\s*(-?\d+(?:\.\d+)?)px/);
  if (t2) return parseFloat(t2[1]);
  const matrix = transform.match(
    /matrix\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(-?\d+(?:\.\d+)?)/,
  );
  return matrix ? parseFloat(matrix[1]) : 0;
};
