import { describe, expect, it } from "vitest";
import {
  capRubberX,
  clampScrollX,
  isAtHorizontalEdge,
  isAtRubberCap,
  maxScrollX,
  MAX_RUBBER_PX,
  normalizeWheelDelta,
  rubberBandX,
  stepFling,
  unboundedFromDisplayedX,
} from "../managers/horizontalScroll/physics";

describe("horizontal scroll physics", () => {
  it("computes the max offset from content and viewport width", () => {
    expect(maxScrollX(1000, 400)).toBe(600);
    expect(maxScrollX(200, 400)).toBe(0);
    expect(maxScrollX(0, 0)).toBe(0);
  });

  it("clamps x into the valid range", () => {
    expect(clampScrollX(-20, 600)).toBe(0);
    expect(clampScrollX(800, 600)).toBe(600);
    expect(clampScrollX(120, 600)).toBe(120);
  });

  it("keeps only part of an out-of-range drag", () => {
    expect(rubberBandX(-100, 600)).toBeCloseTo(-32);
    expect(rubberBandX(700, 600)).toBeCloseTo(632);
    expect(rubberBandX(100, 600)).toBe(100);
  });

  it("converts a stretched x back to unbounded space", () => {
    expect(unboundedFromDisplayedX(-32, 600)).toBeCloseTo(-100);
    expect(unboundedFromDisplayedX(632, 600)).toBeCloseTo(700);
    expect(unboundedFromDisplayedX(100, 600)).toBe(100);
  });

  it("caps stretch at the rubber-band limit", () => {
    expect(capRubberX(-200, 600)).toBe(-MAX_RUBBER_PX);
    expect(capRubberX(900, 600)).toBe(600 + MAX_RUBBER_PX);
    expect(capRubberX(100, 600)).toBe(100);
  });

  it("treats a push past the rubber-band cap as fully stretched", () => {
    expect(isAtRubberCap(-MAX_RUBBER_PX, -10, 600)).toBe(true);
    expect(isAtRubberCap(-MAX_RUBBER_PX, 10, 600)).toBe(false);
    expect(isAtRubberCap(600 + MAX_RUBBER_PX, 10, 600)).toBe(true);
    expect(isAtRubberCap(600 + MAX_RUBBER_PX, -10, 600)).toBe(false);
    expect(isAtRubberCap(600, 10, 600)).toBe(false);
  });

  it("treats a push past either end as an edge", () => {
    expect(isAtHorizontalEdge(0, -10, 600)).toBe(true);
    expect(isAtHorizontalEdge(0, 10, 600)).toBe(false);
    expect(isAtHorizontalEdge(600, 10, 600)).toBe(true);
    expect(isAtHorizontalEdge(600, -10, 600)).toBe(false);
    expect(isAtHorizontalEdge(200, 10, 600)).toBe(false);
  });

  it("turns shift+vertical wheel into a horizontal delta", () => {
    const { dx, dy } = normalizeWheelDelta(0, 40, 0, true, 400);
    expect(dx).toBe(40);
    expect(dy).toBe(0);
  });

  it("scales line-mode wheel deltas", () => {
    const { dx } = normalizeWheelDelta(2, 0, 1, false, 400);
    expect(dx).toBe(32);
  });

  it("decays leftover motion and stops at the end", () => {
    const moving = stepFling(100, 2, 16, 600);
    expect(moving.done).toBe(false);
    expect(moving.x).toBeGreaterThan(100);
    expect(Math.abs(moving.velocity)).toBeLessThan(2);

    const hitEnd = stepFling(595, 2, 16, 600);
    expect(hitEnd.x).toBe(600);
    expect(hitEnd.velocity).toBe(0);
    expect(hitEnd.done).toBe(true);
  });

  it("springs back when x is past the end", () => {
    const step = stepFling(650, 0, 16, 600);
    expect(step.x).toBeLessThan(650);
    expect(step.x).toBeGreaterThan(600);
    expect(step.velocity).toBe(0);
  });
});
