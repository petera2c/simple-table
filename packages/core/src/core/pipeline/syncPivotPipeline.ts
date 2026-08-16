import type ColumnDef from "../../types/ColumnDef";
import type { Accessor } from "../../types/ColumnDef";
import type { SimpleTableConfig } from "../../types/SimpleTableConfig";
import type { CustomTheme } from "../../types/CustomTheme";
import type Row from "../../types/Row";
import type { PivotManager } from "../../managers/PivotManager";
import type { FilterManager } from "../../managers/FilterManager";
import type { SortManager } from "../../managers/SortManager";
import type { SelectionManager } from "../../managers/SelectionManager";
import type { DimensionManager } from "../../managers/DimensionManager";
import type ExpandedDepthsManager from "../../hooks/expandedDepths";
import type { RenderOrchestrator } from "../rendering/RenderOrchestrator";
import { TableInitializer } from "../initialization/TableInitializer";
import { deepClone } from "../../utils/generalUtils";

/** Pivot emits a flat matrix, so consumer row grouping is off while pivot is active. */
export const getEffectiveRowGrouping = (
  pivotActive: boolean | undefined,
  rowGrouping: Accessor[] | undefined,
): Accessor[] | undefined => {
  if (pivotActive) return undefined;
  return rowGrouping;
};

export interface PivotPipelineInput {
  pivotManager: PivotManager;
  filterManager: FilterManager | null;
  sortManager: SortManager | null;
  selectionManager: SelectionManager | null;
  dimensionManager: DimensionManager | null;
  expandedDepthsManager: ExpandedDepthsManager | null;
  renderOrchestrator: RenderOrchestrator;
  config: SimpleTableConfig;
  customTheme: CustomTheme;
  localRows: Row[];
  pristineDefaultHeaders: ColumnDef[];
  headers: ColumnDef[];
  essentialAccessors: Set<string>;
  collapsedHeaders: Set<Accessor>;
  filteredSourceRows?: Row[];
}

export interface PivotPipelineResult {
  headers: ColumnDef[];
  essentialAccessors: Set<string>;
  collapsedHeaders: Set<Accessor>;
}

/**
 * Recomputes pivot from filtered source rows and updates sort, selection, and
 * dimension managers. When pivot is off, sort sees the filtered source rows.
 */
export const syncPivotPipeline = (input: PivotPipelineInput): PivotPipelineResult => {
  const sourceRows =
    input.filteredSourceRows ?? input.filterManager?.getFilteredRows() ?? input.localRows;
  const wasActive = input.pivotManager.isActive();

  input.pivotManager.updateConfig({
    sourceRows,
    fieldHeaders: input.pristineDefaultHeaders,
    pivot: input.config.pivot ?? null,
  });

  const state = input.pivotManager.getState();
  let headers = input.headers;
  let essentialAccessors = input.essentialAccessors;
  let collapsedHeaders = input.collapsedHeaders;

  const pushEffectiveHeaders = (nextHeaders: ColumnDef[]) => {
    if (!input.dimensionManager) return;
    const effectiveHeaders = input.renderOrchestrator.computeEffectiveHeaders(
      nextHeaders,
      input.config,
      input.customTheme,
    );
    input.dimensionManager.updateConfig({ effectiveHeaders });
  };

  if (state.active) {
    headers = state.headers;
    essentialAccessors = TableInitializer.buildEssentialAccessors(headers);
    input.sortManager?.updateConfig({
      tableRows: state.pivotedRows,
      headers: state.headers,
      rowGrouping: undefined,
    });
    input.selectionManager?.updateConfig({ headers: state.headers });
    input.expandedDepthsManager?.updateRowGrouping(undefined);
    if (!wasActive) {
      collapsedHeaders = TableInitializer.getInitialCollapsedHeaders(state.headers);
    }
    pushEffectiveHeaders(headers);
  } else {
    if (wasActive) {
      headers = deepClone(input.pristineDefaultHeaders);
      essentialAccessors = TableInitializer.buildEssentialAccessors(headers);
      collapsedHeaders = TableInitializer.getInitialCollapsedHeaders(headers);
      input.expandedDepthsManager?.updateRowGrouping(input.config.rowGrouping);
      pushEffectiveHeaders(headers);
    }
    input.sortManager?.updateConfig({
      tableRows: sourceRows,
      headers,
      rowGrouping: input.config.rowGrouping,
    });
    input.selectionManager?.updateConfig({ headers });
  }

  return { headers, essentialAccessors, collapsedHeaders };
};
