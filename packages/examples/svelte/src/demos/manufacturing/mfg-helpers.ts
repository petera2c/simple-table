import type { ManufacturingRow } from "./manufacturing.demo-data";

export function hasStations(row: ManufacturingRow): boolean {
  return Boolean(row.stations && Array.isArray(row.stations));
}
