/** Pixels of wheel delta per `deltaMode === 1` (line) tick. */
export const WHEEL_LINE_PX = 16;

/** Decay rate for leftover touch motion, per millisecond. */
export const FLING_FRICTION_PER_MS = 0.0032;

/** Stop leftover motion below this speed (px per ms). */
export const MIN_FLING_SPEED = 0.05;

/** How much of an out-of-range drag is kept while the finger is down. */
export const RUBBER_BAND = 0.32;

/** Farthest the layers may travel past 0 or the last column, in pixels. */
export const MAX_RUBBER_PX = 72;

/** Idle time after a stretch tick before an overshoot springs back. */
export const WHEEL_SPRING_IDLE_MS = 64;

/** Once past the end, only wheel ticks at least this large still pull the rubber. */
export const LIVE_WHEEL_STRETCH_PX = 16;

/** Leftover ticks may grow by this much and still count as the same swipe. */
export const LEFTOVER_DX_SLACK = 8;

/** Clear leftover-swipe tracking after this idle gap. */
export const LEFTOVER_IDLE_MS = 120;

/** How fast an out-of-range position springs back per frame (0–1). */
export const SPRING_PER_FRAME = 0.22;

/** Axis lock after the finger has moved this far. */
export const TOUCH_LOCK_PX = 8;

export const maxScrollX = (contentWidth: number, viewportWidth: number): number =>
  Math.max(0, contentWidth - viewportWidth);

export const clampScrollX = (x: number, maxX: number): number => {
  if (x < 0) return 0;
  if (x > maxX) return maxX;
  return x;
};

/** Map an unbounded `x` toward the valid range while a finger is dragging. */
export const rubberBandX = (x: number, maxX: number): number => {
  if (x < 0) return x * RUBBER_BAND;
  if (x > maxX) return maxX + (x - maxX) * RUBBER_BAND;
  return x;
};

/** Undo {@link rubberBandX} so a later delta can be applied in unbounded space. */
export const unboundedFromDisplayedX = (x: number, maxX: number): number => {
  if (x < 0) return x / RUBBER_BAND;
  if (x > maxX) return maxX + (x - maxX) / RUBBER_BAND;
  return x;
};

/** Clamp a stretched `x` to the rubber-band limit. */
export const capRubberX = (x: number, maxX: number): number => {
  const min = -MAX_RUBBER_PX;
  const max = maxX + MAX_RUBBER_PX;
  if (x < min) return min;
  if (x > max) return max;
  return x;
};

/** True when `x` is already at the rubber-band cap and `dx` pushes farther. */
export const isAtRubberCap = (x: number, dx: number, maxX: number): boolean => {
  if (dx < 0 && x <= -MAX_RUBBER_PX + 0.01) return true;
  if (dx > 0 && x >= maxX + MAX_RUBBER_PX - 0.01) return true;
  return false;
};

export const isAtHorizontalEdge = (x: number, dx: number, maxX: number): boolean => {
  if (dx < 0 && x <= 0) return true;
  if (dx > 0 && x >= maxX) return true;
  return false;
};

export const normalizeWheelDelta = (
  deltaX: number,
  deltaY: number,
  deltaMode: number,
  shiftKey: boolean,
  viewportWidth: number,
): { dx: number; dy: number } => {
  let dx = deltaX;
  let dy = deltaY;
  if (deltaMode === 1) {
    dx *= WHEEL_LINE_PX;
    dy *= WHEEL_LINE_PX;
  } else if (deltaMode === 2) {
    const page = viewportWidth > 0 ? viewportWidth : 1;
    dx *= page;
    dy *= page;
  }
  if (shiftKey && Math.abs(dx) < Math.abs(dy)) {
    dx = dy;
    dy = 0;
  }
  return { dx, dy };
};

export interface FlingStep {
  x: number;
  velocity: number;
  done: boolean;
}

/** Advance leftover touch motion by `dtMs`. Springs back if `x` is out of range. */
export const stepFling = (
  x: number,
  velocity: number,
  dtMs: number,
  maxX: number,
): FlingStep => {
  if (x < 0 || x > maxX) {
    const target = x < 0 ? 0 : maxX;
    const next = x + (target - x) * SPRING_PER_FRAME;
    if (Math.abs(next - target) < 0.5) {
      return { x: target, velocity: 0, done: true };
    }
    return { x: next, velocity: 0, done: false };
  }

  if (dtMs <= 0) {
    return { x, velocity, done: Math.abs(velocity) < MIN_FLING_SPEED };
  }

  const nextVelocity = velocity * Math.exp(-FLING_FRICTION_PER_MS * dtMs);
  if (Math.abs(nextVelocity) < MIN_FLING_SPEED) {
    return { x: clampScrollX(x, maxX), velocity: 0, done: true };
  }

  let nextX = x + nextVelocity * dtMs;
  if (nextX < 0 || nextX > maxX) {
    nextX = clampScrollX(nextX, maxX);
    return { x: nextX, velocity: 0, done: true };
  }
  return { x: nextX, velocity: nextVelocity, done: false };
};
