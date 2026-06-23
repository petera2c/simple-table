/** Ordinary-least-squares slope of `y` over its index (0,1,2,...). */
export function regressionSlope(y: number[]): number {
  const n = y.length;
  if (n < 2) return 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += y[i];
    sumXY += i * y[i];
    sumXX += i * i;
  }
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return 0;
  return (n * sumXY - sumX * sumY) / denom;
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Steady-state drift: the difference between the averaged second-half and
 * first-half of the trailing `tailFraction` of a series. Averaging both halves
 * makes this robust to single-sample GC/measurement noise (unlike a raw slope),
 * while still capturing sustained round-over-round growth. ~0 for a plateau,
 * large and positive for an unbounded leak.
 */
export function tailDrift(series: number[], tailFraction = 0.5): number {
  if (series.length < 4) return 0;
  const tail = series.slice(Math.floor(series.length * (1 - tailFraction)));
  const mid = Math.floor(tail.length / 2);
  return mean(tail.slice(mid)) - mean(tail.slice(0, mid));
}

export function bytesToMB(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 100) / 100;
}
