import type { HeaderObject } from "simple-table-core";
import type { SolidHeaderObject } from "./types";

export function defaultHeaderFromCore(header: HeaderObject): SolidHeaderObject {
  return header as unknown as SolidHeaderObject;
}

export function defaultHeadersFromCore(headers: readonly HeaderObject[]): SolidHeaderObject[] {
  return headers as unknown as SolidHeaderObject[];
}

export function mapToSolidHeaderObjects(columns: readonly object[]): SolidHeaderObject[] {
  return columns as unknown as SolidHeaderObject[];
}
