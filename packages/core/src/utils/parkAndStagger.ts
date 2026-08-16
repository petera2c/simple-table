/**
 * Park far-off cell coordinates just outside the visible band, spaced so
 * they do not stack on the same edge.
 */

export type ParkBand = {
  /** scrollTop (Y) or scrollLeft (X). */
  scrollOffset: number;
  /** clientHeight (Y) or clientWidth (X). */
  clientSize: number;
};

export type ParkItem = {
  id: string;
  truePos: number;
  cellSize: number;
  /**
   * Park on this side even when `truePos` overlaps the visible band.
   * Used for incoming cells whose conceptual origin is in-view but the
   * cell itself was not in the DOM — they still slide in from an edge.
   */
  forceSide?: "before" | "after";
  /**
   * Keep `truePos` even when it sits outside the band. Used for cells that
   * are already in the DOM so the slide starts from where they currently look.
   */
  holdTruePos?: boolean;
};

export type ParkAndStaggerOptions = {
  /** Extra space between parked cells. Defaults to 0. */
  gap?: number;
  /** Gap between the viewport edge and the first parked cell. Defaults to that cell's size. */
  margin?: number;
};

/** True when the cell's box overlaps the visible band. */
export const isNearViewport = (
  truePos: number,
  cellSize: number,
  band: ParkBand,
): boolean => {
  if (band.clientSize <= 0) return true;
  const start = band.scrollOffset;
  const end = band.scrollOffset + band.clientSize;
  const size = cellSize > 0 ? cellSize : 0;
  return truePos + size >= start && truePos <= end;
};

/**
 * Map each item to a coordinate: true position when near the viewport,
 * otherwise just outside the matching edge, staggered by slot.
 *
 * Slot 0 is closest to the visible edge. Order on each side follows
 * `truePos` so destination order is preserved. Parks stay between the
 * edge and the true position, and the stagger never spreads more than
 * one viewport beyond the first parked cell.
 */
export const parkAndStagger = (
  items: ParkItem[],
  band: ParkBand,
  options?: ParkAndStaggerOptions,
): Map<string, number> => {
  const result = new Map<string, number>();
  if (band.clientSize <= 0) {
    for (const item of items) {
      result.set(item.id, item.truePos);
    }
    return result;
  }

  const before: ParkItem[] = [];
  const after: ParkItem[] = [];

  for (const item of items) {
    if (item.holdTruePos) {
      result.set(item.id, item.truePos);
      continue;
    }
    if (item.forceSide === "before") {
      before.push(item);
      continue;
    }
    if (item.forceSide === "after") {
      after.push(item);
      continue;
    }
    if (isNearViewport(item.truePos, item.cellSize, band)) {
      result.set(item.id, item.truePos);
      continue;
    }
    if (item.truePos + (item.cellSize > 0 ? item.cellSize : 0) < band.scrollOffset) {
      before.push(item);
    } else {
      after.push(item);
    }
  }

  const gap = options?.gap ?? 0;
  const start = band.scrollOffset;
  const end = band.scrollOffset + band.clientSize;
  const maxSpread = band.clientSize;

  // Closest to the visible edge first.
  before.sort((a, b) => b.truePos - a.truePos);
  after.sort((a, b) => a.truePos - b.truePos);

  before.forEach((item, slot) => {
    const size = item.cellSize > 0 ? item.cellSize : 0;
    const margin = options?.margin ?? size;
    const stride = size + gap;
    if (item.forceSide === "before") {
      result.set(item.id, start - margin - size - Math.min(slot * stride, maxSpread));
      return;
    }
    const edge = start - Math.min(margin, Math.max(0, start - (item.truePos + size))) - size;
    const room = Math.max(0, edge - item.truePos);
    const offset = Math.min(slot * stride, room, maxSpread);
    result.set(item.id, edge - offset);
  });

  after.forEach((item, slot) => {
    const size = item.cellSize > 0 ? item.cellSize : 0;
    const margin = options?.margin ?? size;
    const stride = size + gap;
    if (item.forceSide === "after") {
      result.set(item.id, end + margin + Math.min(slot * stride, maxSpread));
      return;
    }
    const edge = end + Math.min(margin, Math.max(0, item.truePos - end));
    const room = Math.max(0, item.truePos - edge);
    const offset = Math.min(slot * stride, room, maxSpread);
    result.set(item.id, edge + offset);
  });

  return result;
};
