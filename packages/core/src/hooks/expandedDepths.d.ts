import { Accessor } from "../types/HeaderObject";
/**
 * Initialize expandedDepths based on expandAll prop and rowGrouping
 */
export declare const initializeExpandedDepths: (expandAll: boolean, rowGrouping?: Accessor[]) => Set<number>;
/**
 * Manages expanded depths state for row grouping.
 * This is a vanilla JS alternative to the useExpandedDepths hook.
 */
export declare class ExpandedDepthsManager {
    private expandedDepths;
    private observers;
    /** Coalesce sync collapseAll→expandDepth into a single observer notification. */
    private notifyMicrotaskScheduled;
    constructor(expandAll: boolean, rowGrouping?: Accessor[]);
    /**
     * Updates the expanded depths when rowGrouping changes
     * Filters out depths that are now out of range
     * @param rowGrouping - The current row grouping configuration
     */
    updateRowGrouping(rowGrouping?: Accessor[]): void;
    /**
     * Gets the current expanded depths
     * @returns Set of expanded depth numbers
     */
    getExpandedDepths(): Set<number>;
    /**
     * Sets the expanded depths
     * @param depths - New set of expanded depths
     */
    setExpandedDepths(depths: Set<number>): void;
    /**
     * Subscribes to expanded depths changes
     * @param callback - Function to call when depths change
     * @returns Unsubscribe function
     */
    subscribe(callback: (depths: Set<number>) => void): () => void;
    /**
     * Notifies all observers of depth changes.
     * Batched to a microtask so collapseAll() + expandDepth(0) in one turn
     * (marketing "Only Divisions") triggers a single render with the final depths.
     */
    private notifyObservers;
    /**
     * Expands all depths
     */
    expandAll(): void;
    /**
     * Collapses all depths
     */
    collapseAll(): void;
    /**
     * Expands a specific depth
     */
    expandDepth(depth: number): void;
    /**
     * Collapses a specific depth
     */
    collapseDepth(depth: number): void;
    /**
     * Toggles a specific depth
     */
    toggleDepth(depth: number): void;
    /**
     * Cleans up the manager
     */
    destroy(): void;
}
export default ExpandedDepthsManager;
