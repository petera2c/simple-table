import type { TableAPIContextHost } from "../api/buildTableAPIContext";
import type { VanillaLiveHost } from "./VanillaLiveHost";

export const toTableAPIContextHost = (host: VanillaLiveHost): TableAPIContextHost => ({
  getConfig: () => host.getConfig(),
  getLocalRows: () => host.getLocalRows(),
  getHeaders: () => host.getHeaders(),
  applyHeaders: (headers) => host.applyHeaders(headers),
  getPristineDefaultHeaders: () => host.getPristineDefaultHeaders(),
  getEssentialAccessors: () => host.getEssentialAccessors(),
  getCustomTheme: () => host.getCustomTheme(),
  getCurrentPage: () => host.getCurrentPage(),
  setCurrentPage: (page) => host.setCurrentPage(page),
  getExpandedRows: () => host.getExpandedRows(),
  getCollapsedRows: () => host.getCollapsedRows(),
  getExpandedDepths: () => host.getExpandedDepths(),
  clearExpandedRows: () => host.clearExpandedRows(),
  clearCollapsedRows: () => host.clearCollapsedRows(),
  getRowStateMap: () => host.getRowStateMap(),
  getHeaderRegistry: () => host.getHeaderRegistry(),
  getCellRegistry: () => host.getCellRegistry(),
  isCellAnimating: (cellId) => host.isCellAnimating(cellId),
  hasAnimatingCells: () => host.hasAnimatingCells(),
  getColumnEditorOpen: () => host.getColumnEditorOpen(),
  setColumnEditorOpen: (open) => {
    host.setColumnEditorOpen(open);
    host.onRender("columnEditor-toggle");
  },
  getExpandedDepthsManager: () => host.getExpandedDepthsManager(),
  getSelectionManager: () => host.getSelectionManager(),
  getRowSelectionManager: () => host.getRowSelectionManager(),
  getSortManager: () => host.getSortManager(),
  getFilterManager: () => host.getFilterManager(),
  getCachedFlattenResult: () => host.getRenderOrchestrator().getCachedFlattenResult(),
  getCachedProcessedResult: () => host.getRenderOrchestrator().getLastProcessedResult(),
  getEffectiveRowGrouping: () => host.getEffectiveRowGrouping(),
  setPivot: (pivotConfig) => host.applyPivot(pivotConfig),
  getPivot: () => host.getPivotManager()?.getPivot() ?? host.getConfig().pivot ?? null,
  getPivotHeaders: () => {
    const state = host.getPivotManager()?.getState();
    if (state?.active) return state.headers;
    return host.getHeaders();
  },
  getPivotedRows: () => {
    const state = host.getPivotManager()?.getState();
    if (state?.active) return state.pivotedRows;
    return host.getLocalRows();
  },
  onRender: () => host.onRender("columnEditor-onRender"),
  invalidateRowsCache: () => {
    host.getRenderOrchestrator().invalidateCache("body");
  },
  runWithoutAnimationSnapshot: (fn) => host.runWithoutAnimationSnapshot(fn),
  computeEffectiveHeaders: () =>
    host
      .getRenderOrchestrator()
      .computeEffectiveHeaders(host.getHeaders(), host.getConfig(), host.getCustomTheme()),
});
