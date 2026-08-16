import type { SimpleTableConfig } from "../../types/SimpleTableConfig";
import type { CustomTheme } from "../../types/CustomTheme";
import type ColumnDef from "../../types/ColumnDef";
import type { Accessor } from "../../types/ColumnDef";
import type { DOMRefs } from "../dom/DOMManager";
import { DimensionManager } from "../../managers/DimensionManager";
import { ScrollManager } from "../../managers/ScrollManager";
import { SectionScrollController } from "../../managers/SectionScrollController";
import { AutoScaleManager } from "../../managers/AutoScaleManager";
import { SelectionManager } from "../../managers/SelectionManager";
import WindowResizeManager from "../../hooks/windowResize";
import HandleOutsideClickManager from "../../hooks/handleOutsideClick";
import ScrollbarVisibilityManager from "../../hooks/scrollbarVisibility";
import { calculateScrollbarWidth } from "../../hooks/scrollbarWidth";
import type { RenderOrchestrator } from "../rendering/RenderOrchestrator";

export interface MountManagersHost {
  getConfig(): SimpleTableConfig;
  getCustomTheme(): CustomTheme;
  getHeaders(): ColumnDef[];
  getCollapsedHeaders(): Set<Accessor>;
  getLocalRowCount(): number;
  getIsResizing(): boolean;
  getSelectionManager(): SelectionManager | null;
  getRenderOrchestrator(): RenderOrchestrator;
  onRender(source: string): void;
  onFirstDimensionPaint(): void;
  onScrollbarVisibilityChange(isScrollable: boolean, scrollbarWidth: number): void;
  onScrollbarWidthChange(scrollbarWidth: number): void;
}

export interface MountManagers {
  dimensionManager: DimensionManager;
  scrollManager: ScrollManager;
  sectionScrollController: SectionScrollController;
  autoScaleManager: AutoScaleManager | null;
  scrollbarVisibilityManager: ScrollbarVisibilityManager | null;
  windowResizeManager: WindowResizeManager;
  handleOutsideClickManager: HandleOutsideClickManager | null;
  scrollbarWidth: number;
}

/**
 * Constructs managers that need the mounted DOM (dimensions, scroll sync,
 * auto-expand, scrollbar, outside-click).
 */
export const wireMountManagers = (host: MountManagersHost, refs: DOMRefs): MountManagers | null => {
  if (!refs.tableBodyContainerRef.current) return null;

  const config = host.getConfig();
  const customTheme = host.getCustomTheme();
  let scrollbarWidth = calculateScrollbarWidth(refs.tableBodyContainerRef.current);

  const effectiveHeaders = host
    .getRenderOrchestrator()
    .computeEffectiveHeaders(host.getHeaders(), config, customTheme);

  const dimensionManager = new DimensionManager({
    effectiveHeaders,
    headerHeight: customTheme.headerHeight,
    rowHeight: customTheme.rowHeight,
    height: config.height,
    maxHeight: config.maxHeight,
    // Use totalRowCount when set (server-side pages) so the root can scroll once data overflows maxHeight.
    totalRowCount: config.totalRowCount ?? host.getLocalRowCount(),
    footerHeight:
      (config.enablePagination || config.footerRenderer) && !config.hideFooter
        ? customTheme.footerHeight
        : undefined,
    containerElement: refs.tableBodyContainerRef.current,
  });

  let firstPaint = true;
  dimensionManager.subscribe(() => {
    host.onRender("dimensionManager");
    if (firstPaint) {
      firstPaint = false;
      host.onFirstDimensionPaint();
    }
  });

  const scrollManager = new ScrollManager({
    onLoadMore: config.onLoadMore,
    infiniteScrollThreshold: config.infiniteScrollThreshold ?? 200,
  });

  const sectionScrollController = new SectionScrollController({
    onMainSectionScrollLeft: (scrollLeft) => {
      const sel = host.getSelectionManager();
      const liveConfig = host.getConfig();
      const liveSelection =
        sel && (liveConfig.selectableCells || liveConfig.selectableColumns)
          ? {
              columnsWithSelectedCells: sel.getColumnsWithSelectedCells(),
              selectedColumns: sel.getSelectedColumns(),
            }
          : undefined;
      host.getRenderOrchestrator().virtualizeMainColumnsForScroll(scrollLeft, liveSelection);
    },
  });

  let autoScaleManager: AutoScaleManager | null = null;
  if (config.autoExpandColumns) {
    autoScaleManager = new AutoScaleManager(
      {
        autoExpandColumns: config.autoExpandColumns,
        containerWidth: dimensionManager.getState().containerWidth,
        pinnedLeftWidth: 0,
        pinnedRightWidth: 0,
        mainBodyRef: refs.mainBodyRef,
        isResizing: host.getIsResizing(),
        collapsedHeaders: host.getCollapsedHeaders(),
      },
      () => {
        host.onRender("autoScaleManager");
      },
    );
  }

  let scrollbarVisibilityManager: ScrollbarVisibilityManager | null = null;
  if (refs.headerContainerRef.current && refs.tableBodyContainerRef.current) {
    scrollbarVisibilityManager = new ScrollbarVisibilityManager({
      headerContainer: refs.headerContainerRef.current,
      mainSection: refs.tableBodyContainerRef.current,
      scrollbarWidth,
    });

    scrollbarVisibilityManager.subscribe((isScrollable) => {
      if (refs.tableBodyContainerRef.current) {
        scrollbarWidth = calculateScrollbarWidth(refs.tableBodyContainerRef.current);
      }
      host.onScrollbarVisibilityChange(isScrollable, scrollbarWidth);
    });
  }

  const windowResizeManager = new WindowResizeManager();
  windowResizeManager.addCallback(() => {
    if (refs.tableBodyContainerRef.current) {
      const newScrollbarWidth = calculateScrollbarWidth(refs.tableBodyContainerRef.current);
      scrollbarWidth = newScrollbarWidth;
      scrollbarVisibilityManager?.setScrollbarWidth(newScrollbarWidth);
      host.onScrollbarWidthChange(newScrollbarWidth);
    }
    host.onRender("scrollbarWidth-change");
  });

  let handleOutsideClickManager: HandleOutsideClickManager | null = null;
  const selectionManager = host.getSelectionManager();
  if (selectionManager) {
    handleOutsideClickManager = new HandleOutsideClickManager({
      selectableColumns: config.selectableColumns ?? false,
      selectedCells: new Set(),
      selectedColumns: new Set(),
      setSelectedCells: (cells) => selectionManager.setSelectedCells(cells),
      setSelectedColumns: (columns) => selectionManager.setSelectedColumns(columns),
      getSelectedCells: () => selectionManager.getSelectedCells(),
      getSelectedColumns: () => selectionManager.getSelectedColumns(),
      onClearSelection: () => selectionManager.clearSelection(),
    });
    handleOutsideClickManager.startListening();
  }

  return {
    dimensionManager,
    scrollManager,
    sectionScrollController,
    autoScaleManager,
    scrollbarVisibilityManager,
    windowResizeManager,
    handleOutsideClickManager,
    scrollbarWidth,
  };
};
