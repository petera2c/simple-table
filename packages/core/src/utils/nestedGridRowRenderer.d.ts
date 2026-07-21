/**
 * Vanilla equivalent of React NestedGridRow: renders a full-width row that contains
 * a nested SimpleTable when a row has nestedTable config (expandable + nestedTable headers).
 */
import type TableRow from "../types/TableRow";
import type { CustomTheme } from "../types/CustomTheme";
import type { SimpleTableConfig } from "../types/SimpleTableConfig";
import { type HeightOffsets } from "./infiniteScrollUtils";
/**
 * Minimal surface of a table instance this renderer drives. Declared
 * structurally so this module never has to statically import the concrete
 * `SimpleTableVanilla` class — that import would close a cycle
 * (SimpleTableVanilla → RenderOrchestrator → TableRenderer → SectionRenderer →
 * nestedGridRowRenderer → SimpleTableVanilla). The class is injected at render
 * time via {@link NestedTableFactory} instead.
 */
export interface NestedTableInstance {
    mount: () => void;
    destroy: () => void;
}
/** Factory injected by the host table to instantiate a nested table. */
export type NestedTableFactory = (container: HTMLElement, config: SimpleTableConfig) => NestedTableInstance;
export interface NestedGridRowRenderContext {
    rowHeight: number;
    heightOffsets: HeightOffsets | undefined;
    customTheme: CustomTheme;
    theme?: string;
    rowGrouping?: (string | number)[];
    depth: number;
    loadingStateRenderer?: SimpleTableConfig["loadingStateRenderer"];
    errorStateRenderer?: SimpleTableConfig["errorStateRenderer"];
    emptyStateRenderer?: SimpleTableConfig["emptyStateRenderer"];
    icons?: SimpleTableConfig["icons"];
    /** Injected constructor for nested tables (breaks the import cycle). */
    createNestedTable?: NestedTableFactory;
}
/**
 * Creates a nested grid row element: a div with class "st-row st-nested-grid-row"
 * that contains a nested SimpleTableVanilla instance.
 * Returns the row element and a cleanup function to destroy the nested table.
 */
export declare function createNestedGridRow(tableRow: TableRow, context: NestedGridRowRenderContext): {
    element: HTMLElement;
    cleanup: () => void;
};
/**
 * Creates a spacer row for pinned sections: same position/height as a nested grid row
 * but no inner table (keeps scroll height in sync).
 */
export declare function createNestedGridSpacer(tableRow: TableRow, context: Pick<NestedGridRowRenderContext, "rowHeight" | "heightOffsets" | "customTheme">): HTMLElement;
