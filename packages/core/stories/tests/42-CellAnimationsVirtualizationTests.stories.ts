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
 *   - Outgoing cells (in DOM before, off-screen after) are retained as
 *     `data-animating-out` ghosts and slide to their true post-change
 *     off-screen position before being removed — visually they appear to
 *     slide out past the viewport edge.
 *
 * Animate-out into virtualized space is regression-tested in four flavours:
 *   1. Vertical / downward (sort col_0 desc at scrollTop=0): top-band rows
 *      sort to the bottom of the table → ghosts slide DOWN past bottom edge.
 *      → {@link SortRetainsCellsThatExitVirtualizedBand}
 *   2. Vertical / upward (sort col_0 desc while scrolled to bottom): visible
 *      bottom-band rows sort to the top of the table → ghosts slide UP past
 *      top edge.
 *      → {@link SortRetainsCellsThatExitUpwardWhenScrolled}
 *   3. Vertical / re-aim mid-flight (rapid double sort): cells already
 *      animating out from a first sort must be re-aimed by a second sort
 *      that fires before the first finishes, with all ghosts torn down once
 *      everything settles.
 *      → {@link OverlappingSortsRetainAndReaimGhosts}
 *   4. Horizontal / leftward (column reverse at right-most scrollLeft):
 *      visible right-side cells reorder to the left side of the table → if
 *      the new `left` is outside `getVisibleBodyCells`'s post-reorder band,
 *      the cells are retained as ghosts that slide LEFT past the viewport
 *      edge.
 *      → {@link ReorderAfterHorizontalScrollRetainsExitingCellsAsGhosts}
 *
 * Why horizontal animate-out only manifests under horizontal scroll: at
 * scrollLeft=0, `getVisibleBodyCells` keeps every non-pinned cell in the
 * DOM (the visible band's right edge equals scrollLeft + mainWidth, which
 * is the full content width), so column reorder never *removes* a cell —
 * the same DOM node persists and slides to its new `left` via FLIP, with
 * the body's overflow clipping the off-screen portion. Once scrollLeft > 0
 * the band shifts and reorders can push cells outside it; that's when the
 * outgoing ghost path kicks in horizontally as well.
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
const SLOW_DURATION = 15000;
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

/**
 * Loose, "is-armed-for-animation" check — does the cell's INLINE style currently
 * carry a transform-transition and a translate transform? This is satisfied
 * the instant `startTransition` runs, even if the browser never actually
 * interpolates the transform (e.g. because the FLIP "First" frame was never
 * painted, so the browser's transition starts from identity → identity and
 * the cell snaps). PREFER {@link countActuallyAnimating} for assertions —
 * this one is kept only for legacy callers / settle-state checks.
 */
const countAnimatingArmed = (canvasElement: HTMLElement): number => {
  return Array.from(canvasElement.querySelectorAll<HTMLElement>(`.st-body-main .st-cell`)).filter(
    (el) => el.style.transition.includes("transform") && el.style.transform.includes("translate"),
  ).length;
};

/**
 * The 2D translation component of `getComputedStyle(el).transform`. Returns
 * { tx, ty } in CSS pixels. During a real CSS transition this returns the
 * INTERPOLATED matrix (non-identity mid-flight). When no transition is in
 * progress, returns { tx: 0, ty: 0 } for `none` / identity matrices.
 */
const readComputedTranslate = (el: HTMLElement): { tx: number; ty: number } => {
  const t = window.getComputedStyle(el).transform;
  if (!t || t === "none") return { tx: 0, ty: 0 };
  const m = t.match(/matrix\(([^)]+)\)/);
  if (m) {
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    if (parts.length >= 6) return { tx: parts[4], ty: parts[5] };
  }
  const m3d = t.match(/matrix3d\(([^)]+)\)/);
  if (m3d) {
    const parts = m3d[1].split(",").map((p) => parseFloat(p.trim()));
    if (parts.length >= 14) return { tx: parts[12], ty: parts[13] };
  }
  return { tx: 0, ty: 0 };
};

/**
 * Strict "cells are visually animating right now" check. A cell counts as
 * actually animating only if its COMPUTED transform has a non-trivial
 * translation — i.e. the browser is mid-interpolation between two transform
 * values. Use this anywhere you would be tempted to use
 * {@link countAnimatingArmed}: it catches the common bug where every cell
 * gets a transform-transition assigned but the FLIP "First" frame was lost
 * (so the browser snaps instead of tweening).
 */
const countActuallyAnimating = (canvasElement: HTMLElement, minTranslate = 1): number => {
  return Array.from(canvasElement.querySelectorAll<HTMLElement>(`.st-body-main .st-cell`)).filter(
    (el) => {
      const { tx, ty } = readComputedTranslate(el);
      return Math.abs(tx) >= minTranslate || Math.abs(ty) >= minTranslate;
    },
  ).length;
};

/**
 * Sample each cell's on-screen bounding rect now and again after `frames`
 * RAFs, returning the cells whose visual position actually changed. This is
 * the gold-standard "did anything move on screen" check — it doesn't care
 * about styles or transforms, only about pixels.
 */
const sampleVisuallyMovingCells = async (
  canvasElement: HTMLElement,
  frames: number,
  minDelta = 1,
): Promise<{ moved: number; sampled: number; maxDx: number; maxDy: number }> => {
  const cells = Array.from(canvasElement.querySelectorAll<HTMLElement>(`.st-body-main .st-cell`));
  const before = cells.map((el) => el.getBoundingClientRect());
  await tickFrames(frames);
  const after = cells.map((el) => el.getBoundingClientRect());
  let moved = 0;
  let maxDx = 0;
  let maxDy = 0;
  for (let i = 0; i < cells.length; i++) {
    const dx = after[i].left - before[i].left;
    const dy = after[i].top - before[i].top;
    if (Math.abs(dx) >= minDelta || Math.abs(dy) >= minDelta) moved++;
    if (Math.abs(dx) > Math.abs(maxDx)) maxDx = dx;
    if (Math.abs(dy) > Math.abs(maxDy)) maxDy = dy;
  }
  return { moved, sampled: cells.length, maxDx, maxDy };
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

const parseTranslateY = (transform: string): number => {
  if (!transform || transform === "none") return 0;
  // translate3d(<x>, <y>, <z>) or translate(<x>, <y>) — pull the Y component.
  const t3d = transform.match(/translate3d\(\s*-?\d+(?:\.\d+)?px\s*,\s*(-?\d+(?:\.\d+)?)px/);
  if (t3d) return parseFloat(t3d[1]);
  const t2d = transform.match(/translate\(\s*-?\d+(?:\.\d+)?px\s*,\s*(-?\d+(?:\.\d+)?)px/);
  if (t2d) return parseFloat(t2d[1]);
  // matrix(a, b, c, d, tx, ty) — pull ty (6th component).
  const m = transform.match(
    /matrix\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*(-?\d+(?:\.\d+)?)/,
  );
  return m ? parseFloat(m[1]) : 0;
};

// ============================================================================
// STORIES
// ============================================================================

/**
 * Large-scale reorder round-trip: reverse → reset on a 30-col × 500-row
 * table, asserting that >50 cells are mid-flight after each step and that
 * everything settles cleanly with no leftover ghosts.
 *
 * Strict per-cell FLIP transform-X correctness on a contained neighbour
 * swap is covered by `ContainedNeighborSwapAnimation` (immediately below)
 * on the same constrained table, so we don't repeat it here.
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

    announce(status, "Step 1/2 · Reversing all columns…");
    table.update({ defaultHeaders: [...original].reverse() });
    // 5 RAFs ≈ 80ms — well past the double-rAF FLIP "First"/"Play" handoff
    // and into the active transition window (animationDuration=1500ms).
    await tickFrames(5);
    expect(countActuallyAnimating(canvasElement)).toBeGreaterThan(50);
    await sleep(SETTLE_PAUSE);
    expect(countGhosts(canvasElement)).toBe(0);

    announce(status, "Step 2/2 · Resetting to original order…");
    await sleep(BEAT);
    table.update({ defaultHeaders: original });
    await tickFrames(5);
    expect(countActuallyAnimating(canvasElement)).toBeGreaterThan(50);
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

    // Two extremes are enough to prove the snapshot tracks the visible band
    // wherever the user has scrolled — a mid-table position is just a point
    // between these two and adds no behavioural coverage.
    const positions: Array<{ label: string; top: number }> = [
      { label: "top", top: 0 },
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
      // Wait long enough for the FLIP `play` RAF to fire and the browser to
      // start interpolating, but well short of SLOW_DURATION so cells are
      // still mid-flight. 5 RAFs ≈ 80ms, vs. animationDuration=1500ms.
      await tickFrames(5);

      // Strict computed-style check: cells must have a non-identity transform
      // applied by the browser's transition. `countAnimatingArmed` would lie
      // here if the FLIP "First" frame was lost (cells get the transition
      // assigned but snap instantly).
      const armed = countAnimatingArmed(canvasElement);
      const animating = countActuallyAnimating(canvasElement);
      if (animating <= 50) {
        throw new Error(
          `Step ${i + 1}/${positions.length} at ${label}: cells did NOT visually animate. ` +
            `Armed (transition assigned) = ${armed}, ` +
            `actually-tweening (computed transform != identity) = ${animating}. ` +
            `If armed >> animating, the FLIP "First" frame is being lost — the ` +
            `transform-transition is set but the browser snaps from identity to ` +
            `identity instead of interpolating from the inverted start.`,
        );
      }

      // Independent gold-standard check: do the cells' on-screen rects
      // actually change between paints? This proves the animation is real
      // regardless of how it's implemented.
      const movement = await sampleVisuallyMovingCells(canvasElement, 5);
      if (movement.moved < 20) {
        throw new Error(
          `Step ${i + 1}/${positions.length} at ${label}: cells did NOT visually move ` +
            `between paints. moved=${movement.moved}/${movement.sampled}, ` +
            `maxDx=${movement.maxDx.toFixed(2)}px, maxDy=${movement.maxDy.toFixed(2)}px.`,
        );
      }

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
 * Per-cell FLIP correctness check at scale.
 *
 * When reversing 30 columns:
 *   - Cells whose pre-reverse position is currently on-screen (or whose true
 *     journey fits within ~one viewport) must FLIP exactly to that position
 *     (`txX === oldLeft - newLeft` to within sub-pixel rounding).
 *   - Cells whose pre-reverse position is far off-screen are scaled by
 *     `AnimationCoordinator.scaleFlipDistance` so the visible slide stays
 *     bounded. For those, we relax the strict equality to: same sign as the
 *     true journey, magnitude < the true journey, and magnitude inside the
 *     `[viewport, ~2 × viewport]` band the scaler produces.
 *
 * Catches regressions where the snapshot is captured against the post-
 * mutation layout, where preLayouts overwrites live DOM positions, where
 * some cells get skipped from the FLIP pass, or where horizontal scaling
 * collapses the journey too aggressively (e.g. dropping it to 0).
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
        "and asserts on-screen sources FLIP exactly while far off-screen sources " +
        "are scaled to a bounded but sign-correct slide.",
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

    const mainBody = canvasElement.querySelector<HTMLElement>(".st-body-main");
    expect(mainBody, "Need .st-body-main for viewport bounds").toBeTruthy();
    const scrollLeftPre = mainBody!.scrollLeft;
    const clientWidth = mainBody!.clientWidth;

    const beforeLefts = new Map<string, { left: number; width: number }>();
    for (const accessor of sampledAccessors) {
      const cell = findCellByRowIndexAndAccessor(canvasElement, ROW_INDEX, accessor);
      if (!cell) continue;
      beforeLefts.set(accessor, {
        left: parseFloat(cell.style.left || "0"),
        width: cell.offsetWidth || parseFloat(cell.style.width || "0"),
      });
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
      cellWidth: number;
      txX: number;
      direction: "right" | "left" | "still";
    }> = [];

    for (const accessor of sampledAccessors) {
      const before = beforeLefts.get(accessor);
      if (!before) continue;
      const cell = findCellByRowIndexAndAccessor(canvasElement, ROW_INDEX, accessor);
      if (!cell) continue;
      const newLeft = parseFloat(cell.style.left || "0");
      const txX = parseTranslateX(cell.style.transform);
      let direction: "right" | "left" | "still" = "still";
      if (newLeft - before.left > 0.5) direction = "right";
      else if (newLeft - before.left < -0.5) direction = "left";
      samples.push({
        accessor,
        oldLeft: before.left,
        newLeft,
        cellWidth: before.width,
        txX,
        direction,
      });
    }

    const summary = samples
      .map(
        (s) =>
          `${s.accessor}: old=${s.oldLeft} new=${s.newLeft} ` +
          `expectedDx=${s.oldLeft - s.newLeft} actualDx=${s.txX} dir=${s.direction}`,
      )
      .join(" | ");

    // Mirror the predicate in `scaleFlipDistance`: a cell is scaled iff its
    // pre-reverse position is OUTSIDE the live viewport AND the raw journey
    // exceeds the viewport+cell band. Otherwise the scaler passes through
    // and the FLIP must equal the true journey exactly.
    const isScaled = (s: (typeof samples)[number]): boolean => {
      const buffer = s.cellWidth > 0 ? s.cellWidth : 0;
      const inViewport =
        s.oldLeft >= scrollLeftPre - buffer && s.oldLeft <= scrollLeftPre + clientWidth;
      if (inViewport) return false;
      const visibleRange = clientWidth + buffer;
      return Math.abs(s.oldLeft - s.newLeft) > visibleRange;
    };

    for (const s of samples) {
      const expected = s.oldLeft - s.newLeft;
      if (!isScaled(s)) {
        if (Math.abs(s.txX - expected) >= 1.5) {
          throw new Error(
            `FLIP dx mismatch for "${s.accessor}" (expected ${expected}, got ${s.txX}). ${summary}`,
          );
        }
        continue;
      }

      // Scaled cells: the visible slide is bounded by the scaler. Magnitude
      // must be (a) sign-correct, (b) at least one viewport (since the
      // scaler floor is `visibleRange` before the asymptotic overshoot is
      // added), (c) strictly less than the unscaled journey, and (d)
      // bounded above by `visibleRange + maxOvershoot ≈ 2× clientWidth`
      // plus a small slack for cell-buffer math.
      const expectedSign = Math.sign(expected);
      const actualSign = Math.sign(s.txX);
      if (expectedSign !== 0 && actualSign !== expectedSign) {
        throw new Error(
          `FLIP dx sign wrong for scaled "${s.accessor}" (expected sign ${expectedSign}, got ${actualSign}). ${summary}`,
        );
      }
      const absTx = Math.abs(s.txX);
      const absExpected = Math.abs(expected);
      const visibleRange = clientWidth + s.cellWidth;
      if (absTx >= absExpected) {
        throw new Error(
          `Scaled FLIP dx for "${s.accessor}" should be smaller than the unscaled journey ` +
            `(|tx|=${absTx} vs |expected|=${absExpected}). ${summary}`,
        );
      }
      if (absTx < visibleRange - 1) {
        throw new Error(
          `Scaled FLIP dx for "${s.accessor}" should be at least one viewport (~${visibleRange}px), ` +
            `got |tx|=${absTx}. ${summary}`,
        );
      }
      const maxAllowed = clientWidth * 2 + s.cellWidth + 50;
      if (absTx > maxAllowed) {
        throw new Error(
          `Scaled FLIP dx for "${s.accessor}" exceeds the bounded slide window ` +
            `(|tx|=${absTx} > maxAllowed=${maxAllowed}). ${summary}`,
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

    // The whole point of horizontal scaling is to bound far-column journeys.
    // Verify at least one of the sampled cells actually got scaled — without
    // this the test would silently regress to "pure FLIP" if scaling is
    // disabled or the predicate breaks.
    const scaledCount = samples.filter(isScaled).length;
    if (scaledCount === 0) {
      throw new Error(
        `Expected at least one sampled cell to be scaled (oldLeft outside viewport ` +
          `with |dx| > viewport+cellWidth). samples: ${summary}`,
      );
    }

    await sleep(SETTLE_PAUSE);
    announce(status, "Done.");
    expect(countGhosts(canvasElement)).toBe(0);
  },
};

/**
 * Sort cleanup at scale. Verifies that after a sort animation settles on a
 * 500-row × 30-col table, every retained ghost is torn down and no cell is
 * left with a stuck transform or transition.
 *
 * Per-sort FLIP correctness, ghost retention, mid-flight re-aim, and the
 * upward / horizontal exit cases each have their own focused regression
 * tests below — this one only proves cleanup holds at scale across a
 * round-trip (sort → clear).
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

    const assertSettledAndClean = (): void => {
      expect(countGhosts(canvasElement)).toBe(0);
      const cells = Array.from(
        canvasElement.querySelectorAll<HTMLElement>(`.st-body-main .st-cell`),
      );
      expect(cells.length).toBeGreaterThan(0);
      // Aggregate per-cell checks into a single expect call. Per-cell
      // expects on this 30-col × 500-row table generate hundreds of
      // Storybook interactions per assertion, which lags the browser.
      const stuck = cells.filter((c) => c.style.transform && c.style.transform !== "none");
      expect(stuck.length, `cells with leftover transform after settle`).toBe(0);
    };

    announce(status, "Sorting col_0 desc…");
    void table.getAPI().applySortState({ accessor: "col_0", direction: "desc" });
    await sleep(SETTLE_PAUSE);
    assertSettledAndClean();

    announce(status, "Clearing sort…");
    void table.getAPI().applySortState();
    await sleep(SETTLE_PAUSE);
    assertSettledAndClean();

    announce(status, "Done.");
  },
};

/**
 * REGRESSION TEST FOR ANIMATE-OUT INTO VIRTUALIZED SPACE.
 *
 * When a sort moves a *currently visible* row to a position that's outside
 * the visible band (e.g. row at position 0 sorts to position 499 in a 500
 * row table), the cell for that row should NOT be removed from the DOM
 * immediately. Instead the renderer should hand it to the animation
 * coordinator as a retained "ghost" that:
 *
 *   1. Stays in the DOM with `data-animating-out="true"`.
 *   2. Has its `style.top` updated to its new (off-screen) position.
 *   3. Plays a FLIP slide from its old (on-screen) position to that new
 *      off-screen position. The body's `overflow: hidden` clips the part
 *      that crosses the viewport edge, so it visually appears to slide
 *      out past the bottom edge.
 *   4. Is removed from the DOM only after the slide completes.
 *
 * If the cell is dropped immediately, the user sees it pop out of existence
 * in place — a visible jank during sort.
 *
 * The test grabs any cell in the top-most visible row, records its on-screen
 * rect, triggers a sort that pushes it far off-screen, and then samples
 * shortly after — well before the long animation could finish. With a
 * working slide-out, the cell is still in the DOM and visually only a small
 * fraction of the way to its new position. With a broken slide-out, the
 * cell is either missing from the DOM (removed instantly) or already at its
 * far-off-screen target (snapped). After the animation settles we also
 * confirm the ghost was cleaned up.
 */
export const SortRetainsCellsThatExitVirtualizedBand = {
  tags: ["sort-retains-virtualized-ghosts"],
  render: () => {
    const result = renderConstrainedTable(createHeaders(), createData(), {
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Sort retains off-screen cells as ghosts · ${SLOW_DURATION}ms`;
    addParagraph(
      result.wrapper,
      "When a sort pushes the top-most visible row off-screen, the cell must " +
        "stay in the DOM and slide visually toward its new position — not pop " +
        "out in place and not snap straight to the destination.",
      result.tableContainer,
    );
    return result.wrapper;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await sleep(BEAT);
    const table = getTable();

    // Pick any cell in row 0 — sorting `col_0 desc` makes col_0=0 (the
    // lowest value, which is row 0's value) sort to position 499 of 500,
    // far below the viewport.
    const cell = canvasElement.querySelector<HTMLElement>(
      `.st-body-main .st-cell[data-row-index="0"]`,
    );
    expect(cell, "Need a row-0 cell to track").toBeTruthy();

    // The viewport-relative rect of the cell BEFORE the sort. With a working
    // slide-out animation, sampling shortly after the sort starts must show
    // the cell still in the DOM and visually CLOSE to this position — only a
    // small fraction of the way toward its eventual far-off-screen
    // destination. With a broken slide-out the cell is either:
    //   - missing from the DOM entirely (no retain), OR
    //   - already at its post-sort `top` thousands of pixels below the
    //     viewport (snap instead of interpolate).
    const rectBefore = cell!.getBoundingClientRect();

    expect(countGhosts(canvasElement)).toBe(0);

    void table.getAPI().applySortState({ accessor: "col_0", direction: "desc" });

    // Sample shortly after the sort fires. With a 20s animation, ~500ms is
    // 2.5% of total time — even with aggressive ease-out, a real slide-out
    // should still be visually within a few hundred pixels of its starting
    // position. The cap (1/40 of the animation budget) keeps this honest if
    // someone changes SLOW_DURATION.
    const SAMPLE_AT_MS = Math.min(500, Math.floor(SLOW_DURATION / 40));
    await sleep(SAMPLE_AT_MS);

    if (!cell!.isConnected) {
      throw new Error(
        `Row-0 cell was removed from the DOM ${SAMPLE_AT_MS}ms into a ${SLOW_DURATION}ms ` +
          `sort animation. It should remain mounted as a 'data-animating-out' ghost ` +
          `until the FLIP slide-out completes — not pop out in place.`,
      );
    }

    // Direct "is the cell roughly where it was?" assertion. This is the
    // user-visible behaviour: when a sort starts, the cells the user can
    // currently see should not jerk to a completely different spot in a
    // single frame.
    const rectAfter = cell!.getBoundingClientRect();
    const dx = Math.abs(rectAfter.left - rectBefore.left);
    const dy = Math.abs(rectAfter.top - rectBefore.top);

    // Generous bound: at 2.5% of a 20s slide with cubic-bezier(0.2, 0.8,
    // 0.2, 1), the cell will have moved a few hundred pixels at most. A
    // snap straight to row 499 is 14000+px. Half a viewport height
    // comfortably distinguishes the two without flaking on slow CI.
    const MAX_DRIFT_PX = VIEWPORT_HEIGHT / 2;
    if (dy > MAX_DRIFT_PX || dx > MAX_DRIFT_PX) {
      const styleTop = parseFloat(cell!.style.top || "0");
      throw new Error(
        `Row-0 cell jumped ${dy.toFixed(0)}px vertically (${dx.toFixed(0)}px ` +
          `horizontally) ${SAMPLE_AT_MS}ms into a ${SLOW_DURATION}ms sort animation. ` +
          `Max allowed drift is ${MAX_DRIFT_PX}px — anything more means the cell ` +
          `snapped to its post-sort destination instead of interpolating from its ` +
          `pre-sort position. ` +
          `before={left:${rectBefore.left.toFixed(0)}, top:${rectBefore.top.toFixed(0)}} ` +
          `after={left:${rectAfter.left.toFixed(0)}, top:${rectAfter.top.toFixed(0)}} ` +
          `style.top=${styleTop} dataAnimatingOut=${cell!.getAttribute("data-animating-out")}`,
      );
    }

    // Direction sanity: any movement should be DOWNWARD (row 0 is sorting
    // toward the bottom of the table). A negative dy with magnitude beyond
    // a couple of pixels would mean the cell went the wrong way.
    expect(
      rectAfter.top - rectBefore.top,
      "Cell should be sliding downward (or barely moved), not upward",
    ).toBeGreaterThanOrEqual(-2);

    // (Ghost teardown is covered by `OverlappingSortsRetainAndReaimGhosts`
    // and the other settle-state tests below — keeping this test focused
    // on the user-visible "is the cell still mid-slide?" question lets it
    // run quickly even when SLOW_DURATION is bumped way up for debugging.)
  },
};

/**
 * REGRESSION TEST FOR ANIMATE-OUT WHEN SCROLLED — UP DIRECTION.
 *
 * Companion to {@link SortRetainsCellsThatExitVirtualizedBand} that exercises
 * cells exiting via the *top* of the viewport rather than the bottom.
 *
 * If you scroll mid-way through the table and then sort, rows that are
 * currently visible can be sorted to a position ABOVE the visible band (i.e.
 * a small `top` value while the scroller is at a large `scrollTop`). The
 * cells representing those rows must still be retained as ghosts and slide
 * UPWARD past the top edge — not pop out in place.
 *
 * Concretely: scroll to the bottom of the table (rows ~485–499 visible),
 * then sort `col_0 desc` (descending by col_0 value, where row-0 has the
 * lowest value). The currently-visible rows have HIGH col_0 values, so on
 * desc they sort to the TOP of the table (small `top`). Their old visual
 * position was below the viewport edge of the scroller; their new visual
 * position is above it. They must be retained and slide upward, with an
 * inverse FLIP `transform` whose Y component is positive (= old.top -
 * new.top, where old > new ⇒ tx_y > 0).
 */
export const SortRetainsCellsThatExitUpwardWhenScrolled = {
  tags: ["sort-retains-virtualized-ghosts-up"],
  render: () => {
    const result = renderConstrainedTable(createHeaders(), createData(), {
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Sort retains off-screen cells (upward) · scrolled · ${SLOW_DURATION}ms`;
    addParagraph(
      result.wrapper,
      "Scrolls to the bottom of the table, then sorts so the currently-visible " +
        "rows fly to the top of the table. The cells representing those rows must " +
        "remain in the DOM as `data-animating-out` ghosts and slide upward — not " +
        "pop out in place.",
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

    // Scroll to the bottom of the body so the visible band is at the END of
    // the dataset (rows ~485–499). After `col_0 desc`, row-499 (highest
    // col_0 value) sorts to position 0 — a vertical jump of ~14000px UP.
    const scroller = findScroller(canvasElement);
    expect(scroller, "Need a horizontal/vertical scroller").toBeTruthy();
    scroller!.scrollTop = scroller!.scrollHeight;
    // Wait for the scroll-driven re-render so the visible band reflects the
    // bottom of the table.
    await tickFrames(4);
    await sleep(200);

    const sampleCell = canvasElement.querySelector<HTMLElement>(
      `.st-body-main .st-cell[data-accessor="id"]`,
    );
    expect(sampleCell, "Need at least one rendered cell after scroll").toBeTruthy();
    const rowHeight = parseFloat(sampleCell!.style.height || "0");
    expect(rowHeight, "row height should be > 0").toBeGreaterThan(0);

    // Capture ALL visible id cells with their pre-sort `top`. After the
    // sort these cells should be retained as ghosts at much smaller `top`
    // values (because they jumped to the top of the table).
    const visibleIdCells = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(`.st-body-main .st-cell[data-accessor="id"]`),
    ).filter((c) => !c.hasAttribute("data-animating-out"));

    const beforeByText = new Map<string, { top: number }>();
    for (const c of visibleIdCells) {
      const text = c.textContent?.trim() ?? "";
      if (!text) continue;
      beforeByText.set(text, { top: parseFloat(c.style.top || "0") });
    }
    expect(
      beforeByText.size,
      "Need several visible bottom-band id cells to track pre-sort",
    ).toBeGreaterThan(2);

    // All sampled cells should currently be near the bottom of the dataset.
    const minPreSortTop = Math.min(...Array.from(beforeByText.values()).map((v) => v.top));
    expect(minPreSortTop).toBeGreaterThan(VIEWPORT_HEIGHT * 10);

    expect(countGhosts(canvasElement)).toBe(0);

    announce(status, "Sorting col_0 desc — bottom rows should slide UP off-screen as ghosts…");

    // Sort. Bottom-band rows (high col_0) sort to TOP of table (small `top`).
    void table.getAPI().applySortState({ accessor: "col_0", direction: "desc" });

    // Synchronously inspect the DOM right after the sort.
    const ghosts = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(`.st-body-main [data-animating-out="true"]`),
    );

    if (ghosts.length === 0) {
      throw new Error(
        `Expected retained ghosts immediately after a sort that pushes scrolled-into-view ` +
          `rows to the top of the table, got 0. Bottom-band id cells [${Array.from(
            beforeByText.keys(),
          ).join(",")}] appear to have been removed from the DOM in place instead of being ` +
          `slid out as ghosts.`,
      );
    }

    const ghostsByText = new Map<string, HTMLElement>();
    for (const g of ghosts) {
      if (g.getAttribute("data-accessor") !== "id") continue;
      const text = g.textContent?.trim() ?? "";
      if (text) ghostsByText.set(text, g);
    }

    // Every tracked text must have a corresponding ghost.
    const missing: string[] = [];
    for (const text of beforeByText.keys()) {
      if (!ghostsByText.has(text)) missing.push(text);
    }
    if (missing.length > 0) {
      throw new Error(
        `Expected upward-sliding ghosts for [${Array.from(beforeByText.keys()).join(",")}], ` +
          `but [${missing.join(",")}] were missing. Found ghosts for: ` +
          `[${Array.from(ghostsByText.keys()).join(",")}].`,
      );
    }

    // Pick a sample ghost (first one with both before+after data) and
    // verify:
    //   - new `top` is near the TOP of the table (small absolute value),
    //     well below the scroller's current scrollTop.
    //   - inverse FLIP `transform` has positive Y component = old - new.
    //   - pointer-events: none.
    const scrollTopAtSort = scroller!.scrollTop;
    const summaries: string[] = [];
    let assertedAtLeastOne = false;
    for (const [text, before] of beforeByText.entries()) {
      const ghost = ghostsByText.get(text)!;
      const newTop = parseFloat(ghost.style.top || "0");
      const ty = parseTranslateY(ghost.style.transform);
      summaries.push(
        `${text}: oldTop=${before.top} newTop=${newTop} ty=${ty} pointer=${ghost.style.pointerEvents}`,
      );

      // newTop should be much smaller than scrollTopAtSort — proving the
      // ghost was repositioned to its new (upward) spot rather than left
      // in place near the bottom.
      if (!(newTop < scrollTopAtSort - 5 * rowHeight)) {
        throw new Error(
          `Ghost for row "${text}" should have its style.top moved well above the ` +
            `current scrollTop (${scrollTopAtSort}). Got newTop=${newTop}. ` +
            `Summaries: ${summaries.join(" | ")}`,
        );
      }

      const expectedTy = before.top - newTop;
      if (Math.abs(ty - expectedTy) >= 1.5) {
        throw new Error(
          `Ghost for row "${text}" has wrong FLIP ty: expected ${expectedTy} (oldTop - newTop), ` +
            `got ${ty}. Summaries: ${summaries.join(" | ")}`,
        );
      }
      if (ty <= 0) {
        throw new Error(
          `Ghost for row "${text}" sliding UP must have a POSITIVE FLIP ty (it visually ` +
            `starts below where it ends). Got ty=${ty}. Summaries: ${summaries.join(" | ")}`,
        );
      }

      expect(
        ghost.style.pointerEvents,
        `Ghost for "${text}" should have pointer-events: none while sliding`,
      ).toBe("none");

      assertedAtLeastOne = true;
    }
    expect(assertedAtLeastOne, "Should have asserted at least one ghost").toBe(true);

    await sleep(SETTLE_PAUSE);

    announce(status, "Verifying ghost cleanup after settle…");
    const ghostsAfterSettle = canvasElement.querySelectorAll(
      `.st-body-main [data-animating-out="true"]`,
    );
    expect(
      ghostsAfterSettle.length,
      `All ${ghosts.length} retained ghosts should be removed once the slide completes`,
    ).toBe(0);

    const activeCells = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        `.st-body-main .st-cell:not([data-animating-out])`,
      ),
    );
    const stuck = activeCells.filter((c) => c.style.transform && c.style.transform !== "none");
    expect(stuck.length, "active cells with leftover transform after settle").toBe(0);

    announce(status, "Done.");
  },
};

/**
 * REGRESSION TEST FOR ANIMATE-OUT WHEN SORTS OVERLAP.
 *
 * If the user clicks a sort header twice in rapid succession (toggling the
 * direction before the previous animation finishes), the second sort's
 * snapshot fires while the first sort's retained ghosts are still mid-flight.
 * Those mid-flight ghosts are themselves "currently visible" cells (as far
 * as the user is concerned) and should also be retained / re-aimed for the
 * second sort — not orphaned in place at the wrong position.
 *
 * The test:
 *   1. Sorts col_0 desc — capturing the wave of bottom-bound ghosts.
 *   2. Half-way through the slide, sorts col_0 asc — which should send
 *      everything back the other way.
 *   3. Verifies the active cells (now sorting back ascending) still get a
 *      FLIP transform (i.e. they slide rather than snap), and that all
 *      ghosts are torn down once both animations settle.
 */
export const OverlappingSortsRetainAndReaimGhosts = {
  tags: ["sort-overlap-retain"],
  render: () => {
    const result = renderConstrainedTable(createHeaders(), createData(), {
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Overlapping sorts re-aim retained ghosts · ${SLOW_DURATION}ms`;
    addParagraph(
      result.wrapper,
      "Triggers a sort, waits ~half the animation, then triggers the opposite " +
        "sort. Cells mid-slide must continue to animate (not snap or vanish), and " +
        "the system must still tear down every retained ghost once the dust settles.",
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

    expect(countGhosts(canvasElement)).toBe(0);

    announce(status, "Sort 1: col_0 desc…");
    void table.getAPI().applySortState({ accessor: "col_0", direction: "desc" });

    // Synchronously verify ghosts were created.
    const ghostsAfterFirstSort = canvasElement.querySelectorAll(
      `.st-body-main [data-animating-out="true"]`,
    );
    expect(
      ghostsAfterFirstSort.length,
      "First sort should retain ghosts for cells leaving the visible band",
    ).toBeGreaterThan(0);

    // Wait roughly half the slide so we land in the middle of the animation.
    await sleep(SLOW_DURATION / 2);

    // The first wave of ghosts should still be in flight.
    const midFlightGhosts = canvasElement.querySelectorAll(
      `.st-body-main [data-animating-out="true"]`,
    );
    expect(
      midFlightGhosts.length,
      "Ghosts should still be mid-slide halfway through the animation",
    ).toBeGreaterThan(0);

    announce(status, "Sort 2 (mid-flight): col_0 asc…");
    void table.getAPI().applySortState({ accessor: "col_0", direction: "asc" });

    // Synchronously after the second sort:
    //   - The new active cells (the rows now visible after asc) must carry a
    //     FLIP "First" transform — proving they were snapshot+inversed
    //     against their pre-asc visual positions rather than snapped.
    const activeCellsImmediately = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        `.st-body-main .st-cell:not([data-animating-out])`,
      ),
    );
    const transformedActive = activeCellsImmediately.filter((c) => {
      const t = c.style.transform;
      return t && t !== "none" && t.includes("translate");
    });
    if (transformedActive.length === 0) {
      throw new Error(
        `Expected active (non-ghost) cells to carry a FLIP "First" transform after the ` +
          `second sort, got 0. The second sort appears to have not captured a snapshot ` +
          `(or the snapshot didn't see the live mid-flight positions) so cells are now ` +
          `at their final positions with no slide-in.`,
      );
    }

    // Wait for everything to settle — both the first and second wave.
    await sleep(SETTLE_PAUSE);

    announce(status, "Verifying full cleanup after overlapping sorts settle…");
    const finalGhosts = canvasElement.querySelectorAll(`.st-body-main [data-animating-out="true"]`);
    expect(
      finalGhosts.length,
      `All retained ghosts should be removed once both sort animations finish`,
    ).toBe(0);

    const allCells = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(`.st-body-main .st-cell`),
    );
    const stuckOverlap = allCells.filter((c) => c.style.transform && c.style.transform !== "none");
    expect(
      stuckOverlap.length,
      "cells with leftover transform after overlapping sorts settle",
    ).toBe(0);

    announce(status, "Done.");
  },
};

/**
 * REGRESSION TEST FOR HORIZONTAL ANIMATE-OUT WHEN HORIZONTALLY SCROLLED.
 *
 * When the user has scrolled the body horizontally so that left-side
 * columns are outside the rendered cell band, then performs a column
 * reorder that pushes the *currently visible* right-side columns to the
 * left side, those right-side cells exit the band horizontally and need
 * to be retained as ghosts that slide LEFT past the viewport edge — not
 * popped out of existence in place.
 *
 * Concretely:
 *   1. Scroll the body container all the way to the right (rightmost
 *      columns visible, leftmost columns out of band).
 *   2. Reverse all 31 columns. The cells that were on-screen on the right
 *      now belong on the left side of the table — outside the band that
 *      `getVisibleBodyCells` keeps in the DOM at the new scroll position.
 *   3. Verify those cells are retained as `data-animating-out` ghosts at
 *      their new (off-screen-left) `style.left`, with an inverse FLIP X
 *      transform so they visually start at their old on-screen `left`.
 */
export const ReorderAfterHorizontalScrollRetainsExitingCellsAsGhosts = {
  tags: ["reorder-h-scroll-retain"],
  render: () => {
    const result = renderConstrainedTable(createHeaders(), createData(), {
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    });
    setTable(result.table);
    result.h2.textContent = `Reorder after horizontal scroll · retains horizontally-exiting ghosts · ${SLOW_DURATION}ms`;
    addParagraph(
      result.wrapper,
      "Scrolls horizontally to the rightmost extent of the body, then reverses " +
        "all columns. The cells that were on-screen on the right now belong on " +
        "the left side of the table — outside the new band — and must be retained " +
        "as ghosts sliding left past the viewport edge.",
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

    // The horizontally scrollable element is .st-body-main (overflow: auto,
    // content is wider than the viewport). Setting scrollLeft fires the
    // scroll handler which the SectionScrollController listens for and
    // propagates to other panes (sticky header, scrollbar).
    const mainBody = canvasElement.querySelector<HTMLElement>(".st-body-main");
    expect(mainBody, "Need a horizontally scrollable .st-body-main").toBeTruthy();
    expect(
      mainBody!.scrollWidth,
      ".st-body-main scrollWidth should exceed clientWidth so it can scroll",
    ).toBeGreaterThan(mainBody!.clientWidth);

    mainBody!.scrollLeft = mainBody!.scrollWidth;
    mainBody!.dispatchEvent(new Event("scroll", { bubbles: true }));
    await tickFrames(4);
    await sleep(300);

    const scrollLeftAtSnapshot = mainBody!.scrollLeft;
    expect(
      scrollLeftAtSnapshot,
      ".st-body-main should have scrolled to a meaningful right offset",
    ).toBeGreaterThan(1000);

    // Capture the visible row-0 cells with their pre-reorder `left`. After
    // the reverse, the right-side accessors (high col_N) end up at small
    // `left` values, far behind our current scrollLeft — they should be
    // outside the post-reorder band and retained as ghosts.
    const visibleRow0Cells = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(`.st-body-main .st-cell[data-row-index="0"]`),
    ).filter((c) => !c.hasAttribute("data-animating-out"));

    const beforeByAccessor = new Map<string, { left: number }>();
    for (const c of visibleRow0Cells) {
      const accessor = c.getAttribute("data-accessor");
      if (!accessor) continue;
      beforeByAccessor.set(accessor, { left: parseFloat(c.style.left || "0") });
    }
    expect(
      beforeByAccessor.size,
      "Need several visible row-0 cells after horizontal scroll",
    ).toBeGreaterThan(2);

    // All sampled cells should be at `left` values close to or past the
    // current scrollLeft — this is what makes them currently visible.
    const minPreLeft = Math.min(...Array.from(beforeByAccessor.values()).map((v) => v.left));
    expect(minPreLeft).toBeGreaterThan(scrollLeftAtSnapshot - 500);

    expect(countGhosts(canvasElement)).toBe(0);

    announce(status, "Reversing all columns at right-most scroll position…");

    const original = table.getAPI().getHeaders();
    const reversed = [...original].reverse();
    table.update({ defaultHeaders: reversed });

    // Synchronously inspect the DOM right after the reverse.
    const ghosts = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(`.st-body-main [data-animating-out="true"]`),
    );

    if (ghosts.length === 0) {
      throw new Error(
        `Expected retained ghosts after reordering at right-most scroll, got 0. ` +
          `Visible row-0 cells [${Array.from(beforeByAccessor.keys()).join(",")}] ` +
          `should have been pushed to the left side of the table (off-band) and ` +
          `retained as ghosts sliding left.`,
      );
    }

    const ghostsByAccessorRow0 = new Map<string, HTMLElement>();
    for (const g of ghosts) {
      const accessor = g.getAttribute("data-accessor");
      const rowIndex = g.getAttribute("data-row-index");
      if (!accessor) continue;
      if (rowIndex !== "0") continue;
      if (!ghostsByAccessorRow0.has(accessor)) {
        ghostsByAccessorRow0.set(accessor, g);
      }
    }

    // We expect at least SOME of the tracked accessors to be retained as
    // ghosts. (Not necessarily all — some right-side cells might still
    // land inside the post-reorder band depending on the new scrollLeft.)
    const retained: string[] = [];
    for (const accessor of beforeByAccessor.keys()) {
      if (ghostsByAccessorRow0.has(accessor)) retained.push(accessor);
    }
    if (retained.length === 0) {
      throw new Error(
        `Expected at least one of [${Array.from(beforeByAccessor.keys()).join(",")}] ` +
          `to be retained as a row-0 ghost after the reverse. Found ghosts for ` +
          `accessors: [${Array.from(ghostsByAccessorRow0.keys()).join(",")}].`,
      );
    }

    // For each retained tracked accessor, verify FLIP correctness.
    const summaries: string[] = [];
    for (const accessor of retained) {
      const ghost = ghostsByAccessorRow0.get(accessor)!;
      const oldLeft = beforeByAccessor.get(accessor)!.left;
      const newLeft = parseFloat(ghost.style.left || "0");
      const tx = parseTranslateX(ghost.style.transform);
      summaries.push(
        `${accessor}: oldLeft=${oldLeft} newLeft=${newLeft} tx=${tx} pointer=${ghost.style.pointerEvents}`,
      );

      // newLeft should be much less than oldLeft (cell jumped to the left
      // side of the table).
      if (!(newLeft < oldLeft - 500)) {
        throw new Error(
          `Ghost for "${accessor}" should have moved leftward by >500px after a ` +
            `column reverse. Got oldLeft=${oldLeft} newLeft=${newLeft}. ` +
            `Summaries: ${summaries.join(" | ")}`,
        );
      }

      const expectedTx = oldLeft - newLeft;
      if (Math.abs(tx - expectedTx) >= 1.5) {
        throw new Error(
          `Ghost for "${accessor}" has wrong FLIP tx: expected ${expectedTx} (oldLeft - newLeft), ` +
            `got ${tx}. Summaries: ${summaries.join(" | ")}`,
        );
      }
      if (tx <= 0) {
        throw new Error(
          `Ghost for "${accessor}" sliding LEFT must have a POSITIVE FLIP tx (it visually ` +
            `starts to the right of where it ends). Got tx=${tx}. ` +
            `Summaries: ${summaries.join(" | ")}`,
        );
      }

      expect(
        ghost.style.pointerEvents,
        `Ghost for "${accessor}" should have pointer-events: none while sliding`,
      ).toBe("none");
    }

    await sleep(SETTLE_PAUSE);

    announce(status, "Verifying ghost cleanup after settle…");
    const ghostsAfterSettle = canvasElement.querySelectorAll(
      `.st-body-main [data-animating-out="true"]`,
    );
    expect(
      ghostsAfterSettle.length,
      `All retained ghosts should be removed once the slide completes`,
    ).toBe(0);

    const activeCellsHScroll = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        `.st-body-main .st-cell:not([data-animating-out])`,
      ),
    );
    const stuckHScroll = activeCellsHScroll.filter(
      (c) => c.style.transform && c.style.transform !== "none",
    );
    expect(
      stuckHScroll.length,
      "active cells with leftover transform after horizontal-reorder settle",
    ).toBe(0);

    announce(status, "Done.");
  },
};
