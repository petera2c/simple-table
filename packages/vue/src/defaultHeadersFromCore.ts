import type { HeaderObject } from "simple-table-core";
import type { VueHeaderObject } from "./types";

export function defaultHeaderFromCore(header: HeaderObject): VueHeaderObject {
  return header as unknown as VueHeaderObject;
}

export function defaultHeadersFromCore(headers: readonly HeaderObject[]): VueHeaderObject[] {
  return headers as unknown as VueHeaderObject[];
}

export function mapToVueHeaderObjects(columns: readonly object[]): VueHeaderObject[] {
  return columns as unknown as VueHeaderObject[];
}
