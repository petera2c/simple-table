import { afterEach, beforeEach, describe, expect, it } from "vitest";
// Tested against the core *source* (not the built dist) — same as the adapter
// tests. These are focused unit tests for the FLIP coordinator's spam-sort
// coalescing, external-scroll distance scaling, and in-flight lifecycle.
import { AnimationCoordinator } from "../../../core/src/managers/AnimationCoordinator";
import { getRenderedCells } from "../../../core/src/utils/bodyCell/eventTracking";

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
    // external override scaleFlipDistance can't bound the slide: the inverse
    // transform is the raw ~4900px journey.
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

    // Compressed journey asymptotes at ~2× viewport (visibleRange + maxOvershoot),
    // so it must be far smaller than the raw 4900px and bounded by ~viewport*2.
    const scaledDy = Math.abs(translateY(cell.style.transform));
    expect(scaledDy).toBeGreaterThan(0);
    expect(scaledDy).toBeLessThan(2 * 300 + 32);
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

    // A was only in the stale (cancelled) chain: its inverted transform must be
    // reset rather than left stranded, and it must never start a transition.
    expect(cellA.style.transform).toBe("");
    expect(coordinator.isInFlight("rowA-name")).toBe(false);

    // B is the latest cycle and carries the live inverse transform.
    expect(translateY(cellB.style.transform)).toBeCloseTo(-400, 0);

    // After the animation window everything settles — nothing stays in-flight.
    await waitFor(() => !coordinator.isInFlight("rowB-name"));
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
});
