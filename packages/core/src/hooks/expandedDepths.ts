import { Accessor } from "../types/HeaderObject";

/**
 * Initialize expandedDepths based on expandAll prop and rowGrouping
 */
export const initializeExpandedDepths = (
  expandAll: boolean,
  rowGrouping?: Accessor[]
): Set<number> => {
  if (!rowGrouping || rowGrouping.length === 0) return new Set();
  if (expandAll) {
    const depths = Array.from({ length: rowGrouping.length }, (_, i) => i);
    return new Set(depths);
  }
  return new Set();
};

/**
 * Manages expanded depths state for row grouping.
 * This is a vanilla JS alternative to the useExpandedDepths hook.
 */
export class ExpandedDepthsManager {
  private expandedDepths: Set<number>;
  private observers: Set<(depths: Set<number>) => void> = new Set();

  constructor(expandAll: boolean, rowGrouping?: Accessor[]) {
    this.expandedDepths = initializeExpandedDepths(expandAll, rowGrouping);
  }

  /**
   * Updates the expanded depths when rowGrouping changes
   * Filters out depths that are now out of range
   * @param rowGrouping - The current row grouping configuration
   */
  updateRowGrouping(rowGrouping?: Accessor[]): void {
    if (!rowGrouping || rowGrouping.length === 0) {
      this.setExpandedDepths(new Set());
      return;
    }

    const maxDepth = rowGrouping.length;
    // Filter out depths that are now out of range
    const filtered = Array.from(this.expandedDepths).filter((d) => d < maxDepth);
    this.setExpandedDepths(new Set(filtered));
  }

  /**
   * Gets the current expanded depths
   * @returns Set of expanded depth numbers
   */
  getExpandedDepths(): Set<number> {
    return this.expandedDepths;
  }

  /**
   * Sets the expanded depths
   * @param depths - New set of expanded depths
   */
  setExpandedDepths(depths: Set<number>): void {
    this.expandedDepths = depths;
    this.notifyObservers();
  }

  /**
   * Subscribes to expanded depths changes
   * @param callback - Function to call when depths change
   * @returns Unsubscribe function
   */
  subscribe(callback: (depths: Set<number>) => void): () => void {
    this.observers.add(callback);
    return () => {
      this.observers.delete(callback);
    };
  }

  /**
   * Notifies all observers of depth changes
   */
  private notifyObservers(): void {
    this.observers.forEach(callback => callback(this.expandedDepths));
  }

  /**
   * Expands all depths
   */
  expandAll(): void {
    const allDepths = new Set<number>();
    for (let i = 0; i < 10; i++) {
      allDepths.add(i);
    }
    this.setExpandedDepths(allDepths);
  }

  /**
   * Collapses all depths
   */
  collapseAll(): void {
    this.setExpandedDepths(new Set());
  }

  /**
   * Expands a specific depth
   */
  expandDepth(depth: number): void {
    const newDepths = new Set(this.expandedDepths);
    newDepths.add(depth);
    this.setExpandedDepths(newDepths);
  }

  /**
   * Collapses a specific depth
   */
  collapseDepth(depth: number): void {
    const newDepths = new Set(this.expandedDepths);
    newDepths.delete(depth);
    this.setExpandedDepths(newDepths);
  }

  /**
   * Toggles a specific depth
   */
  toggleDepth(depth: number): void {
    if (this.expandedDepths.has(depth)) {
      this.collapseDepth(depth);
    } else {
      this.expandDepth(depth);
    }
  }

  /**
   * Cleans up the manager
   */
  destroy(): void {
    this.observers.clear();
  }
}

export default ExpandedDepthsManager;
