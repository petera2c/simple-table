import { describe, expect, it } from "vitest";
import { isNearViewport, parkAndStagger } from "../utils/parkAndStagger";

const band = { scrollOffset: 100, clientSize: 300 };

describe("isNearViewport", () => {
  it("treats a zero-size viewport as near so callers pass the true position through", () => {
    expect(isNearViewport(5000, 32, { scrollOffset: 0, clientSize: 0 })).toBe(true);
  });

  it("is near when the cell overlaps the visible band", () => {
    expect(isNearViewport(200, 32, band)).toBe(true);
    expect(isNearViewport(80, 32, band)).toBe(true);
    expect(isNearViewport(390, 32, band)).toBe(true);
  });

  it("is far when the cell sits fully above or below the band", () => {
    expect(isNearViewport(0, 32, band)).toBe(false);
    expect(isNearViewport(5000, 32, band)).toBe(false);
  });
});

describe("parkAndStagger", () => {
  it("keeps true positions that are already in view", () => {
    const parked = parkAndStagger(
      [
        { id: "a", truePos: 120, cellSize: 32 },
        { id: "b", truePos: 200, cellSize: 32 },
      ],
      band,
    );
    expect(parked.get("a")).toBe(120);
    expect(parked.get("b")).toBe(200);
  });

  it("parks far-below cells just past the bottom edge, spaced by cell size", () => {
    const parked = parkAndStagger(
      [
        { id: "nearer", truePos: 2000, cellSize: 32 },
        { id: "farther", truePos: 5000, cellSize: 32 },
      ],
      band,
    );
    const nearer = parked.get("nearer")!;
    const farther = parked.get("farther")!;
    const edge = band.scrollOffset + band.clientSize;
    expect(nearer).toBeGreaterThanOrEqual(edge);
    expect(farther).toBeGreaterThan(nearer);
    expect(farther - nearer).toBe(32);
    expect(nearer).toBeLessThan(edge + 32 * 4);
  });

  it("parks far-above cells just past the top edge, spaced by cell size", () => {
    const parked = parkAndStagger(
      [
        { id: "nearer", truePos: 10, cellSize: 32 },
        { id: "farther", truePos: -400, cellSize: 32 },
      ],
      band,
    );
    const nearer = parked.get("nearer")!;
    const farther = parked.get("farther")!;
    expect(nearer).toBeLessThan(band.scrollOffset);
    expect(farther).toBeLessThan(nearer);
    expect(nearer - farther).toBe(32);
  });

  it("does not stack many far cells on the same coordinate", () => {
    const items = Array.from({ length: 8 }, (_, i) => ({
      id: `r${i}`,
      truePos: 4000 + i * 80,
      cellSize: 40,
    }));
    const parked = parkAndStagger(items, band);
    const values = items.map((item) => parked.get(item.id)!);
    expect(new Set(values).size).toBe(values.length);
  });

  it("does not park farther from the viewport than the true position", () => {
    const parked = parkAndStagger(
      [
        { id: "a", truePos: 2000, cellSize: 32 },
        { id: "b", truePos: 5000, cellSize: 32 },
      ],
      band,
    );
    expect(parked.get("a")!).toBeLessThanOrEqual(2000);
    expect(parked.get("b")!).toBeLessThanOrEqual(5000);
  });

  it("keeps a long stagger inside one viewport of the edge", () => {
    const items = Array.from({ length: 30 }, (_, i) => ({
      id: `c${i}`,
      truePos: 8000 + i * 200,
      cellSize: 200,
    }));
    const parked = parkAndStagger(items, band);
    const edge = band.scrollOffset + band.clientSize;
    for (const item of items) {
      const pos = parked.get(item.id)!;
      expect(pos).toBeGreaterThanOrEqual(edge);
      expect(pos).toBeLessThanOrEqual(item.truePos);
      expect(pos).toBeLessThanOrEqual(edge + band.clientSize + item.cellSize);
    }
  });

  it("holdTruePos keeps a far coordinate", () => {
    const parked = parkAndStagger(
      [{ id: "held", truePos: 5000, cellSize: 32, holdTruePos: true }],
      band,
    );
    expect(parked.get("held")).toBe(5000);
  });

  it("forceSide parks an in-view origin just outside the requested edge", () => {
    const parked = parkAndStagger(
      [{ id: "in", truePos: 200, cellSize: 32, forceSide: "after" }],
      band,
    );
    const pos = parked.get("in")!;
    expect(pos).toBeGreaterThanOrEqual(band.scrollOffset + band.clientSize);
    expect(pos).not.toBe(200);
  });

  it("returns true positions when the viewport size is unknown", () => {
    const parked = parkAndStagger(
      [{ id: "a", truePos: 5000, cellSize: 32 }],
      { scrollOffset: 0, clientSize: 0 },
    );
    expect(parked.get("a")).toBe(5000);
  });
});
