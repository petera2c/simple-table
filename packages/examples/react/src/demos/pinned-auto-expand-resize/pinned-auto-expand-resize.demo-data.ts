import type { ReactColumnDef } from "@simple-table/react";

export interface ArtistRow {
  id: number;
  name: string;
  country: string;
  city: string;
  listeners: number;
  followers: number;
  streams: number;
  rank: number;
}

/** Every column starts here, so any growth at all is visible in the readout. */
export const START_WIDTH = 140;

/** Which side the repro pins to. The bug mirrors for `"right"`. */
export const PINNED_SIDE = "left" as const;

export const PINNED_COUNT_OPTIONS = [1, 2, 3] as const;

export const DEFAULT_PINNED_COUNT = 2;

export const ROW_COUNT = 12;

/** How often the probe re-reads the rendered widths, in ms. */
export const SAMPLE_INTERVAL = 120;

/** Rounding slack. A stuck column still picks up about 1px from the section width. */
export const GROWTH_EPSILON = 2;

export const SELECTORS = {
  headerCell: ".st-header-cell[data-accessor]",
  bodyContainer: ".st-body-container",
  pinnedLeftHeader: ".st-header-pinned-left",
} as const;

export const COLUMN_DEFS: Array<{
  accessor: keyof ArtistRow;
  label: string;
  type: "string" | "number";
}> = [
  { accessor: "name", label: "Artist", type: "string" },
  { accessor: "country", label: "Country", type: "string" },
  { accessor: "city", label: "City", type: "string" },
  { accessor: "listeners", label: "Listeners", type: "number" },
  { accessor: "followers", label: "Followers", type: "number" },
  { accessor: "streams", label: "Streams", type: "number" },
  { accessor: "rank", label: "Rank", type: "number" },
];

/** The first `pinnedCount` columns are pinned. All of them share START_WIDTH. */
export const makeColumns = (pinnedCount: number): ReactColumnDef<ArtistRow>[] =>
  COLUMN_DEFS.map((column, index) => ({
    accessor: column.accessor,
    label: column.label,
    type: column.type,
    width: START_WIDTH,
    pinned: index < pinnedCount ? PINNED_SIDE : undefined,
  }));

const COUNTRIES = ["US", "KR", "JP", "GB"];
const CITIES = ["New York", "Seoul", "Tokyo", "London"];

export const makeRows = (count: number = ROW_COUNT): ArtistRow[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Artist ${String.fromCharCode(65 + (i % 26))}`,
    country: COUNTRIES[i % COUNTRIES.length],
    city: CITIES[i % CITIES.length],
    listeners: (i + 1) * 12_345,
    followers: (i + 1) * 6_789,
    streams: (i + 1) * 98_765,
    rank: i + 1,
  }));

export const rows: ArtistRow[] = makeRows();

/**
 * Hardcoded pinned-width policy (`getMaxPinnedSectionPercent`): a pinned
 * section may never exceed this fraction of the table container. These are the
 * one-side-pinned ratios this repro uses. Pinning both sides drops them to
 * 0.25 / 0.3 / 0.4.
 */
export const capRatio = (containerWidth: number): number =>
  containerWidth < 480 ? 0.4 : containerWidth < 768 ? 0.5 : 0.6;

export interface Measurement {
  accessor: string;
  label: string;
  pinned: boolean;
  isLastPinned: boolean;
  width: number;
  max: number;
}

export interface Layout {
  /** Table container width the library measures its section caps against. */
  container: number;
  /** Rendered width of the pinned section. */
  section: number;
  /** container × capRatio(container). The pinned section's hard ceiling. */
  cap: number;
}

export const readWidths = (root: HTMLElement | null): Map<string, number> => {
  const widths = new Map<string, number>();
  root?.querySelectorAll<HTMLElement>(SELECTORS.headerCell).forEach((cell) => {
    const accessor = cell.dataset.accessor;
    if (accessor) widths.set(accessor, Math.round(cell.offsetWidth));
  });
  return widths;
};

export const readLayout = (root: HTMLElement | null): Layout | null => {
  const container = root?.querySelector<HTMLElement>(SELECTORS.bodyContainer);
  const section = root?.querySelector<HTMLElement>(SELECTORS.pinnedLeftHeader);
  if (!container || !section) return null;

  const containerWidth = Math.round(container.clientWidth);
  return {
    container: containerWidth,
    section: Math.round(section.getBoundingClientRect().width),
    cap: Math.round(containerWidth * capRatio(containerWidth)),
  };
};

/** A pinned section sitting at its cap blocks growth in either resize mode. */
export const isAtCap = (layout: Layout | null): boolean =>
  layout !== null && layout.section >= layout.cap - 4;
