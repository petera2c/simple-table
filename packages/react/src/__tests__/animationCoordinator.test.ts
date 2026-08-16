import { afterEach, beforeEach, describe, expect, it } from "vitest";
// Tested against the core *source* (not the built dist) — same as the adapter
// tests. These are focused unit tests for the FLIP coordinator's spam-sort
// coalescing, external-scroll distance scaling, and in-flight lifecycle.
import { AnimationCoordinator } from "../../../core/src/managers/AnimationCoordinator";
import { getRenderedCells } from "../../../core/src/utils/bodyCell/eventTracking";
import { setAbsoluteCellPosition } from "../../../core/src/utils/setAbsoluteCellPosition";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(predicate: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(10);
  }
  throw new Error("Timed out waiting for condition");
}

/** Pull the translateY pixel value out of a `translate3d(x, y, 0)` transform. */
const translateY = (transform: string): number => {
  const match = /translate3d\(\s*[^,]+,\s*(-?[\d.]+)px/.exec(transform);
  return match ? parseFloat(match[1]) : NaN;
};

/** Pull the translateX pixel value out of a `translate3d(x, y, 0)` transform. */
const translateX = (transform: string): number => {
  const match = /translate3d\(\s*(-?[\d.]+)px/.exec(transform);
  return match ? parseFloat(match[1]) : NaN;
};

let container: HTMLElement;
let coordinator: AnimationCoordinator;

function makeCell(id: string, top: number): HTMLElement {
  const cell = document.createElement("div");
  cell.id = id;
  cell.style.position = "absolute";
  cell.style.left = "0px";
  cell.style.top = `${top}px`;
  cell.style.width = "100px";
  cell.style.height = "32px";
  container.appendChild(cell);
  getRenderedCells(container).set(id, cell);
  return cell;
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  coordinator = new AnimationCoordinator({ duration: 50 });
  coordinator.setEnabled(true);
});

afterEach(() => {
  coordinator.setColumnReordering(false);
  coordinator.cancel();
  // Clear the per-container rendered-cell registry between tests.
  getRenderedCells(container).clear();
  container.remove();
});

describe("AnimationCoordinator — external-scroll FLIP scaling", () => {
  it("bounds a far off-screen slide once external vertical scroll metrics are supplied", () => {
    // Cell snapshotted far below the viewport (conceptual position 5000px),
    // then rendered into view at 100px — i.e. it should FLIP "in" from far.
    const cell = makeCell("rowFar-name", 5000);

    coordinator.captureSnapshot({ containers: [container] });
    cell.style.top = "100px"; // post-render: now in view

    coordinator.play({ containers: [container] });

    // jsdom reports 0 for the body container's parent height, so without an
    // external override park-and-stagger passes the true position through.
    const rawDy = translateY(cell.style.transform);
    expect(rawDy).toBeGreaterThan(4000);
  });

  it("compresses the same slide to roughly the visible viewport with the override set", () => {
    const cell = makeCell("rowFar-name", 5000);

    // Real visible viewport is 300px tall inside a 5000px-tall table.
    coordinator.setExternalVerticalScroll({ clientHeight: 300, scrollHeight: 5000, scrollTop: 0 });

    coordinator.captureSnapshot({ containers: [container] });
    cell.style.top = "100px";

    coordinator.play({ containers: [container] });

    // Parked just outside the 300px viewport, not the raw 4900px journey.
    const scaledDy = Math.abs(translateY(cell.style.transform));
    expect(scaledDy).toBeGreaterThan(0);
    expect(scaledDy).toBeLessThan(2 * 300 + 32);
  });

  it("parks two far-off incoming cells at staggered starts", () => {
    const a = makeCell("rowA-name", 4000);
    const b = makeCell("rowB-name", 5000);
    coordinator.setExternalVerticalScroll({ clientHeight: 300, scrollHeight: 8000, scrollTop: 0 });

    coordinator.captureSnapshot({ containers: [container] });
    a.style.top = "40px";
    b.style.top = "72px";
    coordinator.play({ containers: [container] });

    const startA = 40 + translateY(a.style.transform);
    const startB = 72 + translateY(b.style.transform);
    expect(Math.abs(startA - startB)).toBeGreaterThanOrEqual(31);
  });

  it("slides a preLayout incoming cell from a parked origin, not in place", () => {
    coordinator.setExternalVerticalScroll({
      clientHeight: 300,
      scrollHeight: 8000,
      scrollTop: 0,
    });
    const preLayouts = new Map<HTMLElement, Map<string, { left: number; top: number; width: number; height: number }>>();
    preLayouts.set(
      container,
      new Map([["rowIn-id", { left: 0, top: 4000, width: 100, height: 32 }]]),
    );
    coordinator.captureSnapshot({ containers: [container], preLayouts });

    const incoming = makeCell("rowIn-id", 40);
    coordinator.play({ containers: [container] });

    expect(incoming.style.transform).toMatch(/translate/);
    expect(Math.abs(translateY(incoming.style.transform))).toBeGreaterThan(0);
  });
});

describe("AnimationCoordinator — spam-sort coalescing", () => {
  it("cancels the stale FLIP chain and only animates the latest cycle", async () => {
    const cellA = makeCell("rowA-name", 0);
    const cellB = makeCell("rowB-name", 0);

    // Cycle 1: A moves 0 -> 500. play() inverts A and schedules the chain.
    coordinator.captureSnapshot({ containers: [container] });
    cellA.style.top = "500px";
    coordinator.play({ containers: [container] });
    expect(translateY(cellA.style.transform)).toBeCloseTo(-500, 0);

    // Cycle 2 lands before the scheduled chain runs (the spam-click window).
    // Now B moves 0 -> 400 while A stays put.
    coordinator.captureSnapshot({ containers: [container] });
    cellB.style.top = "400px";
    coordinator.play({ containers: [container] });

    // B is the latest cycle and carries the live inverse transform.
    expect(translateY(cellB.style.transform)).toBeCloseTo(-400, 0);

    // After the animation window everything settles — nothing stays in-flight.
    await waitFor(() => !coordinator.hasInFlight());
    expect(coordinator.isInFlight("rowA-name")).toBe(false);
    expect(coordinator.isInFlight("rowB-name")).toBe(false);
  });

  it("clears in-flight cells after many rapid sort cycles (live updates can resume)", async () => {
    const cell = makeCell("rowX-name", 0);

    // Simulate spam-clicking sort: many capture/play cycles in quick succession.
    for (let i = 0; i < 12; i++) {
      coordinator.captureSnapshot({ containers: [container] });
      cell.style.top = `${(i + 1) * 300}px`;
      coordinator.play({ containers: [container] });
    }

    // Once the final animation's safety timeout elapses, the cell is no longer
    // reported as animating — so `isCellAnimating`-gated live updates resume.
    await waitFor(() => !coordinator.isInFlight("rowX-name"), 3000);
    expect(coordinator.isInFlight("rowX-name")).toBe(false);
  });

  it("retargets an in-flight slide from the computed matrix, not the start keyframe", () => {
    coordinator.setDuration(1000);
    const cell = makeCell("rowA-name", 0);

    coordinator.captureSnapshot({ containers: [container] });
    cell.style.top = "300px";
    coordinator.play({ containers: [container] });
    expect(translateY(cell.style.transform)).toBeCloseTo(-300, 0);

    const originalGcs = window.getComputedStyle.bind(window);
    window.getComputedStyle = ((elt: Element, pseudo?: string | null) => {
      const style = originalGcs(elt, pseudo);
      if (elt !== cell) return style;
      return new Proxy(style, {
        get(target, prop) {
          if (prop === "transform") return "matrix(1, 0, 0, 1, 0, -120)";
          const value = Reflect.get(target, prop);
          return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
        },
      });
    }) as typeof getComputedStyle;

    try {
      coordinator.captureSnapshot({ containers: [container] });
      cell.style.top = "0px";
      coordinator.play({ containers: [container] });
      // Painted at snapshot: 300 + (-120) = 180. New dest 0 → hold 180px.
      expect(translateY(cell.style.transform)).toBeCloseTo(180, 0);
    } finally {
      window.getComputedStyle = originalGcs;
    }
  });

  it("counter-shifts a running slide when dest top is rewritten", () => {
    coordinator.setDuration(1000);
    const cell = makeCell("rowB-name", 0);

    coordinator.captureSnapshot({ containers: [container] });
    cell.style.top = "300px";
    coordinator.play({ containers: [container] });
    expect(translateY(cell.style.transform)).toBeCloseTo(-300, 0);
    cell.style.willChange = "transform";
    cell.classList.add("st-flip-active");

    const originalGcs = window.getComputedStyle.bind(window);
    window.getComputedStyle = ((elt: Element, pseudo?: string | null) => {
      const style = originalGcs(elt, pseudo);
      if (elt !== cell) return style;
      return new Proxy(style, {
        get(target, prop) {
          if (prop === "transform") return "matrix(1, 0, 0, 1, 0, -120)";
          const value = Reflect.get(target, prop);
          return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
        },
      });
    }) as typeof getComputedStyle;

    try {
      // Dest 300 → 0. Live remain -120. Hold = -120 - (0-300) = 180.
      setAbsoluteCellPosition(cell, 0, 0);
      expect(translateY(cell.style.transform)).toBeCloseTo(180, 0);
    } finally {
      window.getComputedStyle = originalGcs;
    }
  });
});

describe("AnimationCoordinator — column reorder mode", () => {
  it("allows ColumnReorderAnimator to own paint continuity during column drag", () => {
    // During column-reorder, left writes stay plain — the animator holds+tweens
    // after commit from the pre-write visual snapshot.
    coordinator.setColumnReordering(true);
    expect(coordinator.isColumnReordering()).toBe(true);

    const cell = makeCell("col-pin", 0);
    cell.style.left = "0px";
    cell.style.transform = "";

    setAbsoluteCellPosition(cell, 120, 0);

    expect(cell.style.transform).toBe("");
    expect(cell.style.left).toBe("120px");
  });

  it("does not settle mid-flight FLIPs when (re)entering column drag mode", async () => {
    // Long duration so the handoff assertions aren't racing the safety timeout.
    coordinator.setDuration(500);

    // Start with sort (non-column-reorder) mode to create an in-flight animation.
    const cell = makeCell("col-c", 0);
    cell.style.left = "0px";

    coordinator.captureSnapshot({ containers: [container] });
    cell.style.left = "120px";
    coordinator.play({ containers: [container] });
    expect(translateX(cell.style.transform)).toBeCloseTo(-120, 0);
    await waitFor(() => coordinator.isInFlight("col-c"));

    // Freeze a mid-slide translate (style is identity once the transition has
    // started; settleInFlight would clear both transform and inFlight).
    cell.style.transition = "none";
    cell.style.transform = "translate3d(-60px, 0, 0)";

    // Mimic entering column drag mode.
    coordinator.setColumnReordering(true);
    // In column-reorder mode, the in-flight FLIP must be preserved so ColumnReorderAnimator
    // can continue it. The frozen transform should be preserved.
    expect(translateX(cell.style.transform)).toBeCloseTo(-60, 0);
    expect(coordinator.isInFlight("col-c")).toBe(true);
  });

  it("turns off column reorder mode on destroy", () => {
    coordinator.setColumnReordering(true);
    coordinator.destroy();
    expect(coordinator.isColumnReordering()).toBe(false);
  });
});

describe("AnimationCoordinator — onHostDiscard teardown signal", () => {
  it("fires the callback before permanently removing a retained ghost", () => {
    const discarded: HTMLElement[] = [];
    coordinator.setOnHostDiscard((host) => discarded.push(host));

    const cell = makeCell("rowG-name", 0);
    // Renderer hands the outgoing cell to the coordinator (it removes it from
    // the rendered-cell registry first, mirroring the real render path).
    getRenderedCells(container).delete("rowG-name");
    coordinator.retainCell({
      cellId: "rowG-name",
      element: cell,
      container,
      newPosition: { left: 0, top: 1000, width: 100, height: 32 },
    });

    // cancel() sweeps retained ghosts out of the DOM — each must be announced
    // so the adapter can unmount its portal subtree.
    coordinator.cancel();

    expect(discarded).toContain(cell);
    expect(cell.isConnected).toBe(false);
  });

  it("does NOT fire the callback when a ghost is reclaimed for reuse", () => {
    const discarded: HTMLElement[] = [];
    coordinator.setOnHostDiscard((host) => discarded.push(host));

    const cell = makeCell("rowR-name", 0);
    getRenderedCells(container).delete("rowR-name");
    coordinator.retainCell({
      cellId: "rowR-name",
      element: cell,
      container,
      newPosition: { left: 0, top: 1000, width: 100, height: 32 },
    });

    // The row scrolled back into view: the renderer reclaims the SAME node and
    // promotes it back to a live cell. Its content must be preserved — so no
    // discard signal fires.
    const reclaimed = coordinator.claimRetainedForReuse("rowR-name", container);

    expect(reclaimed).toBe(cell);
    expect(discarded).toHaveLength(0);
  });

  it("removes a retained ghost after the slide even when the parked dest remain is non-zero", async () => {
    coordinator.setDuration(50);
    coordinator.setExternalVerticalScroll({
      clientHeight: 300,
      scrollHeight: 8000,
      scrollTop: 0,
    });

    const cell = makeCell("rowPark-name", 40);
    coordinator.captureSnapshot({ containers: [container] });
    getRenderedCells(container).delete("rowPark-name");
    coordinator.retainCell({
      cellId: "rowPark-name",
      element: cell,
      container,
      newPosition: { left: 0, top: 5000, width: 100, height: 32 },
    });

    coordinator.play({ containers: [container] });
    expect(cell.isConnected).toBe(true);
    expect(cell.style.transform).toMatch(/translate/);

    await waitFor(() => !cell.isConnected, 2000);
    expect(cell.isConnected).toBe(false);
  });
});
