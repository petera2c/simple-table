import type { NestedTableFactory } from "../../utils/nestedGridRowRenderer";
import type { RenderContext } from "../rendering/RenderContext";
import { buildRenderContext } from "../rendering/buildRenderContext";
import type { VanillaLiveHost } from "./VanillaLiveHost";

export const createVanillaRenderContext = (
  host: VanillaLiveHost,
  createNestedTable: NestedTableFactory,
): RenderContext => {
  const refs = host.getDomManager().getRefs();
  const pivotState = host.getPivotManager()?.getState();
  const config = host.getConfig();
  const effectiveConfig = pivotState?.active ? { ...config, rowGrouping: undefined } : config;
  const effectiveLocalRows = pivotState?.active ? pivotState.pivotedRows : host.getLocalRows();
  const viewportHeight = host.getExternalScrollController().getViewportHeight();

  const applyMapUpdate = <K, V>(
    current: Map<K, V>,
    next: Map<K, V> | ((prev: Map<K, V>) => Map<K, V>),
  ): Map<K, V> => (typeof next === "function" ? next(current) : next);

  return buildRenderContext({
    accordionAxis: host.getAccordionController().getPendingAxis(),
    animationCoordinator: host.getAnimationCoordinator(),
    cellRegistry: host.getCellRegistry(),
    collapsedHeaders: host.getCollapsedHeaders(),
    collapsedRows: host.getCollapsedRows(),
    config: effectiveConfig,
    customTheme: host.getCustomTheme(),
    dimensionManager: host.getDimensionManager(),
    draggedHeaderRef: host.getDraggedHeaderRef(),
    essentialAccessors: host.getEssentialAccessors(),
    expandedDepths: host.getExpandedDepths(),
    expandedRows: host.getExpandedRows(),
    filterManager: host.getFilterManager(),
    headerRegistry: host.getHeaderRegistry(),
    headers: host.getHeaders(),
    hoverScopeId: host.getHoverScopeId(),
    hoveredHeaderRef: host.getHoveredHeaderRef(),
    internalIsLoading: host.getInternalIsLoading(),
    isResizing: host.getIsResizing(),
    localRows: effectiveLocalRows,
    createNestedTable,
    mainBodyRef: refs.mainBodyRef,
    mainHeaderRef: refs.mainHeaderRef,
    pinnedLeftHeaderRef: refs.pinnedLeftHeaderRef,
    pinnedLeftRef: refs.pinnedLeftRef,
    pinnedRightHeaderRef: refs.pinnedRightHeaderRef,
    pinnedRightRef: refs.pinnedRightRef,
    positionOnlyBody: host.getPositionOnlyBody(),
    columnDragging: Boolean(host.getDraggedHeaderRef().current),
    externalViewportHeight: viewportHeight > 0 ? viewportHeight : undefined,
    resolvedIcons: host.getResolvedIcons(),
    rowSelectionManager: host.getRowSelectionManager(),
    rowStateMap: host.getRowStateMap(),
    scrollManager: host.getScrollManager(),
    sectionScrollController: host.getSectionScrollController(),
    selectionManager: host.getSelectionManager(),
    sortManager: host.getSortManager(),
    onRender: () => host.onRender("resizeHandler-onRender"),
    getShrinkFloors: () =>
      host
        .getAutoSizeManager()
        .getShrinkFloors(
          host.getHeaders(),
          host.getCollapsedHeaders(),
          host.getPristineDefaultHeaders(),
        ),
    onAutoExpandNaturalWidths: (widths) => host.getAutoSizeManager().recordNaturalWidths(widths),
    setIsResizing: (value) => {
      host.setIsResizing(value);
      const autoScaleManager = host.getAutoScaleManager();
      if (autoScaleManager && value === false) {
        const liveRefs = host.getDomManager().getRefs();
        const containerWidth =
          liveRefs.tableBodyContainerRef?.current?.clientWidth ??
          liveRefs.mainBodyRef?.current?.clientWidth ??
          host.getDimensionManager()?.getState().containerWidth ??
          0;
        autoScaleManager.updateConfig({
          isResizing: false,
          containerWidth,
        });
      }
    },
    setHeaders: (headers) => host.applyHeaders(headers),
    setCollapsedHeaders: (headers) => {
      host.beginAccordion("horizontal");
      host.setCollapsedHeaders(headers);
    },
    setCollapsedRows: (rowsOrUpdater) => {
      host.beginAccordion("vertical");
      host.setCollapsedRows(applyMapUpdate(host.getCollapsedRows(), rowsOrUpdater));
      host.onRender("expansion");
    },
    setExpandedRows: (rowsOrUpdater) => {
      host.beginAccordion("vertical");
      host.setExpandedRows(applyMapUpdate(host.getExpandedRows(), rowsOrUpdater));
      host.onRender("expansion");
    },
    setRowStateMap: (mapOrUpdater) => {
      host.beginAccordion("vertical");
      host.setRowStateMap(applyMapUpdate(host.getRowStateMap(), mapOrUpdater));
      host.onRender("rowStateMap");
    },
    getCollapsedRows: () => host.getCollapsedRows(),
    getCollapsedHeaders: () => host.getCollapsedHeaders(),
    getExpandedRows: () => host.getExpandedRows(),
    getHeaders: () => host.getHeaders(),
    getPristineDefaultHeaders: () => host.getPristineDefaultHeaders(),
    getPivot: () => host.getPivotManager()?.getPivot() ?? host.getConfig().pivot ?? null,
    setPivot: (pivotConfig) => host.applyPivot(pivotConfig),
    getRowStateMap: () => host.getRowStateMap(),
    setColumnEditorOpen: (open) => host.setColumnEditorOpen(open),
    setCurrentPage: (page) => {
      if (
        page !== host.getCurrentPage() &&
        host.getConfig().enablePagination &&
        !host.getConfig().serverSidePagination
      ) {
        host.getAutoSizeManager().queuePendingFromAccessors();
      }
      host.setCurrentPage(page);
    },
  });
};
