import { UNVIRTUALIZED_ROW_WARNING_THRESHOLD } from "../../consts/general-consts";

const isDevEnvironment = (): boolean => {
  try {
    const proc = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
    return !!proc?.env && proc.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
};

export interface UnvirtualizedRowsWarningHost {
  isMounted(): boolean;
  isVirtualizationDisabled(): boolean;
  getContentHeight(): number | undefined;
  getRenderedRowCount(): number;
  hasScrollParent(): boolean;
}

/**
 * Warns once in development when a large row set is painted with no viewport
 * (`height`, `maxHeight`, or a bounded `scrollParent`).
 */
export class UnvirtualizedRowsWarning {
  private hasWarned = false;
  private timeoutId: number | null = null;
  private host: UnvirtualizedRowsWarningHost;

  constructor(host: UnvirtualizedRowsWarningHost) {
    this.host = host;
  }

  schedule(): void {
    if (!isDevEnvironment()) return;
    if (this.hasWarned) return;
    if (this.timeoutId !== null) return;
    if (typeof window === "undefined") return;
    if (this.host.isVirtualizationDisabled()) return;
    if (this.host.getContentHeight() !== undefined) return;
    if (this.host.getRenderedRowCount() < UNVIRTUALIZED_ROW_WARNING_THRESHOLD) return;

    this.timeoutId = window.setTimeout(() => {
      this.timeoutId = null;
      this.evaluate();
    }, 400);
  }

  destroy(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private evaluate(): void {
    if (this.hasWarned || !this.host.isMounted()) return;
    if (this.host.isVirtualizationDisabled()) return;
    if (this.host.getContentHeight() !== undefined) return;

    const renderedRowCount = this.host.getRenderedRowCount();
    if (renderedRowCount < UNVIRTUALIZED_ROW_WARNING_THRESHOLD) return;

    this.hasWarned = true;

    const parentHint = this.host.hasScrollParent()
      ? ' A `scrollParent` is set but did not produce a bounded viewport — make sure it is an element whose visible height is smaller than its content (e.g. a fixed/max height with `overflow: auto`), or use `"window"`.'
      : "";

    // eslint-disable-next-line no-console
    console.warn(
      `[simple-table] Rendering ${renderedRowCount} rows without virtualization. ` +
        `This can cause slow renders and high memory use. To virtualize, set \`height\` ` +
        `or \`maxHeight\` on the table, or pass a bounded \`scrollParent\`.${parentHint}`,
    );
  }
}
