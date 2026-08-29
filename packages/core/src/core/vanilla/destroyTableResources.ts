import { untrackCellByRow } from "../../utils/bodyCell/styling";

export interface Destroyable {
  destroy(): void;
}

export interface TableDestroyables {
  scrollCoalescer: Destroyable;
  unvirtualizedRowsWarning: Destroyable;
  externalScrollController: Destroyable;
  accordionController: Destroyable;
  dimensionManager: Destroyable | null | undefined;
  scrollManager: Destroyable | null | undefined;
  horizontalScroll: Destroyable | null | undefined;
  sortManager: Destroyable | null | undefined;
  filterManager: Destroyable | null | undefined;
  pivotManager: Destroyable | null | undefined;
  rowSelectionManager: Destroyable | null | undefined;
  selectionManager: Destroyable | null | undefined;
  autoScaleManager: Destroyable | null | undefined;
  windowResizeManager: Destroyable | null | undefined;
  handleOutsideClickManager: Destroyable | null | undefined;
  scrollbarVisibilityManager: Destroyable | null | undefined;
  expandedDepthsManager: Destroyable | null | undefined;
  ariaAnnouncementManager: Destroyable | null | undefined;
  animationCoordinator: Destroyable;
}

export const destroyTableManagers = (managers: TableDestroyables): void => {
  managers.scrollCoalescer.destroy();
  managers.unvirtualizedRowsWarning.destroy();
  managers.externalScrollController.destroy();
  managers.accordionController.destroy();
  managers.dimensionManager?.destroy();
  managers.scrollManager?.destroy();
  managers.horizontalScroll?.destroy();
  managers.sortManager?.destroy();
  managers.filterManager?.destroy();
  managers.pivotManager?.destroy();
  managers.rowSelectionManager?.destroy();
  managers.selectionManager?.destroy();
  managers.autoScaleManager?.destroy();
  managers.windowResizeManager?.destroy();
  managers.handleOutsideClickManager?.destroy();
  managers.scrollbarVisibilityManager?.destroy();
  managers.expandedDepthsManager?.destroy();
  managers.ariaAnnouncementManager?.destroy();
  managers.animationCoordinator.destroy();
};

export const untrackCellsInRoot = (root: HTMLElement): void => {
  root.querySelectorAll<HTMLElement>("[data-row-id]").forEach((el) => {
    const rowId = el.getAttribute("data-row-id");
    if (rowId) untrackCellByRow(rowId, el);
  });
};
