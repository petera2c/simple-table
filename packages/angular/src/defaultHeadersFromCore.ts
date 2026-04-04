import type { HeaderObject } from "simple-table-core";
import type { AngularHeaderObject } from "./types";

export function defaultHeaderFromCore(header: HeaderObject): AngularHeaderObject {
  return header as unknown as AngularHeaderObject;
}

export function defaultHeadersFromCore(headers: readonly HeaderObject[]): AngularHeaderObject[] {
  return headers as unknown as AngularHeaderObject[];
}

export function mapToAngularHeaderObjects(columns: readonly object[]): AngularHeaderObject[] {
  return columns as unknown as AngularHeaderObject[];
}
