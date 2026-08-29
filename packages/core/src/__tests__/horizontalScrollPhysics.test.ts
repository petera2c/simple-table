import { describe, expect, it } from "vitest";
import {
  clampScrollX,
  isAtHorizontalEdge,
  maxScrollX,
  normalizeWheelDelta,
  stepFling,
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

  it("snaps to the end when leftover motion starts past the last column", () => {
    const pastEnd = stepFling(650, 2, 16, 600);
    expect(pastEnd.x).toBe(600);
    expect(pastEnd.velocity).toBe(0);
    expect(pastEnd.done).toBe(true);

    const pastStart = stepFling(-20, -2, 16, 600);
    expect(pastStart.x).toBe(0);
    expect(pastStart.velocity).toBe(0);
    expect(pastStart.done).toBe(true);
  });
});
