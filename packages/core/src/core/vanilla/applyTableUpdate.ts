import type { SimpleTableConfigInput } from "../../utils/normalizeConfig";
import { normalizeConfigPatch } from "../../utils/normalizeConfig";
import type ColumnDef from "../../types/ColumnDef";
import type Row from "../../types/Row";
import type { RowData } from "../../types/Row";
import { areCustomThemesEqual } from "../../types/CustomTheme";
import { TableInitializer } from "../initialization/TableInitializer";
import { shouldShowRowSelectionColumn } from "../../utils/rowSelectionUtils";
import { deepClone } from "../../utils/generalUtils";
import type { VanillaLiveHost } from "./VanillaLiveHost";

/**
 * Applies a partial config patch to the live table: rows, columns, theme,
 * selection, viewport, and related managers. Caller wraps this in `isUpdating`
 * and renders once afterward.
 */
export const applyTableUpdate = <TData extends RowData = Row>(
  host: VanillaLiveHost,
  config: Partial<SimpleTableConfigInput<TData>>,
): void => {
  const previousTheme = host.getConfig().theme;
  const patch = normalizeConfigPatch(config as unknown as Partial<SimpleTableConfigInput>);
  host.setConfig({ ...host.getConfig(), ...patch });
  const nextConfig = host.getConfig();
  // Fill in column-editor text and search from the current config.
  host.setMergedColumnEditorConfig(TableInitializer.mergeColumnEditorConfig(nextConfig));
  if (config.icons !== undefined) {
    host.setResolvedIcons(TableInitializer.resolveIcons(nextConfig));
  }
  host.getDomManager().syncShell(nextConfig);

  if (config.animations !== undefined) {
    host.applyAnimationsConfig(config.animations);
  }

  if (config.onRendererHostDiscard !== undefined) {
    host.getAnimationCoordinator().setOnHostDiscard(config.onRendererHostDiscard);
    host.getRenderOrchestrator().setOnRendererHostDiscard(config.onRendererHostDiscard);
  }

  if (config.rows !== undefined) {
    if (host.getFirstRenderDone()) {
      host.captureSnapshot();
    }
    host.setLocalRows([...(config.rows as Row[])]);
    host.rebuildRowIndexMap();

    const filterManager = host.getFilterManager();
    if (filterManager) {
      filterManager.updateConfig({ rows: host.getLocalRows() });
    }
    host.syncPivotPipeline(filterManager?.getFilteredRows() ?? host.getLocalRows());
    host.getAutoSizeManager().queuePendingFromAccessors();
  }

  if (config.pivot !== undefined && config.rows === undefined) {
    host.syncPivotPipeline(host.getFilterManager()?.getFilteredRows() ?? host.getLocalRows());
  }

  if (config.rows !== undefined || config.totalRowCount !== undefined) {
    host.getDimensionManager()?.updateConfig({
      totalRowCount: nextConfig.totalRowCount ?? host.getLocalRows().length,
    });
  }

  if (config.columns !== undefined && !host.getIsResizing()) {
    host.captureSnapshot();
    host.ingestColumnSnapshot(patch.columns as ColumnDef[]);
    const filterManager = host.getFilterManager();
    if (filterManager) {
      filterManager.updateConfig({ headers: host.getPristineDefaultHeaders() });
    }
    if (host.getPivotManager()?.isActive()) {
      host.syncPivotPipeline(filterManager?.getFilteredRows() ?? host.getLocalRows());
    } else {
      const headers = deepClone(host.getPristineDefaultHeaders());
      host.setHeaders(headers);
      host.setEssentialAccessors(TableInitializer.buildEssentialAccessors(headers));
      host.getSortManager()?.updateConfig({ headers });
      host.getSelectionManager()?.updateConfig({ headers });
      const dimensionManager = host.getDimensionManager();
      if (dimensionManager) {
        const effectiveHeaders = host.getRenderOrchestrator().computeEffectiveHeaders(
          headers,
          nextConfig,
          host.getCustomTheme(),
        );
        dimensionManager.updateConfig({ effectiveHeaders });
      }
    }
    host.getAutoSizeManager().recomputeAccessors(host.getHeaders(), host.getCollapsedHeaders());
    host.getAutoSizeManager().clearNaturalWidths();
    host.getRenderOrchestrator().invalidateCache("body");
  }

  if (config.isLoading !== undefined) {
    const wasLoading = host.getInternalIsLoading();
    host.setInternalIsLoading(config.isLoading);
    if (wasLoading && !config.isLoading && host.getAutoSizeManager().getAccessors().size > 0) {
      host.getAutoSizeManager().queuePendingFromAccessors();
    }
  }

  if (config.theme !== undefined) {
    if (config.theme !== previousTheme) {
      host.getRenderOrchestrator().invalidateCache("all");
      host.getRenderOrchestrator().invalidateCustomFooterCache();
    }
  }

  if (config.footerPosition !== undefined) {
    host.getDomManager().syncFooterPosition(nextConfig.footerPosition);
  }

  if (
    config.rows !== undefined ||
    config.footerRenderer !== undefined ||
    config.footerRenderKey !== undefined
  ) {
    host.getRenderOrchestrator().invalidateCustomFooterCache();
  }

  if (config.customTheme !== undefined) {
    const previousCustomTheme = host.getCustomTheme();
    const customTheme = TableInitializer.mergeCustomTheme(nextConfig);
    host.setCustomTheme(customTheme);

    if (!areCustomThemesEqual(previousCustomTheme, customTheme)) {
      host.getSelectionManager()?.updateConfig({
        customTheme,
        rowHeight: customTheme.rowHeight,
      });

      host.getDimensionManager()?.updateConfig({
        headerHeight: customTheme.headerHeight,
        rowHeight: customTheme.rowHeight,
        footerHeight:
          (nextConfig.enablePagination || nextConfig.footerRenderer) && !nextConfig.hideFooter
            ? customTheme.footerHeight
            : undefined,
      });

      if (nextConfig.enablePagination && previousCustomTheme.rowHeight !== customTheme.rowHeight) {
        host.setCurrentPage(1);
      }

      host.getRenderOrchestrator().invalidateCache("all");
    }
  }

  if (
    (config.selectableColumns !== undefined || config.selectableCells !== undefined) &&
    host.getSelectionManager()
  ) {
    host.getSelectionManager()!.updateConfig({
      selectableColumns: nextConfig.selectableColumns ?? false,
      selectableCells: nextConfig.selectableCells ?? false,
    });
  }

  if (
    config.enableRowSelection !== undefined ||
    config.rowSelectionMode !== undefined ||
    config.selectRowOnClick !== undefined ||
    config.showRowSelectionColumn !== undefined ||
    config.rowButtons !== undefined ||
    config.onRowSelectionChange !== undefined ||
    config.selectableCells !== undefined
  ) {
    host.syncRowSelectionManager();
    host.getSelectionManager()?.updateConfig({
      enableRowSelection: shouldShowRowSelectionColumn(nextConfig),
    });
    if (
      config.enableRowSelection !== undefined ||
      config.showRowSelectionColumn !== undefined ||
      config.rowButtons !== undefined
    ) {
      host.getRenderOrchestrator().invalidateCache("header");
      host.getRenderOrchestrator().invalidateCache("all");
      const dimensionManager = host.getDimensionManager();
      if (dimensionManager) {
        const effectiveHeaders = host.getRenderOrchestrator().computeEffectiveHeaders(
          host.getHeaders(),
          nextConfig,
          host.getCustomTheme(),
        );
        dimensionManager.updateConfig({ effectiveHeaders });
      }
    }
  }

  if (config.height !== undefined || config.maxHeight !== undefined) {
    host.getDimensionManager()?.updateConfig({
      height: nextConfig.height,
      maxHeight: nextConfig.maxHeight,
    });
  }

  if (
    config.scrollParent !== undefined ||
    config.height !== undefined ||
    config.maxHeight !== undefined
  ) {
    host.getExternalScrollController().sync();
  }

  if (
    (config.onLoadMore !== undefined || config.infiniteScrollThreshold !== undefined) &&
    host.getScrollManager()
  ) {
    host.getScrollManager()!.updateConfig({
      onLoadMore: nextConfig.onLoadMore,
      infiniteScrollThreshold: nextConfig.infiniteScrollThreshold ?? 200,
    });
  }

  if (
    config.enablePagination !== undefined ||
    config.hideFooter !== undefined ||
    config.footerRenderer !== undefined
  ) {
    const customTheme = host.getCustomTheme();
    host.getDimensionManager()?.updateConfig({
      footerHeight:
        (nextConfig.enablePagination || nextConfig.footerRenderer) && !nextConfig.hideFooter
          ? customTheme.footerHeight
          : undefined,
    });
  }

  if (config.externalFilterHandling !== undefined) {
    host.getFilterManager()?.updateConfig({
      externalFilterHandling: Boolean(nextConfig.externalFilterHandling),
    });
  }

  if (config.externalSortHandling !== undefined || config.rowGrouping !== undefined) {
    host.getSortManager()?.updateConfig({
      externalSortHandling: Boolean(nextConfig.externalSortHandling),
      rowGrouping: host.getEffectiveRowGrouping(),
    });
  }

  if (config.rowGrouping !== undefined) {
    host.getExpandedDepthsManager()?.updateRowGrouping(nextConfig.rowGrouping);
  }

  if (config.copyHeadersToClipboard !== undefined) {
    host.getSelectionManager()?.updateConfig({
      copyHeadersToClipboard: nextConfig.copyHeadersToClipboard,
    });
  }
};
