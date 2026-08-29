/** Pixels of wheel delta per `deltaMode === 1` (line) tick. */
export const WHEEL_LINE_PX = 16;

/** Decay rate for leftover touch motion, per millisecond. */
export const FLING_FRICTION_PER_MS = 0.0032;

/** Stop leftover motion below this speed (px per ms). */
export const MIN_FLING_SPEED = 0.05;

/** Axis lock after the finger has moved this far. */
export const TOUCH_LOCK_PX = 8;

export const maxScrollX = (contentWidth: number, viewportWidth: number): number =>
  Math.max(0, contentWidth - viewportWidth);

export const clampScrollX = (x: number, maxX: number): number => {
  if (x < 0) return 0;
  if (x > maxX) return maxX;
  return x;
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

/** Advance leftover touch motion by `dtMs`. Stops at 0 or the last column. */
export const stepFling = (
  x: number,
  velocity: number,
  dtMs: number,
  maxX: number,
): FlingStep => {
  if (x < 0 || x > maxX) {
    return { x: clampScrollX(x, maxX), velocity: 0, done: true };
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
