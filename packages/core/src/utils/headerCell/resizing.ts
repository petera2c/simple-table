import { TABLE_HEADER_CELL_WIDTH_DEFAULT } from "../../consts/general-consts";
import HeaderObject, { Accessor } from "../../types/HeaderObject";
import { getCellId } from "../cellUtils";
import {
  calculateHeaderContentWidth,
  getAllVisibleLeafHeaders,
  removeAllFractionalWidths,
} from "../headerWidthUtils";
import {
  getHeaderIndexPath,
  getSiblingArray,
  setSiblingArray,
} from "../../managers/DragHandlerManager";
import { applyColumnAutoFitWithAutoExpand, handleResizeStart } from "../resizeUtils";
import { updateColumnWidthsInDOM } from "../resizeUtils/domUpdates";
import { HeaderRenderContext } from "./types";
import { addTrackedEventListener, throttle } from "./eventTracking";

const getStyleRoot = (context: HeaderRenderContext): ParentNode | null => {
  const main = context.mainBodyRef?.current;
  if (!main) return null;
  return main.closest(".simple-table-root") ?? main;
};

const findHeaderInTree = (roots: HeaderObject[], accessor: Accessor): HeaderObject | undefined => {
  for (const h of roots) {
    if (h.accessor === accessor) return h;
    if (h.children?.length) {
      const found = findHeaderInTree(h.children, accessor);
      if (found) return found;
    }
  }
  return undefined;
};

/** Align storage `width` with painted layout so auto-expand resize math matches the viewport. */
const syncVisibleLeafWidthsFromDom = (
  roots: HeaderObject[],
  collapsedHeaders: Set<Accessor> | undefined,
): void => {
  const leaves = getAllVisibleLeafHeaders(roots, collapsedHeaders);
  for (const leaf of leaves) {
    const cell = document.getElementById(
      getCellId({ accessor: leaf.accessor, rowId: "header" }),
    );
    const w = cell?.offsetWidth;
    if (w != null && w > 0) {
      leaf.width = w;
    }
  }
};

export const createResizeHandle = (
  header: HeaderObject,
  context: HeaderRenderContext,
  isLastMainAutoExpandColumn: boolean,
): HTMLElement | null => {
  const { columnResizing } = context;
  const isSelectionColumn = header.isSelectionColumn && context.enableRowSelection;

  if (!columnResizing || isSelectionColumn || isLastMainAutoExpandColumn) {
    return null;
  }

  const resizeContainer = document.createElement("div");
  resizeContainer.className = "st-header-resize-handle-container";
  resizeContainer.setAttribute("role", "separator");
  resizeContainer.setAttribute("aria-label", `Resize ${header.label} column`);
  resizeContainer.setAttribute("aria-orientation", "vertical");

  const resizeHandle = document.createElement("div");
  resizeHandle.className = "st-header-resize-handle";
  resizeContainer.appendChild(resizeHandle);

  const measureOptions = (leafHeader: HeaderObject) => ({
    rows: context.rows,
    header: leafHeader,
    maxWidth: 500,
    sampleSize: 50,
    styleRoot: getStyleRoot(context),
  });

  /** Auto-expand: mutate canonical storage + DOM-synced widths. Otherwise: effective tree (matches main). */
  const resolveResizeHeaders = (): { headers: HeaderObject[]; header: HeaderObject } => {
    if (context.autoExpandColumns) {
      const storage = context.getHeaders();
      syncVisibleLeafWidthsFromDom(storage, context.collapsedHeaders);
      const storageHeader = findHeaderInTree(storage, header.accessor) ?? header;
      return { headers: storage, header: storageHeader };
    }
    return { headers: context.headers, header };
  };

  const performAutoFit = () => {
    const headerCell = document.getElementById(
      getCellId({ accessor: header.accessor, rowId: "header" }),
    );

    if (context.autoExpandColumns) {
      const { headers: resizeHeaders, header: resizeHeader } = resolveResizeHeaders();
      applyColumnAutoFitWithAutoExpand({
        header: resizeHeader,
        headers: resizeHeaders,
        collapsedHeaders: context.collapsedHeaders,
        containerWidth: context.containerWidth,
        mainBodyRef: context.mainBodyRef,
        reverse: context.reverse,
        headerCellElement: headerCell,
        getTargetLeafWidth: (leafHeader) =>
          calculateHeaderContentWidth(leafHeader.accessor, measureOptions(leafHeader)),
      });
      const next = [...resizeHeaders];
      context.setHeaders(next);
      if (context.onColumnWidthChange) {
        context.onColumnWidthChange(next);
      }
      return;
    }

    const contentWidth = calculateHeaderContentWidth(header.accessor, measureOptions(header));

    const path = getHeaderIndexPath(context.headers, header.accessor);
    if (!path) return;

    const siblings = getSiblingArray(context.headers, path);
    const headerIndex = path[path.length - 1];

    const updatedSiblings = siblings.map((h, i) =>
      i === headerIndex ? { ...h, width: contentWidth } : h,
    );

    const updatedHeaders = setSiblingArray(context.headers, path, updatedSiblings);

    updatedHeaders.forEach((h) => removeAllFractionalWidths(h));

    const pathLeaf = updatedSiblings[headerIndex];
    const override = new Map<string, number>();
    if (pathLeaf && typeof pathLeaf.width === "number") {
      override.set(String(pathLeaf.accessor), pathLeaf.width);
    }

    updateColumnWidthsInDOM(updatedHeaders, context.collapsedHeaders as Set<string>, override);

    context.setHeaders(updatedHeaders);

    if (context.onColumnWidthChange) {
      context.onColumnWidthChange(updatedHeaders);
    }
  };

  let lastAutoFitAt = 0;
  const runAutoFitDebounced = () => {
    const now = Date.now();
    if (now - lastAutoFitAt < 120) return;
    lastAutoFitAt = now;
    performAutoFit();
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (event.detail >= 2) {
      event.preventDefault();
      runAutoFitDebounced();
      return;
    }
    const startWidth = document.getElementById(
      getCellId({ accessor: header.accessor, rowId: "header" }),
    )?.offsetWidth;

    throttle(() => {
      const { headers: resizeHeaders, header: resizeHeader } = resolveResizeHeaders();
      handleResizeStart({
        autoExpandColumns: context.autoExpandColumns,
        collapsedHeaders: context.collapsedHeaders,
        containerWidth: context.containerWidth,
        event: event,
        forceUpdate: context.forceUpdate,
        header: resizeHeader,
        headers: resizeHeaders,
        mainBodyRef: context.mainBodyRef,
        onColumnWidthChange: context.onColumnWidthChange,
        pinnedLeftRef: context.pinnedLeftRef,
        pinnedRightRef: context.pinnedRightRef,
        reverse: context.reverse,
        setHeaders: context.setHeaders,
        setIsResizing: context.setIsResizing,
        startWidth: startWidth ?? TABLE_HEADER_CELL_WIDTH_DEFAULT,
      });
    }, 10);
  };

  addTrackedEventListener(resizeContainer, "mousedown", handleMouseDown as EventListener);

  const handleTouchStart = (event: Event) => {
    const touchEvent = event as globalThis.TouchEvent;
    const startWidth = document.getElementById(
      getCellId({ accessor: header.accessor, rowId: "header" }),
    )?.offsetWidth;

    throttle(() => {
      const { headers: resizeHeaders, header: resizeHeader } = resolveResizeHeaders();
      handleResizeStart({
        autoExpandColumns: context.autoExpandColumns,
        collapsedHeaders: context.collapsedHeaders,
        containerWidth: context.containerWidth,
        event: touchEvent as any,
        forceUpdate: context.forceUpdate,
        header: resizeHeader,
        headers: resizeHeaders,
        mainBodyRef: context.mainBodyRef,
        onColumnWidthChange: context.onColumnWidthChange,
        pinnedLeftRef: context.pinnedLeftRef,
        pinnedRightRef: context.pinnedRightRef,
        reverse: context.reverse,
        setHeaders: context.setHeaders,
        setIsResizing: context.setIsResizing,
        startWidth: startWidth ?? TABLE_HEADER_CELL_WIDTH_DEFAULT,
      });
    }, 10);
  };

  addTrackedEventListener(resizeContainer, "touchstart", handleTouchStart);

  addTrackedEventListener(resizeContainer, "dblclick", runAutoFitDebounced as EventListener);

  return resizeContainer;
};
