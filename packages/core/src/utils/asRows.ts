import type Row from "../types/Row";

/**
 * Structural typing bridge: domain row interfaces often do not assign to {@link Row}[]
 * because `Row` uses an index signature. Use when passing typed data to `rows` and
 * similar APIs.
 */
export function asRows<T>(rows: readonly T[]): Row[] {
  return rows as unknown as Row[];
}
