import type { HeaderObject } from "simple-table-core";
import type { ReactHeaderObject } from "./types";

/** Single column from a core/shared config, typed for React `defaultHeaders`. */
export function defaultHeaderFromCore(header: HeaderObject): ReactHeaderObject {
  return header as unknown as ReactHeaderObject;
}

/** Column tree from `simple-table-core` or shared configs, typed for React `defaultHeaders`. */
export function defaultHeadersFromCore(headers: readonly HeaderObject[]): ReactHeaderObject[] {
  return headers as unknown as ReactHeaderObject[];
}

/**
 * Use after mapping over {@link HeaderObject} and spreading into `{ ...h, cellRenderer }` (or
 * `headerRenderer`). TypeScript keeps vanilla renderer types on the spread; this asserts the
 * React-only column shape for `defaultHeaders`.
 */
export function mapToReactHeaderObjects(columns: readonly object[]): ReactHeaderObject[] {
  return columns as unknown as ReactHeaderObject[];
}
