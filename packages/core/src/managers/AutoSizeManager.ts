import ColumnDef, { Accessor } from "../types/ColumnDef";
import Row from "../types/Row";
import {
  calculateHeaderContentWidth,
  getAllVisibleLeafHeaders,
  getHeaderMinWidth,
  isAutoWidth,
} from "../utils/headerWidthUtils";
import type { ResolvedIcons } from "../core/initialization/TableInitializer";
import type TableRow from "../types/TableRow";
import type Theme from "../types/Theme";

export interface AutoSizeMeasureContext {
  headers: ColumnDef[];
  collapsedHeaders: Set<Accessor>;
  styleRoot: ParentNode | null;
  rows: Row[];
  theme?: Theme;
  icons: ResolvedIcons;
  onRendererHostDiscard?: (host: HTMLElement) => void;
}

/**
 * Content-fit column sizing (`width: "auto"`). Distinct from AutoScaleManager,
 * which stretches already-measured natural widths to fill surplus container space.
 */
const MAX_UNSETTLED_PASSES = 4;

export class AutoSizeManager {
  private autoSizeAccessors: Set<Accessor> = new Set();
  private pendingAutoSize: Set<Accessor> = new Set();
  private naturalWidths: Map<string, number> = new Map();
  private isAutoSizing: boolean = false;
  private unsettledPasses = 0;
  private parkedHosts = new Map<string, HTMLElement[]>();
  private sandbox: HTMLDivElement | null = null;
  private hostDiscard?: (host: HTMLElement) => void;

  getAccessors(): Set<Accessor> {
    return this.autoSizeAccessors;
  }

  getNaturalWidths(): Map<string, number> {
    return this.naturalWidths;
  }

  hasPending(): boolean {
    return this.pendingAutoSize.size > 0;
  }

  recomputeAccessors(headers: ColumnDef[], collapsedHeaders: Set<Accessor>): void {
    this.autoSizeAccessors = computeAutoSizeAccessors(headers, collapsedHeaders);
    this.pendingAutoSize = new Set(this.autoSizeAccessors);
    this.unsettledPasses = 0;
    this.discardAllParked();
  }

  queuePendingFromAccessors(): void {
    this.autoSizeAccessors.forEach((accessor) => this.pendingAutoSize.add(accessor));
    this.unsettledPasses = 0;
  }

  /** Drop parked renderer samples so the next measure reads the current rows. */
  discardParkedSamples(): void {
    this.discardAllParked();
  }

  /**
   * A drag chose this column's width. Later content re-measures skip it until
   * the column definitions are applied again.
   */
  releaseAccessors(accessors: Iterable<Accessor>): void {
    for (const accessor of accessors) {
      this.autoSizeAccessors.delete(accessor);
      this.pendingAutoSize.delete(accessor);
      this.discardParked(String(accessor));
    }
  }

  dispose(): void {
    this.discardAllParked();
    this.sandbox?.remove();
    this.sandbox = null;
  }

  clearNaturalWidths(): void {
    this.naturalWidths.clear();
  }

  recordNaturalWidths(widths: Map<string, number>): void {
    widths.forEach((width, accessor) => this.naturalWidths.set(accessor, width));
  }

  /**
   * Shrink floors for auto-expand column resize, keyed by accessor. Each
   * visible leaf's floor is its natural width — a user-set / content-measured
   * override when present, else the pixel width declared in the column
   * definitions — raised to at least its `minWidth`.
   */
  getShrinkFloors(
    headers: ColumnDef[],
    collapsedHeaders: Set<Accessor>,
    pristineDefaultHeaders: ColumnDef[],
  ): Map<string, number> {
    const declared = new Map<string, number>();
    const visitDeclared = (h: ColumnDef): void => {
      if (h.children && h.children.length > 0) {
        h.children.forEach(visitDeclared);
      }
      if (typeof h.width === "number") {
        declared.set(String(h.accessor), h.width);
      } else if (typeof h.width === "string" && h.width.trim().endsWith("px")) {
        const px = parseFloat(h.width);
        if (Number.isFinite(px)) declared.set(String(h.accessor), px);
      }
    };
    pristineDefaultHeaders.forEach(visitDeclared);

    const floors = new Map<string, number>();
    const leaves = getAllVisibleLeafHeaders(headers, collapsedHeaders);
    for (const leaf of leaves) {
      const key = String(leaf.accessor);
      const natural = this.naturalWidths.get(key) ?? declared.get(key);
      floors.set(key, Math.max(natural ?? 0, getHeaderMinWidth(leaf)));
    }
    return floors;
  }

  /**
   * Measure pending auto columns. Returns updated headers when widths changed;
   * otherwise null (nothing to apply). Always clears the pending set after a
   * successful measure pass so we do not retry every render.
   */
  maybeMeasure(ctx: AutoSizeMeasureContext): ColumnDef[] | null {
    if (this.isAutoSizing || this.pendingAutoSize.size === 0) return null;

    const { styleRoot } = ctx;
    const ready = Boolean(
      styleRoot instanceof HTMLElement && styleRoot.querySelector(".st-header-cell"),
    );
    if (!ready) return null;

    this.isAutoSizing = true;
    this.hostDiscard = ctx.onRendererHostDiscard;
    try {
      const leaves = getAllVisibleLeafHeaders(ctx.headers, ctx.collapsedHeaders);
      const leafByAccessor = new Map(leaves.map((leaf) => [leaf.accessor, leaf]));

      const widths = new Map<Accessor, number>();
      const unsettled = new Set<Accessor>();
      const forceSettle = this.unsettledPasses >= MAX_UNSETTLED_PASSES;
      for (const accessor of this.pendingAutoSize) {
        const leaf = leafByAccessor.get(accessor);
        if (!leaf) continue;
        const key = String(accessor);
        const { width, settled } = calculateHeaderContentWidth(accessor, {
          rows: ctx.rows,
          header: leaf,
          styleRoot,
          theme: ctx.theme,
          autoSizeMode: leaf.autoSizeMode,
          sortIcon: ctx.icons.sortUp,
          filterIcon: ctx.icons.filter,
          expandIcon: ctx.icons.expand,
          onRendererHostDiscard: ctx.onRendererHostDiscard,
          parkedHosts: this.parkedHosts.get(key),
          parkAsyncHost: (host) => this.parkHost(key, host),
          discardParkedHosts: () => this.discardParked(key, ctx.onRendererHostDiscard),
          forceSettle,
        });
        if (!settled) {
          unsettled.add(accessor);
          continue;
        }
        widths.set(accessor, width);
      }

      this.pendingAutoSize.clear();
      if (unsettled.size > 0) {
        this.unsettledPasses += 1;
        if (this.unsettledPasses <= MAX_UNSETTLED_PASSES) {
          unsettled.forEach((accessor) => this.pendingAutoSize.add(accessor));
        } else {
          this.unsettledPasses = 0;
          unsettled.forEach((accessor) =>
            this.discardParked(String(accessor), ctx.onRendererHostDiscard),
          );
        }
      } else {
        this.unsettledPasses = 0;
      }
      if (widths.size === 0) return null;

      let changed = false;
      for (const [accessor, width] of widths) {
        const leaf = leafByAccessor.get(accessor);
        const current =
          typeof leaf?.width === "number"
            ? leaf.width
            : this.naturalWidths.get(String(accessor));
        if (current !== width) {
          changed = true;
          break;
        }
      }
      if (!changed) return null;

      return applyMeasuredWidths(ctx.headers, widths, this.naturalWidths);
    } finally {
      this.isAutoSizing = false;
    }
  }

  private ensureSandbox(): HTMLDivElement {
    if (this.sandbox?.isConnected) return this.sandbox;
    const sandbox = document.createElement("div");
    sandbox.setAttribute("data-st-autosize-sandbox", "");
    sandbox.style.position = "absolute";
    sandbox.style.left = "-99999px";
    sandbox.style.top = "0";
    sandbox.style.visibility = "hidden";
    sandbox.style.pointerEvents = "none";
    document.body.appendChild(sandbox);
    this.sandbox = sandbox;
    return sandbox;
  }

  private parkHost(accessor: string, host: HTMLElement): void {
    this.ensureSandbox().appendChild(host);
    const list = this.parkedHosts.get(accessor) ?? [];
    list.push(host);
    this.parkedHosts.set(accessor, list);
  }

  private discardParked(
    accessor: string,
    onDiscard?: (host: HTMLElement) => void,
  ): void {
    const list = this.parkedHosts.get(accessor);
    if (!list) return;
    const discard = onDiscard ?? this.hostDiscard;
    for (const host of list) {
      discard?.(host);
      host.remove();
    }
    this.parkedHosts.delete(accessor);
  }

  private discardAllParked(): void {
    this.parkedHosts.forEach((_hosts, accessor) => this.discardParked(accessor));
  }
}

export const getAutoSizeStyleRoot = (refs: {
  mainBodyRef?: { current: HTMLElement | null };
  mainHeaderRef?: { current: HTMLElement | null };
  pinnedLeftHeaderRef?: { current: HTMLElement | null };
  pinnedRightHeaderRef?: { current: HTMLElement | null };
}): ParentNode | null => {
  const anchor =
    refs.mainBodyRef?.current ??
    refs.mainHeaderRef?.current ??
    refs.pinnedLeftHeaderRef?.current ??
    refs.pinnedRightHeaderRef?.current;
  if (!anchor) return null;
  return anchor.closest(".simple-table-root") ?? anchor;
};

export const getAutoSizeMeasureRows = (args: {
  enablePagination?: boolean;
  serverSidePagination?: boolean;
  currentTableRows?: TableRow[];
  localRows: Row[];
}): Row[] => {
  if (args.enablePagination && !args.serverSidePagination && args.currentTableRows) {
    const pageRows = args.currentTableRows
      .filter((tr) => tr.row && !tr.stateIndicator && !tr.isLoadingSkeleton && !tr.nestedTable)
      .map((tr) => tr.row);
    if (pageRows.length > 0) return pageRows;
  }
  return args.localRows;
};

const isAutoSizeLeaf = (header: ColumnDef): boolean => {
  if (header.isSelectionColumn) return false;
  return isAutoWidth(header);
};

const computeAutoSizeAccessors = (
  headers: ColumnDef[],
  collapsedHeaders: Set<Accessor>,
): Set<Accessor> => {
  const set = new Set<Accessor>();
  const leaves = getAllVisibleLeafHeaders(headers, collapsedHeaders);
  for (const leaf of leaves) {
    if (isAutoSizeLeaf(leaf)) set.add(leaf.accessor);
  }
  return set;
};

const applyMeasuredWidths = (
  headers: ColumnDef[],
  widths: Map<Accessor, number>,
  naturalWidths: Map<string, number>,
): ColumnDef[] => {
  const apply = (h: ColumnDef): ColumnDef => {
    const next = { ...h };
    if (widths.has(h.accessor)) {
      next.width = widths.get(h.accessor) as number;
    }
    if (h.children && h.children.length > 0) {
      next.children = h.children.map(apply);
    }
    return next;
  };
  const nextHeaders = headers.map(apply);
  widths.forEach((width, accessor) => naturalWidths.set(String(accessor), width));
  return nextHeaders;
};
