import type { HeaderObject } from "simple-table-core";
import type { SvelteHeaderObject } from "./types";

export function defaultHeaderFromCore(header: HeaderObject): SvelteHeaderObject {
  return header as unknown as SvelteHeaderObject;
}

export function defaultHeadersFromCore(headers: readonly HeaderObject[]): SvelteHeaderObject[] {
  return headers as unknown as SvelteHeaderObject[];
}

export function mapToSvelteHeaderObjects(columns: readonly object[]): SvelteHeaderObject[] {
  return columns as unknown as SvelteHeaderObject[];
}
