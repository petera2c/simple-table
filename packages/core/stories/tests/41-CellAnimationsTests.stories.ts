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
