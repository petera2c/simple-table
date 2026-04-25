/**
 * CELL ANIMATIONS — VIRTUALIZATION & SCALE TESTS (slow & visible)
 *
 * Stress-tests the FLIP animation coordinator at scale (500 rows × 30 cols
 * in a constrained viewport) with `animationDuration` cranked up so the
 * play function is *visible* when watched in Storybook. Each play function
 * runs many sequential interactions with explicit pauses between them so
 * you can see each animation phase fire.
 *
 * Slides apply both within and across the visible band:
 *   - Persistent cells (visible before AND after) slide from old → new.
 *   - Incoming cells (off-screen before, in DOM after) FLIP in from their
 *     true pre-change off-screen position, clipped by the body's overflow.
 *   - Outgoing cells (in DOM before, off-screen after) are retained and
 *     slide to their true post-change off-screen position before being
 *     removed — visually they appear to slide out past the viewport edge.
 *
 * Note (v1): horizontal "virtualization" via `getVisibleBodyCells` is
 * effectively a no-op because `mainSectionContainerWidth` is the sum of
 * main column widths (content), not the visible viewport. All non-pinned
 * columns within the row band stay in the DOM.
 */

import { HeaderObject, SimpleTableVanilla, Row } from "../../src/index";
import { expect } from "@storybook/test";
import { waitForTable } from "./testUtils";
import { addParagraph, addControlPanel } from "../utils";
import type { Meta } from "@storybook/html";

const meta: Meta = {
  title: "Tests/42 - Cell Animations Virtualization",
  tags: ["animations"],
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Scale + virtualization stress-tests for the FLIP animation coordinator, " +
          "with deliberately slow animations so each step is visible.",
      },
    },
  },
};

export default meta;

type TableInstance = InstanceType<typeof SimpleTableVanilla>;
const TABLE_REF_KEY = "__storybook_animations_v_table_ref";

const setTable = (table: TableInstance): void => {
  (globalThis as unknown as Record<string, TableInstance>)[TABLE_REF_KEY] = table;
};
const getTable = (): TableInstance => {
  const t = (globalThis as unknown as Record<string, TableInstance | undefined>)[TABLE_REF_KEY];
  if (!t) throw new Error("Table ref not set (run render first)");
  return t;
};

interface BigRow {
  id: string;
  [accessor: string]: string | number;
}

const COLUMN_COUNT = 30;
const ROW_COUNT = 500;
const COLUMN_WIDTH = 220;
const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 500;
/** Slow on purpose so each animation is easy to follow when watching. */
const SLOW_DURATION = 1500;
/** A pause that comfortably outlasts SLOW_DURATION so the animation finishes. */
const SETTLE_PAUSE = SLOW_DURATION + 400;
/** A short pause to let the user appreciate a new state before the next step. */
const BEAT = 600;

interface RenderResult {
  wrapper: HTMLElement;
  h2: HTMLHeadingElement;
  status: HTMLElement;
  tableContainer: HTMLElement;
  table: TableInstance;
}

const renderConstrainedTable = (
  headers: HeaderObject[],
  data: Row[],
  options: Record<string, unknown>,
): RenderResult => {
  const wrapper = document.createElement("div");
  wrapper.style.padding = "2rem";

  const h2 = document.createElement("h2");
  h2.style.marginBottom = "0.5rem";
  wrapper.appendChild(h2);

  const status = document.createElement("div");
  status.style.cssText =
    "margin-bottom: 1rem; padding: 0.5rem 0.75rem; background: #f4f6fb; " +
    "border: 1px solid #d6dbe7; border-radius: 6px; font-family: system-ui, sans-serif; " +
    "font-size: 0.85rem; color: #31374a; min-height: 1.2em;";
  status.textContent = "Idle.";
  wrapper.appendChild(status);

  const tableContainer = document.createElement("div");
  tableContainer.style.width = `${VIEWPORT_WIDTH}px`;
  tableContainer.style.maxWidth = `${VIEWPORT_WIDTH}px`;
  wrapper.appendChild(tableContainer);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: headers,
    rows: data,
    height: `${VIEWPORT_HEIGHT}px`,
    animations: true,
    animationDuration: SLOW_DURATION,
    ...options,
  });
  table.mount();

  return { wrapper, h2, status, tableContainer, table };
};

const createHeaders = (): HeaderObject[] => {
  const headers: HeaderObject[] = [{ accessor: "id", label: "ID", width: 100, isSortable: true }];
  for (let i = 0; i < COLUMN_COUNT; i++) {
    headers.push({
      accessor: `col_${i}`,
      label: `Col ${i}`,
      width: COLUMN_WIDTH,
      isSortable: true,
      type: "number",
    });
  }
  return headers;
};

const createData = (): BigRow[] => {
  const rows: BigRow[] = [];
  for (let r = 0; r < ROW_COUNT; r++) {
    const row: BigRow = { id: `row-${r}` };
    for (let c = 0; c < COLUMN_COUNT; c++) {
      row[`col_${c}`] = r * 100 + c;
    }
    rows.push(row);
  }
  return rows;
};

const findScroller = (canvasElement: HTMLElement): HTMLElement | null => {
  return (
    canvasElement.querySelector<HTMLElement>(".st-body-container") ??
    canvasElement.querySelector<HTMLElement>(".st-body-main")
  );
};

const tickFrames = async (count: number): Promise<void> => {
  for (let i = 0; i < count; i++) {
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
  }
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const announce = (status: HTMLElement, msg: string): void => {
  status.textContent = msg;
};

const countAnimating = (canvasElement: HTMLElement): number => {
  return Array.from(canvasElement.querySelectorAll<HTMLElement>(`.st-body-main .st-cell`)).filter(
    (el) => el.style.transition.includes("transform") && el.style.transform.includes("translate"),
  ).length;
};

const countGhosts = (canvasElement: HTMLElement): number => {
  return canvasElement.querySelectorAll(`.st-body-main [data-animating-out="true"]`).length;
};

const findCellByRowIndexAndAccessor = (
  canvasElement: HTMLElement,
  rowIndex: number,
  accessor: string,
): HTMLElement | null => {
  return canvasElement.querySelector(
    `.st-body-main [data-row-index="${rowIndex}"][data-accessor="${accessor}"]`,
  ) as HTMLElement | null;
};

const parseTranslateX = (transform: string): number => {
  if (!transform || transform === "none") return 0;
  const match =
    transform.match(/translate3d\(\s*(-?\d+(?:\.\d+)?)px/) ??
    transform.match(/translate\(\s*(-?\d+(?:\.\d+)?)px/) ??
    transform.match(/matrix\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(-?\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

// ============================================================================
// STORIES
// ============================================================================

/**
 * Slow column reorder marathon: reverse → reset → swap pair → reset, with a
 * BEAT pause between each step so each animation phase is clearly visible.
 * Asserts that >50 cells get a `transform` transition mid-flight after each
 * reorder, and that everything settles cleanly between steps.
 */
export const SlowColumnReorderMarathon = {
  render: () => {
    const result = renderConstrainedTable(createHeaders(), createData(), {
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Slow column reorder marathon — ${COLUMN_COUNT} cols × ${ROW_COUNT} rows · ${SLOW_DURATION}ms per step`;

    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Column order",
          buttons: [
            {
              label: "Reverse",
              onClick: () => {
                const api = result.table.getAPI();
                const reversed = [...api.getHeaders()].reverse();
                result.table.update({ defaultHeaders: reversed });
              },
            },
            {
              label: "Swap col_0 ↔ col_5",
              onClick: () => {
                const api = result.table.getAPI();
                const headers = [...api.getHeaders()];
                const a = headers.findIndex((h) => h.accessor === "col_0");
                const b = headers.findIndex((h) => h.accessor === "col_5");
                if (a !== -1 && b !== -1) {
                  [headers[a], headers[b]] = [headers[b], headers[a]];
                  result.table.update({ defaultHeaders: headers });
                }
              },
            },
            {
              label: "Shuffle",
              onClick: () => {
                const api = result.table.getAPI();
                const headers = [...api.getHeaders()];
                for (let i = headers.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [headers[i], headers[j]] = [headers[j], headers[i]];
                }
                result.table.update({ defaultHeaders: headers });
              },
            },
            {
              label: "Reset",
              onClick: () => {
                result.table.update({ defaultHeaders: createHeaders() });
              },
            },
          ],
        },
      ],
      result.tableContainer,
    );

    addParagraph(
      result.wrapper,
      `Each reorder animates over ${SLOW_DURATION}ms. The status banner above the table ` +
        `narrates the play function so you can watch each step.`,
      result.tableContainer,
    );

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const status =
      canvasElement.querySelector<HTMLElement>("div[style*='background: #f4f6fb']") ??
      document.createElement("div");
    await sleep(BEAT);
    const table = getTable();
    const api = table.getAPI();
    const original = api.getHeaders();

    announce(status, "Step 1/5 · Reversing all columns…");
    table.update({ defaultHeaders: [...original].reverse() });
    await tickFrames(2);
    expect(countAnimating(canvasElement)).toBeGreaterThan(50);
    await sleep(SETTLE_PAUSE);
    expect(countGhosts(canvasElement)).toBe(0);

    announce(status, "Step 2/5 · Resetting to original order…");
    await sleep(BEAT);
    table.update({ defaultHeaders: original });
    await tickFrames(2);
    expect(countAnimating(canvasElement)).toBeGreaterThan(50);
    await sleep(SETTLE_PAUSE);

    // STRICT step: swap two cells that are BOTH visible in the viewport so we
    // can synchronously assert the FLIP "First" frame's transform-X exactly
    // equals (oldLeft - newLeft) — catches regressions where cells animate
    // from a wrong anchor.
    announce(status, "Step 3/5 · Strict contained swap col_0 ↔ col_2…");
    await sleep(BEAT);
    const cellA = findCellByRowIndexAndAccessor(canvasElement, 0, "col_0");
    const cellB = findCellByRowIndexAndAccessor(canvasElement, 0, "col_2");
    expect(cellA).toBeTruthy();
    expect(cellB).toBeTruthy();
    const aOldLeft = parseFloat(cellA!.style.left || "0");
    const bOldLeft = parseFloat(cellB!.style.left || "0");
    expect(aOldLeft).not.toBe(bOldLeft);

    const swapped = [...original];
    const ai = swapped.findIndex((h) => h.accessor === "col_0");
    const bi = swapped.findIndex((h) => h.accessor === "col_2");
    [swapped[ai], swapped[bi]] = [swapped[bi], swapped[ai]];
    table.update({ defaultHeaders: swapped });

    const cellAAfter = findCellByRowIndexAndAccessor(canvasElement, 0, "col_0");
    const cellBAfter = findCellByRowIndexAndAccessor(canvasElement, 0, "col_2");
    const aNewLeft = parseFloat(cellAAfter!.style.left || "0");
    const bNewLeft = parseFloat(cellBAfter!.style.left || "0");
    expect(aNewLeft).toBeCloseTo(bOldLeft, 0);
    expect(bNewLeft).toBeCloseTo(aOldLeft, 0);

    const aTx = parseTranslateX(cellAAfter!.style.transform);
    const bTx = parseTranslateX(cellBAfter!.style.transform);
    expect(Math.abs(aTx - (aOldLeft - aNewLeft))).toBeLessThan(1.5);
    expect(Math.abs(bTx - (bOldLeft - bNewLeft))).toBeLessThan(1.5);
    expect(Math.sign(aTx)).not.toBe(Math.sign(bTx));
    expect(aTx).not.toBe(0);
    expect(bTx).not.toBe(0);
    await sleep(SETTLE_PAUSE);

    announce(status, "Step 4/5 · Reset after contained swap…");
    await sleep(BEAT);
    table.update({ defaultHeaders: original });
    await sleep(SETTLE_PAUSE);

    announce(status, "Step 5/5 · Final reset (no-op)…");
    await sleep(BEAT);
    table.update({ defaultHeaders: original });
    await sleep(SETTLE_PAUSE);

    announce(status, "Done.");
    expect(countGhosts(canvasElement)).toBe(0);
  },
};

/**
 * Visually obvious "two cells trading places" demo. Uses neighbour columns
 * that are both fully inside the viewport (so the FLIP motion is contained
 * on-screen, no off-screen sweeps). The play function:
 *
 *   1. Captures both cells' pre-swap left positions.
 *   2. Calls `table.update({ defaultHeaders: swapped })`.
 *   3. Synchronously asserts each cell's FLIP transform-X equals
 *      (oldLeft - newLeft) — i.e. cell A starts where B was, cell B starts
 *      where A was, and they slide toward each other in opposite directions.
 *
 * If a future change causes cells to animate from a single shared anchor
 * (e.g. the right edge), this story fails immediately.
 */
export const ContainedNeighborSwapAnimation = {
  render: () => {
    const result = renderConstrainedTable(createHeaders(), createData(), {
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = "Two cells trading places · contained neighbour swap";

    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Swap visible neighbours",
          buttons: [
            {
              label: "Swap col_0 ↔ col_2",
              onClick: () => {
                const headers = [...result.table.getAPI().getHeaders()];
                const a = headers.findIndex((h) => h.accessor === "col_0");
                const b = headers.findIndex((h) => h.accessor === "col_2");
                if (a !== -1 && b !== -1) {
                  [headers[a], headers[b]] = [headers[b], headers[a]];
                  result.table.update({ defaultHeaders: headers });
                }
              },
            },
            {
              label: "Reset",
              onClick: () => {
                result.table.update({ defaultHeaders: createHeaders() });
              },
            },
          ],
        },
      ],
      result.tableContainer,
    );

    addParagraph(
      result.wrapper,
      "col_0 and col_2 are both inside the 800px viewport. Swapping them shows " +
        "two cells sliding toward each other — proof that each cell starts at the " +
        "OTHER cell's previous position rather than at a shared edge.",
      result.tableContainer,
    );

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await sleep(BEAT);
    const status =
      canvasElement.querySelector<HTMLElement>("div[style*='background: #f4f6fb']") ??
      document.createElement("div");

    const table = getTable();
    const original = table.getAPI().getHeaders();

    const ROW_INDEX = 0;
    const ACC_A = "col_0";
    const ACC_B = "col_2";

    const before = (acc: string): number => {
      const c = findCellByRowIndexAndAccessor(canvasElement, ROW_INDEX, acc);
      expect(c).toBeTruthy();
      return parseFloat(c!.style.left || "0");
    };
    const aOldLeft = before(ACC_A);
    const bOldLeft = before(ACC_B);
    expect(aOldLeft).not.toBe(bOldLeft);
    expect(Math.abs(bOldLeft - aOldLeft)).toBeGreaterThan(50);

    announce(status, `Swapping ${ACC_A} ↔ ${ACC_B}…`);
    const swapped = [...original];
    const ai = swapped.findIndex((h) => h.accessor === ACC_A);
    const bi = swapped.findIndex((h) => h.accessor === ACC_B);
    [swapped[ai], swapped[bi]] = [swapped[bi], swapped[ai]];
    table.update({ defaultHeaders: swapped });

    const cellA = findCellByRowIndexAndAccessor(canvasElement, ROW_INDEX, ACC_A)!;
    const cellB = findCellByRowIndexAndAccessor(canvasElement, ROW_INDEX, ACC_B)!;
    const aNewLeft = parseFloat(cellA.style.left || "0");
    const bNewLeft = parseFloat(cellB.style.left || "0");

    expect(aNewLeft).toBeCloseTo(bOldLeft, 0);
    expect(bNewLeft).toBeCloseTo(aOldLeft, 0);

    const aTx = parseTranslateX(cellA.style.transform);
    const bTx = parseTranslateX(cellB.style.transform);

    const expectedATx = aOldLeft - aNewLeft;
    const expectedBTx = bOldLeft - bNewLeft;
    if (Math.abs(aTx - expectedATx) >= 1.5 || Math.abs(bTx - expectedBTx) >= 1.5) {
      throw new Error(
        `Swap FLIP transforms wrong. ` +
          `${ACC_A}: oldLeft=${aOldLeft} newLeft=${aNewLeft} expectedTx=${expectedATx} actualTx=${aTx}. ` +
          `${ACC_B}: oldLeft=${bOldLeft} newLeft=${bNewLeft} expectedTx=${expectedBTx} actualTx=${bTx}.`,
      );
    }

    expect(Math.sign(aTx)).not.toBe(Math.sign(bTx));
    expect(Math.abs(aTx)).toBeGreaterThan(50);
    expect(Math.abs(bTx)).toBeGreaterThan(50);

    await sleep(SETTLE_PAUSE);
    announce(status, "Done.");
    expect(cellA.style.transform === "" || cellA.style.transform === "none").toBe(true);
    expect(cellB.style.transform === "" || cellB.style.transform === "none").toBe(true);
  },
};

/**
 * Vertical scroll → reorder → vertical scroll → reorder, demonstrating that
 * the snapshot reflects the *currently visible* row band each time.
 */
export const ReorderAtMultipleScrollPositions = {
  render: () => {
    const result = renderConstrainedTable(createHeaders(), createData(), {
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Reorder at multiple scroll positions · ${SLOW_DURATION}ms per step`;

    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Step",
          buttons: [
            {
              label: "Scroll → top",
              onClick: () => {
                const sc = findScroller(result.tableContainer);
                if (sc) sc.scrollTop = 0;
              },
            },
            {
              label: "Scroll → mid (4000px)",
              onClick: () => {
                const sc = findScroller(result.tableContainer);
                if (sc) sc.scrollTop = 4000;
              },
            },
            {
              label: "Scroll → bottom",
              onClick: () => {
                const sc = findScroller(result.tableContainer);
                if (sc) sc.scrollTop = sc.scrollHeight;
              },
            },
            {
              label: "Reverse columns",
              onClick: () => {
                const api = result.table.getAPI();
                const reversed = [...api.getHeaders()].reverse();
                result.table.update({ defaultHeaders: reversed });
              },
            },
            {
              label: "Reset all",
              onClick: () => {
                const sc = findScroller(result.tableContainer);
                if (sc) sc.scrollTop = 0;
                result.table.update({ defaultHeaders: createHeaders() });
              },
            },
          ],
        },
      ],
      result.tableContainer,
    );

    addParagraph(
      result.wrapper,
      "Scrolls to several positions, reordering at each. Each animation runs at " +
        `${SLOW_DURATION}ms so the FLIP transitions are obvious.`,
      result.tableContainer,
    );

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const status =
      canvasElement.querySelector<HTMLElement>("div[style*='background: #f4f6fb']") ??
      document.createElement("div");
    await sleep(BEAT);
    const table = getTable();
    const api = table.getAPI();
    const original = api.getHeaders();
    const scroller = findScroller(canvasElement);
    expect(scroller).toBeTruthy();

    const positions: Array<{ label: string; top: number }> = [
      { label: "top", top: 0 },
      { label: "mid (4000px)", top: 4000 },
      { label: "deep (10000px)", top: 10000 },
    ];

    let order = original;
    for (let i = 0; i < positions.length; i++) {
      const { label, top } = positions[i];
      announce(status, `Step ${i + 1}/${positions.length} · Scrolling to ${label}…`);
      scroller!.scrollTop = top;
      await sleep(400);

      announce(status, `Step ${i + 1}/${positions.length} · Reversing columns at ${label}…`);
      order = [...order].reverse();
      table.update({ defaultHeaders: order });
      await tickFrames(2);
      expect(countAnimating(canvasElement)).toBeGreaterThan(50);
      await sleep(SETTLE_PAUSE);
      expect(countGhosts(canvasElement)).toBe(0);
    }

    announce(status, "Restoring scroll & order…");
    scroller!.scrollTop = 0;
    table.update({ defaultHeaders: original });
    await sleep(SETTLE_PAUSE);
    announce(status, "Done.");
    expect(countGhosts(canvasElement)).toBe(0);
  },
};

/**
 * Strict per-cell FLIP correctness check at scale: when reversing 30 columns,
 * every sampled cell's transform on the synchronously-set "First" frame must
 * exactly equal `oldLeft - newLeft`. Catches regressions where the snapshot
 * is captured against the post-mutation layout, where preLayouts overwrites
 * live DOM positions, or where some cells get skipped from the FLIP pass.
 */
export const ReorderAtScaleAnimatesFromPreviousPositionPerCell = {
  render: () => {
    const result = renderConstrainedTable(createHeaders(), createData(), {
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Strict FLIP correctness · ${COLUMN_COUNT} cols × ${ROW_COUNT} rows`;
    addParagraph(
      result.wrapper,
      "Reverses the columns, then synchronously reads each sampled cell's transform " +
        "and asserts it equals (oldLeft - newLeft). Cells that move in different " +
        "directions must produce transforms with opposite signs.",
    );
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await sleep(BEAT);
    const status =
      canvasElement.querySelector<HTMLElement>("div[style*='background: #f4f6fb']") ??
      document.createElement("div");

    const sampledAccessors = [
      "id",
      "col_0",
      "col_3",
      "col_10",
      "col_15",
      "col_20",
      "col_25",
      "col_29",
    ];
    const ROW_INDEX = 0;

    const beforeLefts = new Map<string, number>();
    for (const accessor of sampledAccessors) {
      const cell = findCellByRowIndexAndAccessor(canvasElement, ROW_INDEX, accessor);
      if (!cell) continue;
      beforeLefts.set(accessor, parseFloat(cell.style.left || "0"));
    }
    if (beforeLefts.size < 2) {
      throw new Error(
        `Need at least 2 sampled cells in DOM before reorder, got ${beforeLefts.size}. ` +
          `(If column virtualization starts culling, this test needs to refocus on visible cells.)`,
      );
    }

    announce(status, "Reversing all columns and reading FLIP first-frame transforms…");
    const table = getTable();
    const original = table.getAPI().getHeaders();
    table.update({ defaultHeaders: [...original].reverse() });

    const samples: Array<{
      accessor: string;
      oldLeft: number;
      newLeft: number;
      txX: number;
      direction: "right" | "left" | "still";
    }> = [];

    for (const accessor of sampledAccessors) {
      if (!beforeLefts.has(accessor)) continue;
      const cell = findCellByRowIndexAndAccessor(canvasElement, ROW_INDEX, accessor);
      if (!cell) continue;
      const oldLeft = beforeLefts.get(accessor)!;
      const newLeft = parseFloat(cell.style.left || "0");
      const txX = parseTranslateX(cell.style.transform);
      let direction: "right" | "left" | "still" = "still";
      if (newLeft - oldLeft > 0.5) direction = "right";
      else if (newLeft - oldLeft < -0.5) direction = "left";
      samples.push({ accessor, oldLeft, newLeft, txX, direction });
    }

    const summary = samples
      .map(
        (s) =>
          `${s.accessor}: old=${s.oldLeft} new=${s.newLeft} ` +
          `expectedDx=${s.oldLeft - s.newLeft} actualDx=${s.txX} dir=${s.direction}`,
      )
      .join(" | ");

    for (const s of samples) {
      const expected = s.oldLeft - s.newLeft;
      if (Math.abs(s.txX - expected) >= 1.5) {
        throw new Error(
          `FLIP dx mismatch for "${s.accessor}" (expected ${expected}, got ${s.txX}). ${summary}`,
        );
      }
    }

    const movedRight = samples.filter((s) => s.direction === "right");
    const movedLeft = samples.filter((s) => s.direction === "left");
    if (movedRight.length === 0) {
      throw new Error(`Reverse should move some cells right; samples: ${summary}`);
    }
    if (movedLeft.length === 0) {
      throw new Error(`Reverse should move some cells left; samples: ${summary}`);
    }
    for (const s of movedRight) {
      if (s.txX >= 0) {
        throw new Error(
          `Cell "${s.accessor}" moves right (old=${s.oldLeft} → new=${s.newLeft}) so its ` +
            `FLIP transform-X must be negative, got ${s.txX}. ${summary}`,
        );
      }
    }
    for (const s of movedLeft) {
      if (s.txX <= 0) {
        throw new Error(
          `Cell "${s.accessor}" moves left (old=${s.oldLeft} → new=${s.newLeft}) so its ` +
            `FLIP transform-X must be positive, got ${s.txX}. ${summary}`,
        );
      }
    }

    await sleep(SETTLE_PAUSE);
    announce(status, "Done.");
    expect(countGhosts(canvasElement)).toBe(0);
  },
};

/**
 * Sort marathon. With `getRowId` providing stable identities, sort now
 * triggers FLIP slides: persistent rows slide to their new tops, rows
 * sorting out of the visible band slide out past the viewport edge as
 * retained ghosts, rows sorting into the band slide in from below/above.
 *
 * After each sort settles (we wait past SLOW_DURATION) there must be no
 * leftover ghosts, transforms, or stuck transitions.
 */
export const SortMarathon = {
  render: () => {
    const result = renderConstrainedTable(createHeaders(), createData(), {
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Sort marathon · ${ROW_COUNT} rows × ${COLUMN_COUNT} cols`;

    addControlPanel(
      result.wrapper,
      [
        {
          heading: "Sort col_0",
          buttons: [
            {
              label: "Desc",
              onClick: () => {
                void result.table.getAPI().applySortState({ accessor: "col_0", direction: "desc" });
              },
            },
            {
              label: "Asc",
              onClick: () => {
                void result.table.getAPI().applySortState({ accessor: "col_0", direction: "asc" });
              },
            },
            {
              label: "Clear",
              onClick: () => {
                void result.table.getAPI().applySortState();
              },
            },
          ],
        },
      ],
      result.tableContainer,
    );

    addParagraph(
      result.wrapper,
      `Each sort animates over ${SLOW_DURATION}ms. Watch rows slide vertically — ` +
        "rows sorting out of view slide past the bottom edge as retained ghosts and " +
        "are then removed; rows sorting into view slide in from off-screen.",
      result.tableContainer,
    );

    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const status =
      canvasElement.querySelector<HTMLElement>("div[style*='background: #f4f6fb']") ??
      document.createElement("div");
    await sleep(BEAT);
    const table = getTable();

    const sequence: Array<{
      label: string;
      sort: { accessor: string; direction: "asc" | "desc" } | undefined;
    }> = [
      { label: "col_0 desc", sort: { accessor: "col_0", direction: "desc" } },
      { label: "col_0 asc", sort: { accessor: "col_0", direction: "asc" } },
      { label: "col_5 desc", sort: { accessor: "col_5", direction: "desc" } },
      { label: "cleared", sort: undefined },
    ];

    for (let i = 0; i < sequence.length; i++) {
      const { label, sort } = sequence[i];
      announce(status, `Step ${i + 1}/${sequence.length} · Sorting ${label}…`);
      void table.getAPI().applySortState(sort);
      // SETTLE_PAUSE outlasts the slide so retained ghosts are torn down.
      await sleep(SETTLE_PAUSE);
      expect(countGhosts(canvasElement)).toBe(0);
      const cells = canvasElement.querySelectorAll<HTMLElement>(`.st-body-main .st-cell`);
      expect(cells.length).toBeGreaterThan(0);
      cells.forEach((cell) => {
        const t = cell.style.transform;
        expect(t === "" || t === "none").toBe(true);
      });
    }

    announce(status, "Done.");
  },
};
