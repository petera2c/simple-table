export function hasStations(row: Record<string, unknown>): boolean {
  return Boolean(row.stations && Array.isArray(row.stations));
}
